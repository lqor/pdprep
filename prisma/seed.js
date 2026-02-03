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
  {
    type: "PD2",
    name: "Platform Developer 2",
    description: "Salesforce Platform Developer II exam prep",
    passingScore: 70,
    durationMinutes: 105,
    questionCount: 60,
    topics: [
      {
        name: "Apex & Data Management",
        slug: "apex-data-management",
        weight: 28,
        sortOrder: 1,
      },
      {
        name: "Process Automation, Integration",
        slug: "process-automation-integration",
        weight: 27,
        sortOrder: 2,
      },
      {
        name: "User Interface",
        slug: "user-interface",
        weight: 20,
        sortOrder: 3,
      },
      {
        name: "Testing, Debugging, Deployment",
        slug: "testing-debugging-deployment",
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
  const questionsPath = path.join(
    process.cwd(),
    "data",
    "seed",
    "questions.sample.json"
  );

  if (!fs.existsSync(questionsPath)) {
    return;
  }

  const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

  for (const question of questions) {
    const exam = examMap[question.examType];
    const topic = topicMap[question.examType]?.[question.topic];

    if (!exam || !topic) {
      // Skip if exam/topic mapping is missing
      continue;
    }

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
