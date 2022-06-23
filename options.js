const inquirer = require("inquirer");

const mainOptions = [
  {
    type: "list",
    name: "primary_option",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All employees",
      "Add Department",
      "Add an Employee",
      "Add Role",
      "Update Employee Role",
      "End",
    ],
  },
];

function addDepartmentPrompt(dbConnection) {
  return inquirer
    .prompt([{ type: "input", message: "Department Name ?", name: "name" }])
    .then((answers) => {
      return dbConnection
        .query(`INSERT INTO department SET ?`, answers)
        .then(() => {
          console.debug("New department added to database.");
          return promptMainOptions(dbConnection);
        });
    });
}

async function addEmployeePrompt(dbConnection) {
  const [roles] = await dbConnection.query("select id,title from role");
  const [managers] = await dbConnection.query(
    "select id, first_name from employee"
  );

  return inquirer
    .prompt([
      { type: "input", message: "Employee First Name", name: "first_name" },
      { type: "input", message: "Employee Last Name", name: "last_name" },
      {
        type: "list",
        message: "Employee Role",
        name: "role_id",
        choices: roles.map((role) => ({ value: role.id, name: role.title })),
      },
      {
        type: "list",
        message: "Employee Manager?",
        name: "manager_id",
        choices: managers.map((manager) => ({
          name: manager.first_name,
          value: manager.id,
        })),
      },
    ])
    .then((answers) => {
      return dbConnection
        .query(`INSERT INTO employee SET ?`, answers)
        .then(() => {
          console.debug(
            `${answers.first_name} ${answers.last_name} added to database.`
          );
          return promptMainOptions(dbConnection);
        });
    });
}

async function addRolePrompt(dbConnection) {
  const [departments] = await dbConnection.query("select * from department");

  return inquirer
    .prompt([
      {
        type: "input",
        message: "Role Title?",
        name: "title",
      },
      {
        type: "number",
        message: "Role Salary?",
        name: "salary",
      },
      {
        type: "list",
        message: "Role Department?",
        name: "department_id",
        choices: departments.map((department) => {
          return { value: department.id, name: department.name };
        }),
      },
    ])
    .then((answers) => {
      console.debug(answers);
      return dbConnection.query(`INSERT INTO role SET ? `, answers).then(() => {
        console.debug(`Role ${answers.title} added to database.`);
        return promptMainOptions(dbConnection);
      });
    });
}

async function updateEmployeeRolePrompt(dbConnection) {
  const [employees] = await dbConnection.query("select * from employee");
  const [roles] = await dbConnection.query("select * from role");
  return inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee?",
        name: "id",
        choices: employees.map((employee) => {
          return {
            value: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
          };
        }),
      },
      {
        type: "list",
        message: "New role?",
        name: "role_id",
        choices: roles.map((role) => {
          return {
            value: role.id,
            name: role.title,
          };
        }),
      },
    ])
    .then((answers) => {
      console.debug(answers);
      return dbConnection
        .query(
          `UPDATE employee SET role_id = ${answers.role_id} where id = '${answers.id}'`
        )
        .then(() => {
          console.debug("Role updated.");
          return promptMainOptions(dbConnection);
        });
    });
}

function promptMainOptions(dbConnection) {
  return inquirer.prompt(mainOptions).then((answers) => {
    const { primary_option } = answers;

    // handle views

    switch (primary_option) {
      case "View All Departments":
        return dbConnection.query("select * from department").then(([rows]) => {
          console.table(rows);
          return promptMainOptions(dbConnection);
        });

      case "View All Roles":
        return dbConnection.query("select * from role").then(([rows]) => {
          console.table(rows);
          return promptMainOptions(dbConnection);
        });

      case "View All employees":
        return dbConnection.query("select * from employee").then(([rows]) => {
          console.table(rows);
          return promptMainOptions(dbConnection);
        });

      case "Add Department":
        return addDepartmentPrompt(dbConnection);

      case "Add an Employee":
        return addEmployeePrompt(dbConnection);

      case "Add Role":
        return addRolePrompt(dbConnection);

      case "Update Employee Role":
        return updateEmployeeRolePrompt(dbConnection);
      case "End":
        console.debug("Thank you, come again.");
        break;
    }
  });
}

module.exports = (dbConnection) => {
  return promptMainOptions(dbConnection).catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
};
