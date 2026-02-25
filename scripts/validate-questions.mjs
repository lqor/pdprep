#!/usr/bin/env node
import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('./data/seed/pd1_prep_questions.json', 'utf-8'));

console.log('=== JSON Validation Report ===\n');
console.log(`✓ Valid JSON syntax`);
console.log(`✓ Total questions: ${data.length}`);

// Topic distribution
const topics = {};
data.forEach(q => {
  topics[q.topic] = (topics[q.topic] || 0) + 1;
});
console.log('\nTopic distribution:');
Object.entries(topics).forEach(([topic, count]) => {
  console.log(`  - ${topic}: ${count}`);
});

// Required fields (using 'content' instead of 'question')
const missing = data.filter(q =>
  !q.content ||
  !q.answers ||
  !q.explanation ||
  !q.topic
);
console.log(`\n✓ Questions with all required fields: ${data.length - missing.length}/${data.length}`);
if (missing.length > 0) {
  console.log(`✗ Missing fields in questions:`, missing.slice(0, 5));
}

// Duplicate content (detect exact duplicates)
const contents = data.map(q => `${q.topic}|${q.content}`);
const uniqueContents = new Set(contents);
const hasDuplicates = contents.length !== uniqueContents.size;
console.log(`${!hasDuplicates ? '✓' : '✗'} Duplicate questions: ${hasDuplicates ? 'Found' : 'None'}`);

// Code snippets
const withCode = data.filter(q => q.codeSnippet && q.codeSnippet !== null);
console.log(`\n✓ Questions with code snippets: ${withCode.length}`);

// URL quality
const hasUrls = data.filter(q => q.referenceUrl && q.referenceUrl !== '');
const genericUrls = data.filter(q =>
  q.referenceUrl && (
    q.referenceUrl.includes('help.salesforce.com/s/') ||
    q.referenceUrl.includes('.pdf')
  )
);
console.log(`✓ Questions with reference URLs: ${hasUrls.length}/${data.length}`);
console.log(`${genericUrls.length === 0 ? '✓' : '!'} Generic/PDF URLs: ${genericUrls.length}`);

console.log('\n=== Validation Complete ===\n');
