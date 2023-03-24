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
      return response;
    } else if (response.status == 400) {
      return alert("Mauvaise requete !");
    } else if (response.status == 409) {
      return alert("La tâche éxiste déjà !");
    } else if (response.status == 500) {
      return alert("Problème de serveur!");
    }
    return response;
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
const tasksList = document.querySelector(".ul");
const tasksForm = document.getElementById("to-do-list-container");

tasksForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const label = tasksForm.elements["label"].value;
  const description = tasksForm.elements["description"].value;
  const endDate = document.getElementById("end_date").value;
  const end_date = endDate + "T12:00:00Z"; // change this

  const newTask = {
    label: label,
    description: description,
    start_date: new Date().toISOString(),
    end_date: end_date,
    isCompleted: false,
  };

  const response = await postTask(newTask);
  if (response && response.ok) {
    tasksForm.reset();
    main();
  }
});

async function main() {
  let tasks = await getTasks();
  if (tasks && tasks.length > 0) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    localStorage.setItem("tasks", []);
  }

  if (localStorage.getItem("tasks")) {
    tasks.map((task) => {
      addTasks(task);
    });
  }

  async function addTasks(task) {
    console.log(task);
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.label);

    if (task.isCompleted) {
      taskEl.classList.add("complete");
    }

    const taskElMarkup = `
  <div class="taskName">
  <span ${!task.isCompleted ? "contenteditable" : ""} class="task-content">${
      task.description
    }</span>
  <input type="checkbox" name="tasks" id="${task.label}" class="checkBtn" ${
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
    tasks = tasks.filter((task) => {
      task.id !== parseInt(taskId);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(document.getElementById(taskId));
    const liElements = document.querySelectorAll(`li[id^=${taskId}]`);
    if (liElements.length > 0) {
      liElements[0].remove();
    }
  }

  tasksList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTaskOnClient(taskId, e.target);
  });

  function updateTaskOnClient(taskId, el) {
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

  tasksList.addEventListener("click", async (e) => {
    if (
      e.target.classList.contains("remove-task") ||
      e.target.parentElement.classList.contains("remove-task")
    ) {
      e.preventDefault();
      const taskId = e.target.closest("li").id;
      await removeTask(taskId);
      await deleteTask(taskId);
    }
  });
}

main();
