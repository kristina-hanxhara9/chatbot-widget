#!/usr/bin/env node

// This script initializes the database with Prisma
// Run with: npm run init-db

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Initializing database with Prisma...');

rl.question('This will reset your database. Are you sure you want to continue? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      console.log('Pushing schema to database...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      
      console.log('✅ Database initialization completed successfully!');
    } catch (error) {
      console.error('❌ Error initializing database:', error.message);
      process.exit(1);
    }
  } else {
    console.log('Database initialization cancelled.');
  }
  
  rl.close();
});