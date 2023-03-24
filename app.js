// api
const baseUrl = "http://127.0.0.1:9000/v1/tasks";

const getTasks = async () => {
  try {
    const response = await fetch(baseUrl);
    console.log("res", response);
    if (response.status > 400) {
      return alert(response.statusText);
    } else {
      const jsonRes = await response.json();
      return jsonRes;
    }
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskInfos) => {
  try {
    const response = await fetch(`${baseUrl}/${taskInfos.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskInfos),
    });
    console.log("res", response);
    if (response.status == 409) {
      return alert(response.statusText);
    } else {
      alert("Tâche mise à jour !");
    }
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

const data = {
  label: "labeltask22",
  description: "tasks",
  start_date: "2022-01-01T12:00:00Z", // inputt  type='date'
  end_date: "",
};

const postTasks = async (taskInfos) => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskInfos),
    });
    console.log("res", response);
    if (response.status == 409) {
      return alert(response.statusText);
    } else {
      alert("Tâche crée !");
    }
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (label) => {
  try {
    const response = await fetch(`${baseUrl}/${label}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskInfos),
    });
    console.log("res", response);
    if (response.status == 409) {
      return alert(response.statusText);
    } else {
      alert("Tâche supprimée !");
    }
    return jsonRes;
  } catch (error) {
    throw error;
  }
};
//

const inpSearch = document.querySelector(".inpSearch");
const addButton = document.querySelector(".add");
const textArea = document.querySelector(".inp");
const tasksList = document.querySelector(".ul");
const tasksForm = document.getElementById("to-do-list-container");

async function main() {
  let tasks = await getTasks();
  console.log("tasks", tasks);
  // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (localStorage.getItem("tasks")) {
    tasks.map((task) => {
      createTask(task);
    });
  }

  textArea.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const inputValue = textArea.value;
      if (inputValue === "") {
        return;
      }
      const task = {
        id: new Date().getTime(),
        description: inputValue,
        isCompleted: false,
      };
      /*
      model
      const task = {
          label: "labeltasks"
        description: inputValue,
     start_date:new Date().getTime(),
             end_date://example: "2022-01-01T15:00:00Z"
      };*/

      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      createTask(task);
      tasksForm.reset();
      textArea.focus();
    }
  });

  function createTask(task) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.id);

    if (task.isCompleted) {
      taskEl.classList.add("complete");
    }

    const taskElMarkup = `
  <div class="taskName">
  <span ${!task.isCompleted ? "contenteditable" : ""} class="task-content">${
      task.description
    }</span>
  <input type="checkbox" name="tasks" id="${task.id}" class="editBtn" ${
      task.isCompleted ? "checked" : ""
    }>
  <button class="remove-task deleteBtn"><i class='fa-solid fa-trash'></i></button>
  </div>
  `;

    taskEl.innerHTML = taskElMarkup;
    tasksList.appendChild(taskEl);
  }

  tasksList.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("remove-task") ||
      e.target.parentElement.classList.contains("remove-task") ||
      e.target.parentElement.parentElement.classList.contains("remove-task")
    ) {
      const taskId = e.target.closest("li").id;
      removeTask(taskId);
    }
  });

  function removeTask(taskId) {
    console.log(taskId);
    tasks = tasks.filter((task) => {
      task.id !== parseInt(taskId);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(taskId).remove();
  }

  tasksList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTask(taskId, e.target);
  });

  function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId));
    if (el.hasAttribute("contenteditable")) {
      task.name = el.textContent;
    } else {
      // const span = el.nextElementSibling;
      const span = el.previousElementSibling;
      const parent = el.closest("li");

      task.isCompleted = !task.isCompleted;

      if (task.isCompleted) {
        span.removeAttribute("contenteditable");
        parent.classList.add("complete");
      } else {
        span.setAttribute("contenteditable", "true");
        parent.classList.remove("complete");
      }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // filtered

  tasksList.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("remove-task") ||
      e.target.parentElement.classList.contains("remove-task")
    ) {
      const taskId = e.target.closest("li").id;
      removeTask(taskId);
    }
  });
}

main();
