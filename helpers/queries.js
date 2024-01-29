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
    // Prompt user for the new role details
    const newRoleDetails = await prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the new role?',
        validate: input => !!input || 'Please enter a valid role title.'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for the new role?',
        validate: input => !isNaN(parseFloat(input)) || 'Please enter a valid salary.'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does the new role belong to?',
        choices: departments.map(department => ({ name: department.name, value: department.id })),
        pageSize: departments.length
      }
    ]);

  // Insert the new role into the database
  const [roleResult] = await db.promise().execute(
    'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
    [newRoleDetails.title, newRoleDetails.salary, newRoleDetails.departmentId]
  );

  console.log(`Added new role with id: ${roleResult.insertId}`);

  } catch (error) {
    console.error('Error adding role:', error);
  } finally {
    // Return to the main menu
    main();
  }
};

export async function addEmployee() {
  try {
    const newEmployeeDetails = await prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name of the employee?',
      validate: input => !!input.trim() || 'First name cannot be empty.'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name of the employee?',
      validate: input => !!input.trim() || 'Last name cannot be empty.'
    },
    {
      type: 'input',
      name: 'roleId',
      message: 'What is the role ID for the employee?',
      validate: input => !isNaN(parseInt(input, 10)) || 'Please enter a valid role ID.'
    },
    {
      type: 'input',
      name: 'managerId',
      message: 'What is the manager ID for the employee? (Leave blank if none)',
      validate: input => input === '' || !isNaN(parseInt(input, 10)) || 'Please enter a valid manager ID or leave blank.',
      default: null
    }
  ]);

  const managerId = newEmployeeDetails.managerId !== '' ? parseInt(newEmployeeDetails.managerId, 10) : null;

  const [employeeResult] = await db.promise().execute(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
    [newEmployeeDetails.firstName, newEmployeeDetails.lastName, newEmployeeDetails.roleId, managerId]
  );

  console.log(`Added new employee with id: ${employeeResult.insertId}`);
  } catch (error) {
    console.error('Error adding employee:', error);
  } finally {
    // Return to the main menu
    main();
  }
};

export async function updateRole() {
  try {
    // Fetch existing roles and employees to allow the user to select one for updating
    const [roles] = await db.promise().query('SELECT id, title FROM role');
    const [employees] = await db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');

    if (roles.length === 0) {
      console.log('No roles found. Please add a role first.');
      return main();
    }

    if (employees.length === 0) {
      console.log('No employees found. Please add an employee first.');
      return main();
    }

    // Prompt user for the employee and new role details
    const updateDetails = await prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee\'s role do you want to update?',
        choices: employees.map(employee => ({ name: employee.name, value: employee.id })),
        pageSize: employees.length
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Which role do you want to assign to the selected employee?',
        choices: roles.map(role => ({ name: role.title, value: role.id })),
        pageSize: roles.length
      }
    ]);

    // Update the employee's role in the database
    const [result] = await db.promise().execute(
      'UPDATE employee SET role_id = ? WHERE id = ?',
      [updateDetails.roleId, updateDetails.employeeId]
    );

    console.log(`Updated employee's role with id: ${updateDetails.employeeId}`);
  } catch (error) {
    console.error('Error updating employee role:', error);
  } finally {
    // Return to the main menu
    main();
  }
};