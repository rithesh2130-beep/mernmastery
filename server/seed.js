import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DOMAINS } from '../src/data/index.js';
import Question from './models/Question.js';
import Interview from './models/Interview.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mernmastery';

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // Clear existing data
    console.log("Clearing existing questions and interviews...");
    await Question.deleteMany({});
    await Interview.deleteMany({});

    const seededQuestions = [];
    const seededInterviews = [];

    // Map and gather all questions and interviews across domains
    Object.keys(DOMAINS).forEach(domKey => {
      const dom = DOMAINS[domKey];
      console.log(`Processing domain: ${dom.name} (${domKey})`);

      // Prepare MCQs
      dom.questions.forEach(q => {
        seededQuestions.push({
          id: q.id,
          domain: domKey,
          level: q.level,
          question: q.question,
          codeSnippet: q.codeSnippet || '',
          options: q.options,
          correctAnswer: q.correctAnswer,
          masterInsight: q.masterInsight,
          pitfall: q.pitfall || ''
        });
      });

      // Prepare Interview Q&As
      if (dom.interviews) {
        dom.interviews.forEach(item => {
          seededInterviews.push({
            id: item.id,
            domain: domKey,
            title: item.title,
            difficulty: item.difficulty,
            question: item.question,
            answer: item.answer,
            code: item.code || '',
            teacherTip: item.teacherTip
          });
        });
      }
    });

    // Save to collections
    console.log(`Inserting ${seededQuestions.length} Questions into MongoDB...`);
    await Question.insertMany(seededQuestions);

    console.log(`Inserting ${seededInterviews.length} Interview Q&As into MongoDB...`);
    await Interview.insertMany(seededInterviews);

    console.log("==================================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`- Questions Seeded: ${seededQuestions.length}`);
    console.log(`- Interviews Seeded: ${seededInterviews.length}`);
    console.log("==================================================");

  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

seedDatabase();
