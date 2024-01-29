import db from '../config/connect.js';
import main from '../index.js';
import inquirer from 'inquirer';

// * Get *
export async function getDepartments() {
  try {
    const [departments] = await db.promise().query('SELECT * FROM department');
    console.log('Departments:', departments);
    main();
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

export async function getRoles() {
  try {
    const [roles] = await db.promise().query('SELECT * FROM role');
    console.log('Roles:', roles);
    main();
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};
export async function getEmployees() {
  try {
    const [employees] = await db.promise().query('SELECT * FROM employee');
    console.log('Employees:', employees);
    main();
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

// * Add *
export async function addDepartment(departmentName) {
  if (!departmentName) {
    console.log('No department name provided.');
    return;
  }

  try {
    const [result] = await db.promise().execute(
      'INSERT INTO department (name) VALUES (?)',
      [departmentName]
    );

    console.log(`Added new department with id: ${result.insertId}`);
    main();
  } catch (error) {
    console.error('Error adding department:', error);
  }
};

// Create a prompt module with inquirer
const prompt = inquirer.createPromptModule();

export async function addRole() {
  try {
    // Fetch existing departments to allow the user to select one
    const [departments] = await db.promise().query('SELECT id, name FROM department');

    if (departments.length === 0) {
      console.log('No departments found. Please add a department first.');
      return main();
    }
  } catch (error) {
    console.error('Error adding role:', error);
  } finally {
    // Return to the main menu
    main();
  }
};

export async function addEmployee() {
  try {
    // Prompt for new employee details
    const employeeDetails = await prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the first name of the employee?'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the last name of the employee?'
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is the role of the employee?',
        choices: roles.map(role => ({ name: role.title, value: role.id })),
        pageSize: roles.length
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is the manager of the employee?',
        choices: managers.map(manager => ({ name: manager.name, value: manager.id })).concat([{ name: 'None', value: null }]),
        pageSize: managers.length
      }
    ]);

    // Insert the new employee into the database
    const [result] = await db.promise().execute(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [employeeDetails.firstName, employeeDetails.lastName, employeeDetails.roleId, employeeDetails.managerId]
    );

    console.log(`Added new employee with id: ${result.insertId}`);
  } catch (error) {
    console.error('Error adding employee:', error);
  } finally {
    // Return to the main menu
    main();
  }
};