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

