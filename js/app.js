//  Model
class EmployeeModel {
  constructor() {
    this.apiURL = "https://jsonplaceholder.typicode.com/users";
  }

  async fetchEmployees() {
    try {
      const response = await fetch(this.apiURL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  }
}

// View
class EmployeeView {
  constructor() {
    this.employeeListContainer = document.getElementById("employee-list");
  }

  renderEmployees(employees, onEdit) {
    this.employeeListContainer.innerHTML = "";
    employees.forEach((employee) => {
      const employeeDiv = document.createElement("div");
      employeeDiv.className = "employee";
      employeeDiv.innerHTML = `
                <span>${employee.name} - ${employee.email} - ${employee.phone}</span>
                <button data-id="${employee.id}">Изменить</button>
            `;
      const editButton = employeeDiv.querySelector("button");
      editButton.addEventListener("click", () => onEdit(employee.id));
      this.employeeListContainer.appendChild(employeeDiv);
    });
  }

  showEditForm(employee) {
    const employeeDiv = document.querySelector(
      `button[data-id="${employee.id}"]`
    ).parentElement;
    employeeDiv.innerHTML = `
            <input type="text" id="name-${employee.id}" value="${employee.name}">
            <input type="email" id="email-${employee.id}" value="${employee.email}">
            <input type="text" id="phone-${employee.id}" value="${employee.phone}">
            <button data-id="${employee.id}">Сохранить</button>
        `;
    const saveButton = employeeDiv.querySelector("button");
    saveButton.addEventListener("click", () => {
      const updatedEmployee = {
        id: employee.id,
        name: document.getElementById(`name-${employee.id}`).value,
        email: document.getElementById(`email-${employee.id}`).value,
        phone: document.getElementById(`phone-${employee.id}`).value,
      };
      this.onSave(updatedEmployee);
    });
  }

  bindSaveHandler(handler) {
    this.onSave = handler;
  }
}

//  Controller
class EmployeeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindSaveHandler(this.handleSaveEmployee.bind(this));
    this.init();
  }

  async init() {
    this.employees = await this.model.fetchEmployees();
    this.view.renderEmployees(
      this.employees,
      this.handleEditEmployee.bind(this)
    );
  }

  handleEditEmployee(id) {
    const employee = this.employees.find((emp) => emp.id === id);
    this.view.showEditForm(employee);
  }

  handleSaveEmployee(updatedEmployee) {
    this.employees = this.employees.map((emp) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    this.view.renderEmployees(
      this.employees,
      this.handleEditEmployee.bind(this)
    );
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  const model = new EmployeeModel();
  const view = new EmployeeView();
  new EmployeeController(model, view);
});
