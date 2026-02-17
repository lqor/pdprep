const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

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

async function seedExamsAndTopics() {
  const examMap = {};
  const topicMap = {};

  for (const exam of exams) {
    const examRecord = await prisma.exam.upsert({
      where: { type: exam.type },
      update: {
        name: exam.name,
        description: exam.description,
        passingScore: exam.passingScore,
        durationMinutes: exam.durationMinutes,
        questionCount: exam.questionCount,
      },
      create: {
        type: exam.type,
        name: exam.name,
        description: exam.description,
        passingScore: exam.passingScore,
        durationMinutes: exam.durationMinutes,
        questionCount: exam.questionCount,
      },
    });

    examMap[exam.type] = examRecord;
    topicMap[exam.type] = {};

    for (const topic of exam.topics) {
      const topicRecord = await prisma.topic.upsert({
        where: {
          examId_slug: {
            examId: examRecord.id,
            slug: topic.slug,
          },
        },
        update: {
          name: topic.name,
          description: topic.description,
          weight: topic.weight,
          sortOrder: topic.sortOrder,
        },
        create: {
          examId: examRecord.id,
          name: topic.name,
          slug: topic.slug,
          description: topic.description,
          weight: topic.weight,
          sortOrder: topic.sortOrder,
        },
      });

      topicMap[exam.type][topic.slug] = topicRecord;
    }
  }

  return { examMap, topicMap };
}

async function seedQuestions(topicMap, examMap) {
  const seedFiles = ["questions.sample.json", "pd1_prep_questions.json"];
  const questions = [];

  for (const file of seedFiles) {
    const filePath = path.join(process.cwd(), "data", "seed", file);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (Array.isArray(parsed)) {
      questions.push(...parsed);
    }
  }

  if (questions.length === 0) {
    return;
  }

  const seen = new Set();

  for (const question of questions) {
    const exam = examMap[question.examType];
    const topic = topicMap[question.examType]?.[question.topic];

    if (!exam || !topic) {
      continue;
    }

    const uniqueKey = `${question.examType}|${question.topic}|${question.content}`;
    if (seen.has(uniqueKey)) {
      continue;
    }
    seen.add(uniqueKey);

    const existing = await prisma.question.findFirst({
      where: {
        examId: exam.id,
        content: question.content,
      },
    });

    if (existing) {
      continue;
    }

    await prisma.question.create({
      data: {
        examId: exam.id,
        topicId: topic.id,
        content: question.content,
        codeSnippet: question.codeSnippet,
        type: question.type,
        difficulty: question.difficulty,
        explanation: question.explanation,
        referenceUrl: question.referenceUrl,
        isPremium: question.isPremium,
        answers: {
          create: question.answers.map((answer, index) => ({
            content: answer.content,
            isCorrect: answer.isCorrect,
            sortOrder: index,
          })),
        },
      },
    });
  }
}

async function main() {
  const { examMap, topicMap } = await seedExamsAndTopics();
  await seedQuestions(topicMap, examMap);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
