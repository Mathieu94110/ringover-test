const inp = document.querySelector(".inp");
const btn = document.querySelector(".btn");
const ul = document.querySelector(".ul");
const inpSearch = document.querySelector(".inpSearch");

// Functions //
const allTasks = [];
const createTask = (task) => {
  allTasks.push(task);
};

inpSearch.addEventListener("keyup", () => {
  renderTaskList();
});

const renderTaskList = () => {
  ul.innerHTML = "";
  const query = inpSearch.value || "";
  const filterTasks = allTasks.filter((task) => {
    if (query == "") {
      return true;
    } else {
      return task.text.toLowerCase().includes(query.toLowerCase());
    }
  });

  filterTasks.forEach((task) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
    editBtn.classList.add("editBtn");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "X";
    deleteBtn.classList.add("deleteBtn");

    div.innerHTML = task.text;
    div.classList.add("taskName");

    li.append(div, editBtn, deleteBtn);
    ul.append(li);

    editBtn.addEventListener("click", () => {
      editTask(task);
      renderTaskList();
    });

    deleteBtn.addEventListener("click", () => {
      removeTask(task);
      renderTaskList();
    });
  });
  const removeTask = (task) => {
    const index = allTasks.findIndex((t) => {
      return t.id === task.id;
    });
    allTasks.splice(index, 1);
  };
  const editTask = (task) => {
    console.log(task);
    const index = filterTasks.findIndex((t) => {
      return t.id === task.id;
    });
    filterTasks[index].edit = !task.edit;
  };
};

// Events //
btn.addEventListener("click", () => {
  const task = {};
  task.text = inp.value;
  task.id = new Date().getTime();
  task.edit = false;
  createTask(task);
  inp.value = "";
  inpSearch.value = "";
  renderTaskList();
});
