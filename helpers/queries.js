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