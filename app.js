const tasksList = document.querySelector(".tasks-list");
const tasksDetails = document.getElementById("favDialog");
const tasksForm = document.getElementById("to-do-list-form");
const labelDetails = document.getElementById("label-details");
const descriptionDetails = document.getElementById("description-details");
const creationDetails = document.getElementById("creation-details");
const endDetails = document.getElementById("end-details");
const dateWrapper = document.getElementById("input-date-wrapper");
const searchByText = document.getElementById("search-by-text");
const searchByStartDate = document.getElementById("search-by-start-date");
const searchByEndDate = document.getElementById("search-by-end-date");

let tasks = [];
let tasksFilteredByText = [];
let filteredByEndTasks = [];
let startDate = null;
let endDate = null;

const baseUrl = "http://127.0.0.1:9000/v1/tasks";

async function getTasks() {
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
}

async function getTask(label) {
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
}

async function postTask(taskInfos) {
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
}

async function deleteTask(label) {
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
}

async function updateTask(taskInfos) {
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
}

async function addTask(task) {
  if (task && task.label) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.label);
    if (!tasks.some((t) => t.label === task.label)) {
      tasks = [...tasks, task];
    }
    const taskElMarkup = `
  <div class="task-name">
  <span  class="task-content">${task.label}</span>
  <span  class="task-start">${formatDate(task.start_date)}</span>
  <button onclick="" class="details-button"  id="${
    task.label
  }"><i class="fa-solid fa-magnifying-glass"></i> </button>
  <span  class="task-end">${
    task.end_date ? formatDate(task.end_date) : "Pas de date de fin"
  }</span>
  <button onclick="removeTask(event)" id="${
    task.label
  }"class="delete-button"><i class='fa-solid fa-check'></i></button>
  </div>
  `;
    taskEl.innerHTML = taskElMarkup;
    tasksList.appendChild(taskEl);
  }
}

async function removeTask(e) {
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
}

async function getTaskInfos(label) {
  const response = await getTask(label);
  return response;
}

async function onModalOpen(label) {
  const response = await getTaskInfos(label);
  const jsonRes = await response.json();
  if (response && response.ok) {
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
    class="modal-date-input"
    onchange="changeEndDate(event)"
    />
    `;

    labelDetails.innerHTML = label;
    descriptionDetails.innerHTML = description;
    creationDetails.innerHTML = formatDate(start_date);
    endDetails.innerHTML = end_date
      ? formatDate(end_date)
      : "Pas de date de fin";
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

async function changeEndDate(e) {
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
    // update task end_date for filter by end_date
    let taskIndex = tasks.findIndex((obj) => obj.label == label);
    tasks[taskIndex].end_date = isoDate;
  }
}

function closeTaskDetailsModal() {
  favDialog.close();
  tasksDetails.close();
}

function formatDate(isoDate) {
  return isoDate.replace(/T.*/, "").split("-").reverse().join("-");
}
function formatDateUsToEn(date) {
  return date.split("-").reverse().join("-");
}

function clearDateInputs() {
  startDate = null;
  endDate = null;
  searchByStartDate.value = "";
  searchByEndDate.value = "";
  alert("La date de création ne peut pas etre postérieure à la date de fin");
}

tasksList.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("details-button") ||
    e.target.parentElement.classList.contains("details-button")
  ) {
    e.stopPropagation();
    let label;
    if (e.target.id) {
      label = e.target.id;
    } else {
      label = e.target.parentElement.id;
    }
    onModalOpen(label);
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
    addTask(newTask);
  }
});

searchByText.addEventListener("keyup", filterTasks);

function filterTasks() {
  const query = searchByText.value.toLowerCase();
  let li = tasksList.querySelectorAll("li");
  let textArray = [];
  for (let i = 0; i < li.length; i++) {
    let task = li[i];
    if (task.id.toLowerCase().indexOf(query) > -1) {
      task.style.display = "";
      textArray.push(task);
    } else {
      task.style.display = "none";
    }
  }
  if (textArray.length > 0) {
    tasksFilteredByText = [...textArray];
  } else {
    tasksFilteredByText = [];
  }
  checkByDates();
}

function checkByDates() {
  if (tasksFilteredByText.length > 0) {
    for (let i = 0; i < tasksFilteredByText.length; i++) {
      let task = tasksFilteredByText[i];
      let taskFilteredStart =
        task.getElementsByClassName("task-start")[0].innerHTML;
      let taskFilteredEnd =
        task.getElementsByClassName("task-end")[0].innerHTML;
      if (startDate && endDate && startDate > endDate) {
        clearDateInputs();
      } else if (startDate && endDate && startDate < endDate) {
        if (taskFilteredStart === startDate && taskFilteredEnd === endDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else if (startDate && endDate && startDate === endDate) {
        if (taskFilteredStart === startDate && taskFilteredEnd === endDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else if (startDate && !endDate) {
        if (taskFilteredStart === startDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else if (!startDate && endDate) {
        if (taskFilteredEnd === endDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else {
        task.style.display = "";
      }
    }
  } else {
    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      let taskStart = task.getElementsByClassName("task-start")[0].innerHTML;
      let taskEnd = task.getElementsByClassName("task-end")[0].innerHTML;
      if (startDate && endDate && startDate > endDate) {
        clearDateInputs();
      } else if (startDate && endDate && startDate < endDate) {
        if (taskStart === startDate && taskEnd === endDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else if (startDate && endDate && startDate === endDate) {
        if (taskStart === startDate && taskEnd === endDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else if (startDate && !endDate) {
        if (taskStart === startDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else if (!startDate && endDate) {
        if (taskEnd === endDate) {
          task.style.display = "";
        } else {
          task.style.display = "none";
        }
      } else {
        task.style.display = "";
      }
    }
  }
}

searchByStartDate.addEventListener("input", async (event) => {
  const date = event.target.value;
  filterByStartDate(date);
});

function filterByStartDate(date) {
  startDate = formatDateUsToEn(date);
  filterTasks();
}

searchByEndDate.addEventListener("input", async (event) => {
  const date = event.target.value;
  filterByEndDate(date);
});

function filterByEndDate(date) {
  endDate = formatDateUsToEn(date);
  filterTasks();
}

async function switchMode() {
  filteredByEndTasks = tasks.sort((a, b) => {
    if (new Date(a.end_date).getTime() > new Date(b.end_date).getTime()) {
      return 1;
    } else {
      return -1;
    }
  });
  tasksList.innerHTML = "";
  filteredByEndTasks.map((t) => addTask(t));
}

async function main() {
  tasks = await getTasks();
  filteredByEndTasks = [...tasks];
  // to keep in memory list before filter by end date
  addTask(filteredByEndTasks);
  // for initial list
  addTask(tasks);
  if (tasks && tasks.length > 0) {
    tasks.map((task) => {
      addTask(task);
    });
  }
  addTask(tasks);
}

main();
