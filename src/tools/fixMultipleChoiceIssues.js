/**
 * Fix MultipleChoice problems without choices by converting to TextBox
 */

const fs = require('fs');
const path = require('path');

const contentPoolPath = '/Users/user/Online-tutor-app/OATutor/src/content-sources/sa-caps-maths/content-pool';

const filesToFix = [
    'chem-equil-011/steps/chem-equil-011a/chem-equil-011a.json',
    'chem-equil-011/steps/chem-equil-011b/chem-equil-011b.json',
    'chem-stoich-003/steps/chem-stoich-003a/chem-stoich-003a.json',
    'chem-equil-015/steps/chem-equil-015a/chem-equil-015a.json',
    'chem-equil-014/steps/chem-equil-014b/chem-equil-014b.json',
    'chem-equil-013/steps/chem-equil-013b/chem-equil-013b.json'
];

let fixedCount = 0;

for (const relPath of filesToFix) {
    const filePath = path.join(contentPoolPath, relPath);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        if (data.problemType === 'MultipleChoice' && !data.choices) {
            data.problemType = 'TextBox';
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n');
            console.log(`Fixed: ${relPath}`);
            fixedCount++;
        } else {
            console.log(`Skipped (already fixed or has choices): ${relPath}`);
        }
    } catch (error) {
        console.error(`Error fixing ${relPath}: ${error.message}`);
    }
}

console.log(`\nFixed ${fixedCount} files.`);
