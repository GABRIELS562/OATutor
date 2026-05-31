/**
 * OATutor Content Fix Script
 *
 * Automatically fixes common issues found by validateContent.js:
 * 1. Converts tutoring hint files from object format to array format
 * 2. Renames 'answerChoices' to 'choices' in step files
 *
 * Usage: node fixContentIssues.js [content-source] [--dry-run]
 * Default content-source: sa-caps-maths
 */

const path = require("path");
const fs = require("fs");
const util = require('util');

const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);
const access = util.promisify(fs.access);

// Configuration
const CONTENT_SOURCE = process.argv[2] || 'sa-caps-maths';
const DRY_RUN = process.argv.includes('--dry-run');
const contentSourcePath = path.join(__dirname, '..', 'content-sources', CONTENT_SOURCE);
const problemPoolPath = path.join(contentSourcePath, 'content-pool');

// Statistics
const stats = {
    hintsFixed: 0,
    choicesFixed: 0,
    filesUpdated: 0,
    errors: []
};

// Colors for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Fix tutoring hint file structure
 * Converts object with nested 'hints' array to direct array format
 */
function fixHintFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data;

        try {
            data = JSON.parse(content);
        } catch (e) {
            return { fixed: false, error: `Invalid JSON: ${e.message}` };
        }

        // Check if it's already an array
        if (Array.isArray(data)) {
            return { fixed: false, alreadyCorrect: true };
        }

        // Check if it's an object with a 'hints' array
        if (typeof data === 'object' && data !== null && Array.isArray(data.hints)) {
            // Extract the hints array and wrap each hint properly
            const hintsArray = data.hints.map(hint => {
                // Ensure each hint has proper structure
                return {
                    id: hint.id || `${data.id}-hint`,
                    type: hint.type || 'hint',
                    dependencies: hint.dependencies || [],
                    title: hint.title || '',
                    text: hint.text || '',
                    variabilization: hint.variabilization || {},
                    oer: hint.oer || data.oer || 'DBE NSC',
                    license: hint.license || data.license || 'Public Domain'
                };
            });

            if (!DRY_RUN) {
                fs.writeFileSync(filePath, JSON.stringify(hintsArray, null, 4) + '\n');
            }
            return { fixed: true, hintCount: hintsArray.length };
        }

        // It's an object but doesn't have hints array - convert it to a single-item array
        if (typeof data === 'object' && data !== null) {
            const hintsArray = [{
                id: data.id || 'hint-1',
                type: data.type || 'hint',
                dependencies: data.dependencies || [],
                title: data.title || '',
                text: data.text || '',
                variabilization: data.variabilization || {},
                oer: data.oer || 'DBE NSC',
                license: data.license || 'Public Domain'
            }];

            if (!DRY_RUN) {
                fs.writeFileSync(filePath, JSON.stringify(hintsArray, null, 4) + '\n');
            }
            return { fixed: true, hintCount: 1 };
        }

        return { fixed: false, error: 'Unknown format' };
    } catch (e) {
        return { fixed: false, error: e.message };
    }
}

/**
 * Fix step file: rename answerChoices to choices
 */
function fixStepFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data;

        try {
            data = JSON.parse(content);
        } catch (e) {
            return { fixed: false, error: `Invalid JSON: ${e.message}` };
        }

        let modified = false;

        // Check if it has answerChoices but not choices
        if (data.answerChoices && !data.choices) {
            data.choices = data.answerChoices;
            delete data.answerChoices;
            modified = true;
        }

        // Check if it's MultipleChoice but missing choices
        if (data.problemType === 'MultipleChoice' && !data.choices && data.stepAnswer) {
            // Try to create a basic choices array from the answer
            // This is a fallback - ideally choices should be manually reviewed
            log(`  Warning: ${filePath} needs manual review - MultipleChoice without choices`, 'yellow');
        }

        if (modified) {
            if (!DRY_RUN) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n');
            }
            return { fixed: true };
        }

        return { fixed: false, alreadyCorrect: true };
    } catch (e) {
        return { fixed: false, error: e.message };
    }
}

/**
 * Process a single problem directory
 */
async function processProblem(problemDir) {
    let problemFixed = false;

    // Process steps
    const stepsDir = path.join(problemDir, 'steps');
    try {
        await access(stepsDir, fs.constants.R_OK);
    } catch {
        return false;
    }

    const stepDirs = await readdir(stepsDir);

    for (const stepDir of stepDirs) {
        if (stepDir.startsWith('.') || stepDir.startsWith('_')) continue;

        const stepPath = path.join(stepsDir, stepDir);
        const stat = await lstat(stepPath);
        if (!stat.isDirectory()) continue;

        const stepId = stepDir;

        // Fix step file (answerChoices -> choices)
        const stepJsonPath = path.join(stepPath, `${stepId}.json`);
        try {
            await access(stepJsonPath, fs.constants.R_OK);
            const stepResult = fixStepFile(stepJsonPath);
            if (stepResult.fixed) {
                stats.choicesFixed++;
                problemFixed = true;
                log(`  Fixed answerChoices in ${stepId}`, 'green');
            } else if (stepResult.error) {
                stats.errors.push(`${stepId}: ${stepResult.error}`);
            }
        } catch {
            // Step file doesn't exist
        }

        // Fix tutoring hints
        const tutoringDir = path.join(stepPath, 'tutoring');
        try {
            await access(tutoringDir, fs.constants.R_OK);
        } catch {
            continue;
        }

        const hintFiles = await readdir(tutoringDir);
        for (const hintFile of hintFiles) {
            if (!hintFile.endsWith('.json')) continue;

            const hintPath = path.join(tutoringDir, hintFile);
            const hintResult = fixHintFile(hintPath);

            if (hintResult.fixed) {
                stats.hintsFixed++;
                problemFixed = true;
                log(`  Fixed hint file: ${hintFile} (${hintResult.hintCount} hints)`, 'green');
            } else if (hintResult.error) {
                stats.errors.push(`${stepId}/tutoring/${hintFile}: ${hintResult.error}`);
            }
        }
    }

    if (problemFixed) {
        stats.filesUpdated++;
    }

    return problemFixed;
}

/**
 * Main function
 */
async function main() {
    console.log('\n' + '='.repeat(70));
    log(`  OATutor Content Fix Script - ${CONTENT_SOURCE}`, 'cyan');
    if (DRY_RUN) {
        log('  (DRY RUN - no files will be modified)', 'yellow');
    }
    console.log('='.repeat(70) + '\n');

    // Check content source exists
    try {
        await access(problemPoolPath, fs.constants.R_OK);
    } catch {
        log(`ERROR: Problem pool not found: ${problemPoolPath}`, 'red');
        process.exit(1);
    }

    log('Scanning problem directories...', 'blue');

    // Get all problem directories
    const items = await readdir(problemPoolPath);
    const problemDirs = [];

    for (const item of items) {
        if (item.startsWith('.') || item.startsWith('_')) continue;
        const itemPath = path.join(problemPoolPath, item);
        const stat = await lstat(itemPath);
        if (stat.isDirectory()) {
            problemDirs.push(itemPath);
        }
    }

    log(`Found ${problemDirs.length} problem directories\n`, 'blue');

    // Process each problem
    for (const problemDir of problemDirs) {
        const problemId = path.basename(problemDir);
        const fixed = await processProblem(problemDir);
        if (fixed) {
            log(`Fixed issues in: ${problemId}`, 'cyan');
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    log('  FIX SUMMARY', 'cyan');
    console.log('='.repeat(70) + '\n');

    console.log(`  Hint files fixed:    ${stats.hintsFixed}`);
    console.log(`  Choices renamed:     ${stats.choicesFixed}`);
    console.log(`  Problems updated:    ${stats.filesUpdated}`);

    if (stats.errors.length > 0) {
        log(`\nErrors (${stats.errors.length}):`, 'red');
        stats.errors.forEach(err => console.log(`  - ${err}`));
    }

    if (DRY_RUN) {
        log('\n(DRY RUN - no files were actually modified)', 'yellow');
        log('Run without --dry-run to apply fixes', 'yellow');
    }

    console.log('\n' + '='.repeat(70) + '\n');
}

main().catch(err => {
    log(`Unexpected error: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
});
