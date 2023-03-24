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
      return alert("La date de fin de la tâche a été mise à jour !");
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

const inpSearch = document.querySelector(".inpSearch");
const tasksList = document.querySelector(".ul");
const tasksForm = document.getElementById("to-do-list-container");

tasksForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const label = tasksForm.elements["label"].value;
  const description = tasksForm.elements["description"].value;

  const newTask = {
    label: label,
    description: description,
    start_date: new Date().toISOString(),
  };

  const response = await postTask(newTask);
  if (response && response.ok) {
    tasksForm.reset();
    addTasks(newTask);
  }
});

async function addTasks(task) {
  if (task && task.label) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.label);
    if (task.isCompleted) {
      taskEl.classList.add("complete");
    }
    const taskElMarkup = `
  <div class="taskName">
  <span  class="task-content">${task.description}</span>
    <input
    type="date"
    min="2023-03-24"
    max="2030-12-31"
    id="end_date"
    name="end_date"
    pattern="\d{4}-\d{2}-\d{2}"
    class="dateInput"
    />
  <button class="remove-task deleteBtn"><i class='fa-solid fa-trash'></i></button>
  </div>
  `;
    taskEl.innerHTML = taskElMarkup;
    tasksList.appendChild(taskEl);
  }
}

async function main() {
  let tasks = await getTasks();
  if (tasks && tasks.length > 0) {
    tasks.map((task) => {
      addTasks(task);
    });
  }

  addTasks(tasks);

  tasksList.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("remove-task") ||
      e.target.parentElement.classList.contains("remove-task") ||
      e.target.parentElement.parentElement.classList.contains("remove-task")
    ) {
      const taskId = e.target.closest("li").id;
      removeTask(taskId);
    } else if (
      e.target.classList.contains("dateInput") ||
      e.target.parentElement.classList.contains("dateInput")
    ) {
      tasksList.querySelectorAll(".dateInput").forEach((inputElement) => {
        const taskId = e.target.closest("li").id;
        inputElement.addEventListener("change", (event) => {
          updateTaskEndDate(event, taskId);
        });
      });
    }
  });

  // detect when end_date is choosen or changed in tasks list

  function updateTaskEndDate(event, taskId) {
    const date = event.target.value;
    if (date && taskId) {
      const isoDate = new Date(date).toISOString();
      const taskInfos = {
        label: taskId,
        end_date: isoDate,
      };
      updateTask(taskInfos);
    }
  }

  function removeTask(taskId) {
    tasks = tasks.filter((task) => {
      task.id !== parseInt(taskId);
    });
    document.getElementById(taskId).remove();
  }

  tasksList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTaskOnClient(taskId, e.target);
  });

  // filter Coming soon !!

  tasksList.addEventListener("click", async (e) => {
    if (
      e.target.classList.contains("remove-task") ||
      e.target.parentElement.classList.contains("remove-task")
    ) {
      e.preventDefault();
      const taskId = e.target.closest("li").id;
      await deleteTask(taskId);
    }
  });
}

main();
