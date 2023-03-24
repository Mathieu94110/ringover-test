// api
const baseUrl = "http://127.0.0.1:9000/v1/tasks";

const getTasks = async () => {
  try {
    const response = await fetch(baseUrl);
    if (response.status === 200) {
      const jsonRes = await response.json();
      return jsonRes;
    } else if (response.status === 204) {
      return alert("La list de tâches est vide!");
    } else if (response.status === 500) {
      return alert("Problème de serveur!");
    }
  } catch (error) {
    throw error;
  }
};

const getTask = async (label) => {
  try {
    const response = await fetch(`${baseUrl}/${label}`);
    if (response.status === 200) {
      const jsonRes = await response.json();
      return jsonRes;
    } else if (response.status === 201) {
      return alert("Aucun contenu correspondant !");
    } else if (response.status === 404) {
      return alert("Tâche non trouvée !");
    } else if (response.status === 500) {
      return alert("Problème de serveur!");
    }
  } catch (error) {
    throw error;
  }
};

// const data = {
//   label: "Poubelles",
//   description: "Sortir la poubelle orange",
//   start_date: "2023-03-24T10:00:00Z",
//   end_date: "2023-03-26T10:00:00Z",
// };

const postTask = async (taskInfos) => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskInfos),
    });
    if (response.status == 201) {
      return alert("Tâche crée !");
    } else if (response.status == 400) {
      return alert("Mauvaise requete !");
    } else if (response.status == 409) {
      return alert("La tâche éxiste déjà !");
    } else if (response.status == 500) {
      return alert("Problème de serveur!");
    }
  } catch (error) {
    throw error;
  }
};

// postTask(data);

const deleteTask = async (label) => {
  try {
    const response = await fetch(`${baseUrl}/${label}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      alert("Tâche supprimée !");
    } else if (response.status == 404) {
      return alert("Tâche non trouvée !");
    } else if (response.status === 500) {
      return alert("Problème de serveur!");
    }
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskInfos) => {
  try {
    const response = await fetch(`${baseUrl}/${taskInfos.label}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskInfos),
    });
    console.log("res", response);
    if (response.status == 200) {
      return alert("Tâche mise à jour !");
    } else if (response.status == 400) {
      return alert("Mauvaise requete !");
    } else if (response.status == 404) {
      return alert("Tâche non trouvée !");
    } else if (response.status == 500) {
      return alert("Problème de serveur!");
    }
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

tasksForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const label = tasksForm.elements["label"].value;
  const description = tasksForm.elements["description"].value;
  const endDate = tasksForm.elements["end_date"].value;

  console.log(
    "label =",
    label,
    "description =",
    description,
    "endDate =",
    endDate
  );
  // handle the form data
});

async function main() {
  let tasks = await getTasks();
  console.log(tasks);
  if (tasks && tasks.length > 0) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    localStorage.setItem("tasks", []);
  }

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
  <input type="checkbox" name="tasks" id="${task.id}" class="checkBtn" ${
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
      e.preventDefault();
      const taskId = e.target.closest("li").id;
      // const taskLabel = "labeltasks2";
      // deleteTask(taskLabel);
      removeTask(taskId);
    }
  });
}

main();
