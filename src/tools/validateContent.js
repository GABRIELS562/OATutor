/**
 * OATutor Content Validation Script
 *
 * Validates all problem JSON files in content-pool directories.
 * Checks for:
 * - Valid JSON syntax
 * - Required fields in main problem files
 * - Steps directory with step files
 * - Tutoring hints for each step
 * - skillModel.json mappings consistency
 *
 * Usage: node validateContent.js [content-source]
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
const contentSourcePath = path.join(__dirname, '..', 'content-sources', CONTENT_SOURCE);
const problemPoolPath = path.join(contentSourcePath, 'content-pool');
const skillModelPath = path.join(contentSourcePath, 'skillModel.json');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Validation results
const results = {
    totalProblems: 0,
    validProblems: 0,
    errors: [],
    warnings: [],
    stepCount: 0,
    hintCount: 0,
    missingSkillMappings: [],
    orphanedSkillMappings: []
};

// Required fields for main problem JSON
const REQUIRED_PROBLEM_FIELDS = ['id', 'title', 'body'];

// Required fields for step JSON
const REQUIRED_STEP_FIELDS = ['id', 'stepAnswer', 'problemType', 'stepTitle', 'stepBody'];

// Valid problem types
const VALID_PROBLEM_TYPES = ['TextBox', 'MultipleChoice', 'Checkbox', 'Dropdown', 'Matrix'];

// Valid answer types
const VALID_ANSWER_TYPES = ['string', 'number', 'arithmetic', 'algebraic'];

/**
 * Log with color
 */
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Validate JSON syntax
 */
function validateJSON(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
        return { valid: true };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

/**
 * Validate main problem JSON structure
 */
function validateProblemJSON(filePath, problemId) {
    const errors = [];
    const warnings = [];

    const jsonResult = validateJSON(filePath);
    if (!jsonResult.valid) {
        errors.push(`Invalid JSON syntax: ${jsonResult.error}`);
        return { errors, warnings };
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check required fields
    for (const field of REQUIRED_PROBLEM_FIELDS) {
        if (data[field] === undefined || data[field] === null) {
            errors.push(`Missing required field: ${field}`);
        } else if (typeof data[field] === 'string' && data[field].trim() === '') {
            errors.push(`Empty required field: ${field}`);
        }
    }

    // Validate ID matches directory name
    if (data.id && data.id !== problemId) {
        errors.push(`ID mismatch: JSON id "${data.id}" doesn't match directory name "${problemId}"`);
    }

    // Check for recommended fields
    if (!data.oer) {
        warnings.push('Missing recommended field: oer (Open Educational Resource reference)');
    }
    if (!data.license) {
        warnings.push('Missing recommended field: license');
    }
    if (!data.lesson) {
        warnings.push('Missing recommended field: lesson');
    }
    if (!data.courseName) {
        warnings.push('Missing recommended field: courseName');
    }

    // Check variabilization is an object
    if (data.variabilization !== undefined && typeof data.variabilization !== 'object') {
        errors.push('variabilization must be an object');
    }

    return { errors, warnings, data };
}

/**
 * Validate step JSON structure
 */
function validateStepJSON(filePath, stepId, problemId) {
    const errors = [];
    const warnings = [];

    const jsonResult = validateJSON(filePath);
    if (!jsonResult.valid) {
        errors.push(`Invalid JSON syntax: ${jsonResult.error}`);
        return { errors, warnings };
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check required fields
    for (const field of REQUIRED_STEP_FIELDS) {
        if (data[field] === undefined || data[field] === null) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // Validate ID matches directory name
    if (data.id && data.id !== stepId) {
        errors.push(`ID mismatch: JSON id "${data.id}" doesn't match directory name "${stepId}"`);
    }

    // Validate stepAnswer is an array
    if (data.stepAnswer !== undefined && !Array.isArray(data.stepAnswer)) {
        errors.push('stepAnswer must be an array');
    } else if (data.stepAnswer && data.stepAnswer.length === 0) {
        errors.push('stepAnswer array is empty');
    }

    // Validate problemType
    if (data.problemType && !VALID_PROBLEM_TYPES.includes(data.problemType)) {
        warnings.push(`Unknown problemType: ${data.problemType}. Valid types: ${VALID_PROBLEM_TYPES.join(', ')}`);
    }

    // Validate answerType
    if (data.answerType && !VALID_ANSWER_TYPES.includes(data.answerType)) {
        warnings.push(`Unknown answerType: ${data.answerType}. Valid types: ${VALID_ANSWER_TYPES.join(', ')}`);
    }

    // Check for MultipleChoice problems must have choices
    if (data.problemType === 'MultipleChoice' && (!data.choices || !Array.isArray(data.choices) || data.choices.length < 2)) {
        errors.push('MultipleChoice problems must have choices array with at least 2 options');
    }

    // Validate choices contains the answer
    if (data.problemType === 'MultipleChoice' && data.choices && data.stepAnswer) {
        const hasAnswer = data.stepAnswer.some(answer => data.choices.includes(answer));
        if (!hasAnswer) {
            errors.push('stepAnswer not found in choices array');
        }
    }

    // Check knowledgeComponents
    if (data.knowledgeComponents && !Array.isArray(data.knowledgeComponents)) {
        errors.push('knowledgeComponents must be an array');
    }

    return { errors, warnings, data };
}

/**
 * Validate tutoring hints JSON
 */
function validateHintsJSON(filePath, stepId) {
    const errors = [];
    const warnings = [];

    const jsonResult = validateJSON(filePath);
    if (!jsonResult.valid) {
        errors.push(`Invalid JSON syntax: ${jsonResult.error}`);
        return { errors, warnings, hintCount: 0 };
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Hints should be an array
    if (!Array.isArray(data)) {
        errors.push('Tutoring hints file must be an array');
        return { errors, warnings, hintCount: 0 };
    }

    if (data.length === 0) {
        warnings.push('Tutoring hints array is empty');
        return { errors, warnings, hintCount: 0 };
    }

    // Validate each hint
    data.forEach((hint, index) => {
        if (!hint.id) {
            errors.push(`Hint ${index + 1}: Missing id`);
        }
        if (!hint.type) {
            errors.push(`Hint ${index + 1}: Missing type`);
        } else if (!['hint', 'scaffold'].includes(hint.type)) {
            warnings.push(`Hint ${index + 1}: Unknown type "${hint.type}". Expected "hint" or "scaffold"`);
        }
        if (!hint.title) {
            warnings.push(`Hint ${index + 1}: Missing title`);
        }
        if (!hint.text) {
            errors.push(`Hint ${index + 1}: Missing text`);
        }
        if (hint.dependencies && !Array.isArray(hint.dependencies)) {
            errors.push(`Hint ${index + 1}: dependencies must be an array`);
        }

        // Scaffold type should have hintAnswer
        if (hint.type === 'scaffold' && !hint.hintAnswer) {
            warnings.push(`Hint ${index + 1}: scaffold type should have hintAnswer`);
        }
    });

    return { errors, warnings, hintCount: data.length };
}

/**
 * Validate a single problem directory
 */
async function validateProblem(problemDir) {
    const problemId = path.basename(problemDir);
    const problemErrors = [];
    const problemWarnings = [];
    let stepCount = 0;
    let hintCount = 0;

    // Check main problem JSON exists
    const mainJsonPath = path.join(problemDir, `${problemId}.json`);
    try {
        await access(mainJsonPath, fs.constants.R_OK);
    } catch {
        problemErrors.push(`Missing main JSON file: ${problemId}.json`);
        return { problemId, errors: problemErrors, warnings: problemWarnings, valid: false, stepCount: 0, hintCount: 0 };
    }

    // Validate main problem JSON
    const problemValidation = validateProblemJSON(mainJsonPath, problemId);
    problemErrors.push(...problemValidation.errors.map(e => `[Main] ${e}`));
    problemWarnings.push(...problemValidation.warnings.map(w => `[Main] ${w}`));

    // Check steps directory exists
    const stepsDir = path.join(problemDir, 'steps');
    try {
        await access(stepsDir, fs.constants.R_OK);
    } catch {
        problemErrors.push('Missing steps directory');
        return { problemId, errors: problemErrors, warnings: problemWarnings, valid: false, stepCount: 0, hintCount: 0 };
    }

    // Get all step directories
    const stepDirs = await readdir(stepsDir);
    const validStepDirs = stepDirs.filter(d => !d.startsWith('.') && !d.startsWith('_'));

    if (validStepDirs.length === 0) {
        problemErrors.push('No steps found in steps directory');
        return { problemId, errors: problemErrors, warnings: problemWarnings, valid: false, stepCount: 0, hintCount: 0 };
    }

    stepCount = validStepDirs.length;

    // Validate each step
    for (const stepDir of validStepDirs) {
        const stepPath = path.join(stepsDir, stepDir);
        const stepStat = await lstat(stepPath);

        if (!stepStat.isDirectory()) {
            continue;
        }

        const stepId = stepDir;
        const stepJsonPath = path.join(stepPath, `${stepId}.json`);

        // Check step JSON exists
        try {
            await access(stepJsonPath, fs.constants.R_OK);
        } catch {
            problemErrors.push(`[${stepId}] Missing step JSON file`);
            continue;
        }

        // Validate step JSON
        const stepValidation = validateStepJSON(stepJsonPath, stepId, problemId);
        problemErrors.push(...stepValidation.errors.map(e => `[${stepId}] ${e}`));
        problemWarnings.push(...stepValidation.warnings.map(w => `[${stepId}] ${w}`));

        // Check tutoring directory
        const tutoringDir = path.join(stepPath, 'tutoring');
        try {
            await access(tutoringDir, fs.constants.R_OK);
        } catch {
            problemErrors.push(`[${stepId}] Missing tutoring directory`);
            continue;
        }

        // Get hint files
        const hintFiles = await readdir(tutoringDir);
        const validHintFiles = hintFiles.filter(f => f.endsWith('.json'));

        if (validHintFiles.length === 0) {
            problemWarnings.push(`[${stepId}] No tutoring hint files found`);
        }

        // Validate each hint file
        for (const hintFile of validHintFiles) {
            const hintPath = path.join(tutoringDir, hintFile);
            const hintValidation = validateHintsJSON(hintPath, stepId);
            problemErrors.push(...hintValidation.errors.map(e => `[${stepId}/tutoring/${hintFile}] ${e}`));
            problemWarnings.push(...hintValidation.warnings.map(w => `[${stepId}/tutoring/${hintFile}] ${w}`));
            hintCount += hintValidation.hintCount;
        }
    }

    return {
        problemId,
        errors: problemErrors,
        warnings: problemWarnings,
        valid: problemErrors.length === 0,
        stepCount,
        hintCount
    };
}

/**
 * Validate skill model mappings
 */
async function validateSkillModel() {
    const errors = [];
    const warnings = [];
    const mappedSteps = new Set();

    // Check if skillModel.json exists
    try {
        await access(skillModelPath, fs.constants.R_OK);
    } catch {
        errors.push('skillModel.json not found');
        return { errors, warnings, mappedSteps };
    }

    // Validate JSON syntax
    const jsonResult = validateJSON(skillModelPath);
    if (!jsonResult.valid) {
        errors.push(`skillModel.json has invalid JSON: ${jsonResult.error}`);
        return { errors, warnings, mappedSteps };
    }

    const skillModel = JSON.parse(fs.readFileSync(skillModelPath, 'utf8'));

    // Check each mapping
    for (const [stepId, skills] of Object.entries(skillModel)) {
        mappedSteps.add(stepId);

        if (!Array.isArray(skills)) {
            errors.push(`${stepId}: skills must be an array`);
            continue;
        }

        if (skills.length === 0) {
            warnings.push(`${stepId}: empty skills array`);
        }

        // Check for non-string skills
        skills.forEach((skill, index) => {
            if (typeof skill !== 'string') {
                errors.push(`${stepId}: skill at index ${index} must be a string`);
            }
        });
    }

    return { errors, warnings, mappedSteps };
}

/**
 * Main validation function
 */
async function runValidation() {
    console.log('\n' + '='.repeat(70));
    log(`  OATutor Content Validation - ${CONTENT_SOURCE}`, 'cyan');
    console.log('='.repeat(70) + '\n');

    // Check content source exists
    try {
        await access(contentSourcePath, fs.constants.R_OK);
    } catch {
        log(`ERROR: Content source not found: ${contentSourcePath}`, 'red');
        process.exit(1);
    }

    // Check problem pool exists
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

    results.totalProblems = problemDirs.length;
    log(`Found ${results.totalProblems} problem directories\n`, 'blue');

    // Validate each problem
    const allStepIds = new Set();

    for (const problemDir of problemDirs) {
        const validation = await validateProblem(problemDir);

        if (validation.valid) {
            results.validProblems++;
        } else {
            results.errors.push({
                problem: validation.problemId,
                errors: validation.errors
            });
        }

        if (validation.warnings.length > 0) {
            results.warnings.push({
                problem: validation.problemId,
                warnings: validation.warnings
            });
        }

        results.stepCount += validation.stepCount;
        results.hintCount += validation.hintCount;

        // Collect step IDs for skill model validation
        const stepsDir = path.join(problemDir, 'steps');
        try {
            const stepDirs = await readdir(stepsDir);
            stepDirs.forEach(step => {
                if (!step.startsWith('.') && !step.startsWith('_')) {
                    allStepIds.add(step);
                }
            });
        } catch {
            // Steps directory might not exist for invalid problems
        }
    }

    // Validate skill model
    log('Validating skillModel.json...', 'blue');
    const skillValidation = await validateSkillModel();

    if (skillValidation.errors.length > 0) {
        results.errors.push({
            problem: 'skillModel.json',
            errors: skillValidation.errors
        });
    }

    if (skillValidation.warnings.length > 0) {
        results.warnings.push({
            problem: 'skillModel.json',
            warnings: skillValidation.warnings
        });
    }

    // Check for missing skill mappings (steps without skill model entries)
    for (const stepId of allStepIds) {
        if (!skillValidation.mappedSteps.has(stepId)) {
            results.missingSkillMappings.push(stepId);
        }
    }

    // Check for orphaned skill mappings (skill model entries without steps)
    for (const stepId of skillValidation.mappedSteps) {
        if (!allStepIds.has(stepId)) {
            results.orphanedSkillMappings.push(stepId);
        }
    }

    // Print results
    printResults();
}

/**
 * Print validation results
 */
function printResults() {
    console.log('\n' + '='.repeat(70));
    log('  VALIDATION RESULTS', 'bold');
    console.log('='.repeat(70) + '\n');

    // Summary
    log('SUMMARY:', 'cyan');
    console.log(`  Total Problems:  ${results.totalProblems}`);
    console.log(`  Valid Problems:  ${results.validProblems}`);
    console.log(`  Invalid Problems: ${results.totalProblems - results.validProblems}`);
    console.log(`  Total Steps:     ${results.stepCount}`);
    console.log(`  Total Hints:     ${results.hintCount}`);
    console.log();

    // Errors
    if (results.errors.length > 0) {
        log(`ERRORS (${results.errors.length} problems with errors):`, 'red');
        for (const errorGroup of results.errors) {
            log(`\n  ${errorGroup.problem}:`, 'yellow');
            for (const error of errorGroup.errors) {
                console.log(`    - ${error}`);
            }
        }
        console.log();
    } else {
        log('NO ERRORS FOUND', 'green');
        console.log();
    }

    // Warnings
    if (results.warnings.length > 0 && process.argv.includes('--verbose')) {
        log(`WARNINGS (${results.warnings.length} problems with warnings):`, 'yellow');
        for (const warningGroup of results.warnings) {
            log(`\n  ${warningGroup.problem}:`, 'yellow');
            for (const warning of warningGroup.warnings) {
                console.log(`    - ${warning}`);
            }
        }
        console.log();
    } else if (results.warnings.length > 0) {
        log(`${results.warnings.length} problems have warnings (use --verbose to see details)`, 'yellow');
        console.log();
    }

    // Skill model issues
    if (results.missingSkillMappings.length > 0) {
        log(`MISSING SKILL MAPPINGS (${results.missingSkillMappings.length} steps):`, 'yellow');
        if (process.argv.includes('--verbose')) {
            results.missingSkillMappings.forEach(step => {
                console.log(`    - ${step}`);
            });
        } else {
            console.log(`  First 10: ${results.missingSkillMappings.slice(0, 10).join(', ')}${results.missingSkillMappings.length > 10 ? '...' : ''}`);
        }
        console.log();
    }

    if (results.orphanedSkillMappings.length > 0) {
        log(`ORPHANED SKILL MAPPINGS (${results.orphanedSkillMappings.length} entries in skillModel.json without matching steps):`, 'yellow');
        if (process.argv.includes('--verbose')) {
            results.orphanedSkillMappings.forEach(step => {
                console.log(`    - ${step}`);
            });
        } else {
            console.log(`  First 10: ${results.orphanedSkillMappings.slice(0, 10).join(', ')}${results.orphanedSkillMappings.length > 10 ? '...' : ''}`);
        }
        console.log();
    }

    // Final status
    console.log('='.repeat(70));
    if (results.errors.length === 0 && results.orphanedSkillMappings.length === 0) {
        log('  VALIDATION PASSED', 'green');
    } else {
        log('  VALIDATION FAILED', 'red');
    }
    console.log('='.repeat(70) + '\n');

    // Exit with error code if there are errors
    if (results.errors.length > 0) {
        process.exit(1);
    }
}

// Run validation
runValidation().catch(err => {
    log(`Unexpected error: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
});
