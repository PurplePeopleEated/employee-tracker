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
