const taskInput = document.getElementById("task-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const inProList = document.getElementById("in-progress-list");
const addTaskBtn = document.getElementById("add-task-btn");
const dropArea = document.querySelectorAll(".column-body");

function createTaskChbx() {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  return checkbox;
}

function createTaskText(text) {
  const taskText = document.createElement("p");
  taskText.textContent = text;
  return taskText;
}

function createTaskTrash() {
  const taskTrashDiv = document.createElement("div");
  taskTrashDiv.className = "trash";
  const taskTrash = document.createElement("img");
  taskTrash.src = "img/trash.png";
  taskTrash.alt = "Delete";
  taskTrashDiv.appendChild(taskTrash);
  return taskTrashDiv;
}

addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    alert("Задача не может быть пустой!");
    return;
  }

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.draggable = "true";

  taskDiv.id = `task-${Date.now()}`; // Используем текущий timestamp для уникальности

  const taskChbx = createTaskChbx();
  const taskText = createTaskText(taskInput.value);
  const taskTrash = createTaskTrash();

  // Слушатель для удаления задачи
  taskTrash.addEventListener("click", () => {
    taskDiv.remove();
    saveTasksToLocalStorage();
  });

  // Слушатель для изменения состояния задачи
  taskChbx.addEventListener("change", () => {
    if (taskChbx.checked) {
      doneList.appendChild(taskDiv);
    } else {
      inProList.appendChild(taskDiv);
    }
    saveTasksToLocalStorage();
  });

  // Слушатель для dragstart и dragend
  taskDiv.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text", event.target.id);
    setTimeout(() => {
      event.target.style.opacity = "0.5"; // Снижаем прозрачность
    }, 0);
  });

  taskDiv.addEventListener("dragend", (event) => {
    event.target.style.opacity = "1"; // Восстанавливаем прозрачность
  });

  // Добавление обработчиков для перетаскивания
  dropArea.forEach((area) => {
    area.addEventListener("dragover", (e) => {
      e.preventDefault();
      area.classList.add("highlight");
    });

    area.addEventListener("dragleave", (e) => {
      area.classList.remove("highlight");
    });

    area.addEventListener("drop", (e) => {
      e.preventDefault();
      area.classList.remove("highlight");

      const data = e.dataTransfer.getData("text");
      const draggedElement = document.getElementById(data);

      if (area.id === "done-list") {
        const draggedCheckbox = draggedElement.querySelector(
          "input[type='checkbox']"
        );
        if (draggedCheckbox) {
          draggedCheckbox.checked = true; // Отмечаем чекбокс, если задача в "done-list"
        }
      } else {
        const draggedCheckbox = draggedElement.querySelector(
          "input[type='checkbox']"
        );
        if (draggedCheckbox) {
          draggedCheckbox.checked = false; // Отмечаем чекбокс, если задача в "in-progress-list"
        }
      }

      area.appendChild(draggedElement);
      draggedElement.style.transition = "transform 0.3s ease-out";
      draggedElement.style.transform = "scale(1)";
      saveTasksToLocalStorage(); // Сохраняем в локальное хранилище
    });

    area.addEventListener("dragenter", (e) => {
      e.preventDefault();
    });
  });

  // Добавляем все части задачи в taskDiv
  taskDiv.appendChild(taskChbx);
  taskDiv.appendChild(taskText);
  taskDiv.appendChild(taskTrash);

  // Добавляем задачу в список todoList
  todoList.appendChild(taskDiv);

  // Очищаем поле ввода
  taskInput.value = "";
  saveTasksToLocalStorage(); // Сохраняем в локальное хранилище после добавления задачи
});

function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (savedTasks) {
    savedTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.id = task.id;
      taskDiv.draggable = "true";

      const taskChbx = createTaskChbx();
      taskChbx.checked = task.checked;
      const taskText = createTaskText(task.text);
      const taskTrash = createTaskTrash();

      // Слушатель для удаления задачи
      taskTrash.addEventListener("click", () => {
        taskDiv.remove();
        saveTasksToLocalStorage(); // Сохраняем после удаления
      });

      // Слушатель для изменения состояния задачи
      taskChbx.addEventListener("change", () => {
        if (taskChbx.checked) {
          doneList.appendChild(taskDiv);
        } else {
          inProList.appendChild(taskDiv);
        }
        saveTasksToLocalStorage(); // Сохраняем после изменения состояния
      });

      // Добавляем все части задачи в taskDiv
      taskDiv.appendChild(taskChbx);
      taskDiv.appendChild(taskText);
      taskDiv.appendChild(taskTrash);

      // Добавляем задачу в правильный список
      if (task.checked) {
        doneList.appendChild(taskDiv);
      } else if (task.status === "in-progress") {
        inProList.appendChild(taskDiv); // Добавляем задачу в "In Progress"
      } else {
        todoList.appendChild(taskDiv);
      }

      // Повторно привязываем обработчики для drag-and-drop
      bindDragAndDropHandlers(taskDiv);
    });
  }
}

// Функция для привязки обработчиков событий перетаскивания
function bindDragAndDropHandlers(taskDiv) {
  taskDiv.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text", event.target.id);
    setTimeout(() => {
      event.target.style.opacity = "0.5"; // Снижаем прозрачность
    }, 0);
  });

  taskDiv.addEventListener("dragend", (event) => {
    event.target.style.opacity = "1"; // Восстанавливаем прозрачность
  });
}

// Добавляем обработчики для перетаскивания в dropArea
dropArea.forEach((area) => {
  area.addEventListener("dragover", (e) => {
    e.preventDefault();
    area.classList.add("highlight");
  });

  area.addEventListener("dragleave", (e) => {
    area.classList.remove("highlight");
  });

  area.addEventListener("drop", (e) => {
    e.preventDefault();
    area.classList.remove("highlight");

    const data = e.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    if (area.id === "done-list") {
      const draggedCheckbox = draggedElement.querySelector(
        "input[type='checkbox']"
      );
      if (draggedCheckbox) {
        draggedCheckbox.checked = true; // Отмечаем чекбокс, если задача в "done-list"
      }
    } else {
      const draggedCheckbox = draggedElement.querySelector(
        "input[type='checkbox']"
      );
      if (draggedCheckbox) {
        draggedCheckbox.checked = false; // Отмечаем чекбокс, если задача в "in-progress-list"
      }
    }

    area.appendChild(draggedElement);
    draggedElement.style.transition = "transform 0.3s ease-out";
    draggedElement.style.transform = "scale(1)";
    saveTasksToLocalStorage(); // Сохраняем в локальное хранилище
  });

  area.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });
});

// Функция для сохранения задач в localStorage
function saveTasksToLocalStorage() {
  const tasks = [];

  // Собираем все задачи с их состоянием
  const taskDivs = document.querySelectorAll(".task");
  taskDivs.forEach((taskDiv) => {
    const taskId = taskDiv.id;
    const taskText = taskDiv.querySelector("p").textContent;
    const taskChecked = taskDiv.querySelector("input[type='checkbox']").checked;
    let taskStatus = "todo"; // по умолчанию

    if (doneList.contains(taskDiv)) {
      taskStatus = "done";
    } else if (inProList.contains(taskDiv)) {
      taskStatus = "in-progress";
    }

    tasks.push({
      id: taskId,
      text: taskText,
      checked: taskChecked,
      status: taskStatus,
    });
  });

  // Сохраняем в локальное хранилище
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Загружаем задачи при старте страницы
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);
