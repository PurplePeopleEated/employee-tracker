import connection from './config/connect.js';
import inquirer from 'inquirer';
// Import functions
import { getDepartments, getRoles } from './helpers/queries.js';

// TODO: connect to database

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database', error);
    return;
  } else {
    console.log('Successfully connected to database');
    // Run application
    main();
  }
});

const prompt = inquirer.createPromptModule();
// TODO: create inquirer prompts
// Runs inquirer prompts
const main = async () => {
  try {
    const answers = await prompt([
      // * Main Menu Options *
      {
        type: 'list',
        name: 'option',
        message: 'Select an option from the list',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update employee role',
          'Close'
        ],
        pageSize: 8
      }
    ]);
  } catch (error) {
    console.error('Error with selection', error);
  }
};