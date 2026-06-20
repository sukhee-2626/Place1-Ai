const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\HP\\placement\\client\\content\\Curious Freaks Coding Sheet - Curious freaks coding sheet.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

const categories = {};
let currentCategory = '';
let currentSubcategory = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Parse CSV line (simple split, handling quotes if needed)
  // Let's do a basic parser that respects double quotes
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  const parts = [];
  let inQuotes = false;
  let currentPart = '';
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(currentPart.trim());
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  parts.push(currentPart.trim());

  if (parts.length === 0) continue;

  const topic = parts[0] ? parts[0].replace(/^"|"$/g, '').trim() : '';
  const problem = parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : '';
  const problemLink = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';

  if (topic && !problem && !problemLink) {
    currentCategory = topic;
    categories[currentCategory] = categories[currentCategory] || {};
  } else if (!topic && problem && !problemLink && !parts[3]) {
    currentSubcategory = problem;
    if (currentCategory) {
      categories[currentCategory][currentSubcategory] = [];
    }
  } else if (problem && problemLink) {
    if (currentCategory && currentSubcategory) {
      categories[currentCategory][currentSubcategory].push({
        problem,
        link: problemLink,
        tutorial: parts[3] ? parts[3].replace(/^"|"$/g, '').trim() : '',
        article: parts[4] ? parts[4].replace(/^"|"$/g, '').trim() : ''
      });
    } else if (currentCategory) {
      categories[currentCategory]['General'] = categories[currentCategory]['General'] || [];
      categories[currentCategory]['General'].push({
        problem,
        link: problemLink,
        tutorial: parts[3] ? parts[3].replace(/^"|"$/g, '').trim() : '',
        article: parts[4] ? parts[4].replace(/^"|"$/g, '').trim() : ''
      });
    }
  }
}

console.log('Categories found:', Object.keys(categories));
for (const cat in categories) {
  console.log(`\nCategory: ${cat}`);
  for (const sub in categories[cat]) {
    console.log(`  Subcategory: ${sub} (${categories[cat][sub].length} problems)`);
  }
}
