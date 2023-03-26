const inpSearch = document.querySelector(".inpSearch");
const tasksList = document.querySelector(".ul");
const tasksDetails = document.getElementById("favDialog");
const tasksForm = document.getElementById("to-do-list-form");
const labelDetails = document.getElementById("label-details");
const descriptionDetails = document.getElementById("description-details");
const creationDetails = document.getElementById("creation-details");
const endDetails = document.getElementById("end-details");
const detailsBtn = document.getElementsByClassName("detailsBtn");
const dateInput = document.getElementsByClassName("dateInput");
const dateWrapper = document.getElementById("input-date-wrapper");

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
      return response;
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
      return response;
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
      return response;
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
  <button onclick="" class="detailsBtn"  id="${
    task.label
  }"><i class="fa-solid fa-magnifying-glass"></i> </button>
  <span  class="task-end">${
    task.end_date ? formatDate(task.end_date) : "Pas de date de fin"
  }</span>
  <button onclick="removeTask(event)" id="${
    task.label
  }"class="deleteBtn"><i class='fa-solid fa-trash'></i></button>
  </div>
  `;
    taskEl.innerHTML = taskElMarkup;
    tasksList.appendChild(taskEl);
  }
}

const removeTask = async (e) => {
  let label;
  if (e.target.id) {
    label = e.target.id;
  } else {
    label = e.target.parentElement.id;
  }
  const response = await deleteTask(label);
  if (response && response.ok) {
    document.getElementById(label).remove();
  }
};

const getTaskInfos = async (label) => {
  const response = await getTask(label);
  return response;
};

async function onOpen(label) {
  const response = await getTaskInfos(label);
  const jsonRes = await response.json();
  if (response && response.ok) {
    console.log(jsonRes);
    const { label, description, end_date, start_date } = jsonRes;
    const inputDetails = `
      <label class="task-content">Changer la date de fin:</label>   
      <input
    type="date"
    min="2023-03-24"
    max="2030-12-31"
    id="${label}"
    name="end_date"
    pattern="\d{4}-\d{2}-\d{2}"
    class="dateInput"
    onchange="changeEndDate(event)"
    />
    `;

    labelDetails.innerHTML = label;
    descriptionDetails.innerHTML = description;
    creationDetails.innerHTML = formatDate(start_date);
    endDetails.innerHTML = end_date ? end_date : "Pas de date de fin";
    dateWrapper.innerHTML = inputDetails;
    //
    if (typeof favDialog.showModal === "function") {
      favDialog.showModal();
    } else {
      console.error(
        "L'API <dialog> n'est pas prise en charge par ce navigateur."
      );
    }
  }
}

const changeEndDate = async (e) => {
  console.log(e.target);
  const label = e.target.id;
  const isoDate = new Date(e.target.value).toISOString();
  const response = await updateTask({
    label: label,
    end_date: isoDate,
  });
  if (response.ok) {
    endDetails.innerHTML = formatDate(isoDate);
    document
      .getElementById(label)
      .getElementsByClassName("task-end")[0].innerHTML = formatDate(isoDate);
    alert("Date de fin modifiée !");
  }
};

function closeTaskDetailsModal() {
  favDialog.close();
  tasksDetails.close();
}

function formatDate(isoDate) {
  return isoDate.replace(/T.*/, "").split("-").reverse().join("-");
}

// Events

tasksList.addEventListener("click", async (e) => {
  console.log(e.target.parentElement.classList);
  if (
    e.target.classList.contains("detailsBtn") ||
    e.target.parentElement.classList.contains("detailsBtn")
  ) {
    e.stopPropagation();
    let label;
    if (e.target.id) {
      label = e.target.id;
    } else {
      label = e.target.parentElement.id;
    }
    onOpen(label);
  }
});

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
//

async function main() {
  let tasks = await getTasks();
  console.log(tasks);
  if (tasks && tasks.length > 0) {
    tasks.map((task) => {
      addTasks(task);
    });
  }
  addTasks(tasks);
}

main();
