// 1. HTML ka element pakdo
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");

// 2. Saare tasks is array mein rahenge 
let tasks = [];

// Filter
let currentFilter = "all";

// saveTasks aur loadTasks 
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// 3. Naya task add karne ka function 
function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
}

// 4. Array ke hissab se screen par listed banao
function renderTasks() {
    saveTasks();

    taskList.innerHTML = "";

    // new filter
    let visibleTasks = tasks;
    if (currentFilter === "active") {
        visibleTasks = tasks.filter(function (task) {
            return !task.completed;
        });
    } else if (currentFilter === "completed") {
        visibleTasks = tasks.filter(function (task) {
            return task.completed;
        });
    }

    visibleTasks.forEach(function (task) {
        const li = document.createElement("li");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add("done");
        }

        span.addEventListener("dbclick", function () {
            const input = document.createElement("input");
            input.type = "text";
            input.value = task.text;
            input.classList.add("edit-input");
            li,replaceChild(input, span);
            input.focus();

            input.addEventListener("blur", function () {
                const newText = input.value.trim();
                if (newText !== "") {

                }
                renderTasks();
            });

            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.append(checkbox,span, deleteBtn);
        taskList.appendChild(li);
    });
    
    const remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;
    counter.textContent = remaining + " tasks left";
}

// 5. toggleTask aur deleteTask

function toggleTask(id) {
    tasks.forEach(function (task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
    });
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });
    renderTasks();
}

// 6. Click aur Enter key sunna 
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
});

// Filter buttons ka click, ye poora hissa loadtasks() se phele
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        currentFilter = btn.dataset.filter;

        filterButtons.forEach(function (b) {
            b.classList.remove("active");
        });
        btn.classList.add("active");

        renderTasks();
    });
});

loadTasks();
renderTasks();