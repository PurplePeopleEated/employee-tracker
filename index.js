import connection from './config/connect.js';
import inquirer from 'inquirer';
// Import functions
import { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateRole } from './helpers/queries.js';

// Connect to database
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
        // Switch statement to perform selected action
        switch (answers.option) {
          case 'View all departments':
            console.log('Choice: view all departments');
            getDepartments();
            break;
    
          case 'View all roles':
            console.log('Choice: view all roles');
            getRoles();
            break;
    
          case 'View all employees':
            console.log('Chioce: view all employees');
            getEmployees();
            break;
    
          case 'Add a department':
            console.log('Choice: add a department');
            let departmentName = await prompt([
              {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new department?'
              }
            ])
            addDepartment(departmentName.name);
            break;
    
          case 'Add a role':
            console.log('Choice: add a role');
            addRole();
            break;
    
          case 'Add an employee':
            console.log('Choice: add an employee');
            addEmployee();
            break;
          
          case 'Update employee role':
            console.log('Choice: update employee role');
            updateRole();
            break;
    
          default:
            connection.end();
            break;
        };
  } catch (error) {
    console.error('Error with selection', error);
  }
};

export default main;