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


// TODO: create inquirer prompts
