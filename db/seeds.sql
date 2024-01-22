INSERT INTO department (name) VALUES
("Maintenance"),
("Test2"),
("Test3");

INSERT INTO role (title, salary, department_id) VALUES
("title1", 15.50, 2),
("title2", 150000, 3),
("title3", 12000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("firstname", "lastname", 1, NULL),
("first", "last", 2, NULL),
("firsty", "lasty", 3, NULL);
