import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const EXAM_ID = "k177gnzadsj3rpcvmss24b2ked81acjt";
const TOPIC_MAP = {
  "salesforce-fundamentals": "kd77ey8tx24qnf43gdg3pdmeh981bvgz",
  "data-modeling-management": "kd74q3whj0qhtkg5prva0mznyd81bbzt",
  "process-automation-logic": "kd72d4bx4ggabse12k6a53t0q981a74x",
  "user-interface": "kd7cj5jj5ypkb4s9ebts1v7g3n81af3a",
};

// Load questions
const seedFiles = ["questions.sample.json", "pd1_prep_questions.json"];
const allQuestions = [];
const seen = new Set();

for (const file of seedFiles) {
  try {
    const raw = readFileSync(join(rootDir, "data", "seed", file), "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      allQuestions.push(...parsed);
    }
  } catch {
    // skip missing files
  }
}

// Deduplicate and map to Convex format
const questions = [];
let answerCounter = 0;

for (const q of allQuestions) {
  const topicId = TOPIC_MAP[q.topic];
  if (!topicId) {
    console.log(`Skipping question - unknown topic: ${q.topic}`);
    continue;
  }

  const key = `${q.examType}|${q.topic}|${q.content}`;
  if (seen.has(key)) continue;
  seen.add(key);

  questions.push({
    examId: EXAM_ID,
    topicId,
    content: q.content,
    codeSnippet: q.codeSnippet || undefined,
    type: q.type,
    difficulty: q.difficulty,
    explanation: q.explanation,
    referenceUrl: q.referenceUrl || undefined,
    isPremium: q.isPremium,
    answers: q.answers.map((a, i) => ({
      id: `a${answerCounter++}`,
      content: a.content,
      isCorrect: a.isCorrect,
      sortOrder: i,
    })),
  });
}

console.log(`Total unique questions to seed: ${questions.length}`);

// Batch insert (50 at a time to stay within limits)
const BATCH_SIZE = 50;
for (let i = 0; i < questions.length; i += BATCH_SIZE) {
  const batch = questions.slice(i, i + BATCH_SIZE);
  const arg = JSON.stringify({ questions: batch });

  try {
    execSync(`npx convex run seed:seedQuestions '${arg.replace(/'/g, "'\\''")}'`, {
      cwd: rootDir,
      stdio: "pipe",
    });
    console.log(`Seeded batch ${Math.floor(i / BATCH_SIZE) + 1}: questions ${i + 1}-${Math.min(i + BATCH_SIZE, questions.length)}`);
  } catch (err) {
    console.error(`Error seeding batch at index ${i}:`, err.stderr?.toString() || err.message);
    // Try smaller batches
    for (let j = 0; j < batch.length; j++) {
      try {
        const singleArg = JSON.stringify({ questions: [batch[j]] });
        execSync(`npx convex run seed:seedQuestions '${singleArg.replace(/'/g, "'\\''")}'`, {
          cwd: rootDir,
          stdio: "pipe",
        });
      } catch (innerErr) {
        console.error(`Failed to seed question ${i + j}: ${batch[j].content.substring(0, 50)}...`);
        console.error(innerErr.stderr?.toString() || innerErr.message);
      }
    }
  }
}

console.log("Done seeding!");
