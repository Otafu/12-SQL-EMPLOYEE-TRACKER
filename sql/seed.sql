INSERT INTO office.department
(id, name)
VALUES(1, 'first dept');

INSERT INTO office.`role`
(id, title, salary, department_id)
VALUES(1, 'Developer', 1000, 3);

INSERT INTO office.employee
(id, first_name, last_name, role_id, manager_id)
VALUES(1, 'clinton', 'homes', 1, NULL);

