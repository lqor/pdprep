const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const exams = [
  {
    type: "PD1",
    name: "Platform Developer 1",
    description: "Salesforce Platform Developer I exam prep",
    passingScore: 68,
    durationMinutes: 105,
    questionCount: 60,
    topics: [
      {
        name: "Salesforce Fundamentals",
        slug: "salesforce-fundamentals",
        weight: 23,
        sortOrder: 1,
      },
      {
        name: "Data Modeling and Management",
        slug: "data-modeling-management",
        weight: 22,
        sortOrder: 2,
      },
      {
        name: "Process Automation and Logic",
        slug: "process-automation-logic",
        weight: 30,
        sortOrder: 3,
      },
      {
        name: "User Interface",
        slug: "user-interface",
        weight: 25,
        sortOrder: 4,
      },
    ],
  },
];

const seedFiles = [
  path.join(process.cwd(), "data", "seed", "questions.sample.json"),
  path.join(process.cwd(), "data", "seed", "pd1_prep_questions.json"),
];

const escape = (value) => String(value).replace(/'/g, "''");
const sqlValue = (value) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${escape(value)}'`;
};

function loadQuestions() {
  const questions = [];
  for (const file of seedFiles) {
    if (!fs.existsSync(file)) continue;
    const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (Array.isArray(parsed)) {
      questions.push(...parsed);
    }
  }
  return questions;
}

function main() {
  const lines = [];
  lines.push("BEGIN;");

  const examIdMap = new Map();
  const topicIdMap = new Map();

  for (const exam of exams) {
    const examId = randomUUID();
    examIdMap.set(exam.type, examId);

    lines.push(
      `INSERT INTO \"Exam\" (\"id\", \"type\", \"name\", \"description\", \"questionCount\", \"passingScore\", \"durationMinutes\", \"isActive\", \"createdAt\", \"updatedAt\") VALUES (` +
        [
          sqlValue(examId),
          sqlValue(exam.type),
          sqlValue(exam.name),
          sqlValue(exam.description),
          sqlValue(exam.questionCount),
          sqlValue(exam.passingScore),
          sqlValue(exam.durationMinutes),
          "true",
          "now()",
          "now()",
        ].join(", ") +
        ");"
    );

    for (const topic of exam.topics) {
      const topicId = randomUUID();
      topicIdMap.set(`${exam.type}|${topic.slug}`, topicId);
      lines.push(
        `INSERT INTO \"Topic\" (\"id\", \"examId\", \"name\", \"slug\", \"description\", \"weight\", \"sortOrder\", \"isActive\", \"createdAt\", \"updatedAt\") VALUES (` +
          [
            sqlValue(topicId),
            sqlValue(examId),
            sqlValue(topic.name),
            sqlValue(topic.slug),
            sqlValue(topic.description ?? null),
            sqlValue(topic.weight),
            sqlValue(topic.sortOrder),
            "true",
            "now()",
            "now()",
          ].join(", ") +
          ");"
      );
    }
  }

  const questions = loadQuestions();
  const seen = new Set();

  for (const question of questions) {
    const key = `${question.examType}|${question.topic}|${question.content}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const examId = examIdMap.get(question.examType);
    const topicId = topicIdMap.get(`${question.examType}|${question.topic}`);
    if (!examId || !topicId) continue;

    const questionId = randomUUID();
    lines.push(
      `INSERT INTO \"Question\" (\"id\", \"examId\", \"topicId\", \"content\", \"codeSnippet\", \"type\", \"difficulty\", \"explanation\", \"referenceUrl\", \"isPremium\", \"isActive\", \"createdAt\", \"updatedAt\") VALUES (` +
        [
          sqlValue(questionId),
          sqlValue(examId),
          sqlValue(topicId),
          sqlValue(question.content),
          sqlValue(question.codeSnippet ?? null),
          sqlValue(question.type),
          sqlValue(question.difficulty ?? 3),
          sqlValue(question.explanation),
          sqlValue(question.referenceUrl ?? null),
          sqlValue(question.isPremium ?? false),
          "true",
          "now()",
          "now()",
        ].join(", ") +
        ");"
    );

    if (Array.isArray(question.answers)) {
      question.answers.forEach((answer, index) => {
        lines.push(
          `INSERT INTO \"Answer\" (\"id\", \"questionId\", \"content\", \"isCorrect\", \"sortOrder\", \"createdAt\", \"updatedAt\") VALUES (` +
            [
              sqlValue(randomUUID()),
              sqlValue(questionId),
              sqlValue(answer.content),
              sqlValue(Boolean(answer.isCorrect)),
              sqlValue(index),
              "now()",
              "now()",
            ].join(", ") +
            ");"
        );
      });
    }
  }

  lines.push("COMMIT;");

  const output = path.join(process.cwd(), "supabase", "seed.sql");
  fs.writeFileSync(output, lines.join("\n") + "\n");
  console.log(`Wrote ${output}`);
}

main();
