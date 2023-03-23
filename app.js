const inpSearch = document.querySelector(".inpSearch");
const addButton = document.querySelector(".add");
const textArea = document.querySelector(".inp");
const tasksList = document.querySelector(".ul");

// Variables //
const allTasks = [];

// Functions //
function renderTaskList() {
  const li = document.createElement("li");
  const taskContent = document.createElement("input");
  const deleteBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  taskContent.setAttribute("readonly", "readonly");
  taskContent.className = "task-content";
  deleteBtn.classList.add("deleteBtn");
  editBtn.classList.add("editBtn");
  deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
  editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";

  if (!(textArea.value === "")) {
    allTasks.push(li);
    tasksList.appendChild(li);
    li.appendChild(taskContent);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskContent.value = textArea.value;

    allTasks.forEach(function (element, key) {
      element.id = key;
      tasksList.appendChild(element);
    });
  } else {
    return;
  }

  textArea.value = "";
  taskContent.disabled = true;

  editBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (editBtn.firstChild.classList.contains("fa-pen-to-square")) {
      taskContent.disabled = false;
      taskContent.removeAttribute("readonly");
      taskContent.focus();
      editBtn.innerHTML = "<i class='fa-solid fa-check'></i>";
    } else {
      taskContent.setAttribute("readonly", "readonly");
      taskContent.disabled = true;
      editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
    }
  });

  deleteBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const index = event.target.parentNode.id;
    allTasks.splice(index, 1);
    this.parentElement.remove();
  });
}

// Events //

textArea.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    renderTaskList();
  }
});

addButton.addEventListener("click", function () {
  event.preventDefault();
  renderTaskList();
});

inpSearch.addEventListener("keyup", () => {
  renderTaskList();
});
