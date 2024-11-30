// Función para mostrar el reloj en tiempo real
function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString();
    setTimeout(updateClock, 1000);
  }
  
  // Gestión de usuario y cookies
  function manageUser() {
    const name = localStorage.getItem("username");
    const lastVisit = localStorage.getItem("lastVisit");
  
    if (!name) {
      const userName = prompt("¡Bienvenido! Por favor, introduce tu nombre:");
      localStorage.setItem("username", userName);
      document.getElementById("welcome-message").textContent = `¡Hola, ${userName}!`;
    } else {
      document.getElementById("welcome-message").textContent = `¡Bienvenido de nuevo, ${name}!`;
      if (lastVisit) {
        document.getElementById("last-visit").textContent = `Última visita: ${lastVisit}`;
      }
    }
    localStorage.setItem("lastVisit", new Date().toLocaleString());
  }
  
  // Gestión de tareas
  let tasks = [];
  
  function renderTasks(filter = "all") {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
  
    const filteredTasks = tasks.filter(task => {
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  
    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "pending";
      li.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Fecha límite: ${task.deadline || "No especificada"}</p>
        <button onclick="toggleTaskStatus('${task.id}')">${task.completed ? "Marcar como Pendiente" : "Marcar como Completada"}</button>
        <button onclick="deleteTask('${task.id}')">Eliminar</button>
      `;
      taskList.appendChild(li);
    });
  
    updateStats();
  }
  
  function addTask(event) {
    event.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const deadline = document.getElementById("task-deadline").value;
  
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      deadline,
      completed: false,
    };
  
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    event.target.reset();
  }
  
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  
  function toggleTaskStatus(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  
  function updateStats() {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
  
    document.getElementById("total-tasks").textContent = totalTasks;
    document.getElementById("pending-tasks").textContent = pendingTasks;
    document.getElementById("completed-tasks").textContent = completedTasks;
  }
  
  // Inicialización
  document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    manageUser();
  
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();
  
    document.getElementById("task-form").addEventListener("submit", addTask);
    document.querySelectorAll("#task-filters button").forEach(button => {
      button.addEventListener("click", () => renderTasks(button.dataset.filter));
    });
  });