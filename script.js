const addTask = document.querySelector("#add-task");

function createTaskElement(taskInputValue) {
    const newTask = document.createElement("li");
    newTask.className =
        "flex items-center justify-between bg-white rounded-md shadow p-4 mb-2";

    const leftDiv = document.createElement("div");
    leftDiv.className = "flex items-center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className =
        "h-5 w-5 text-pink-500 accent-pink-500 focus:ring-pink-500 rounded-full";

    const label = document.createElement("label");
    label.textContent = taskInputValue;
    label.className = "text-gray-800 font-medium";
    label.style.marginLeft = "0.5rem";

    checkbox.addEventListener("change", () => {
        let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
        const taskText = label.textContent;

        if (checkbox.checked) {
            label.classList.add("line-through", "text-gray-400");
            newTask.setAttribute("data-status", "completed");
            if (!completedTasks.includes(taskText)) {
                completedTasks.push(taskText);
                localStorage.setItem("completed", JSON.stringify(completedTasks));
            }
        } else {
            label.classList.remove("line-through", "text-gray-400");
            newTask.setAttribute("data-status", "active");
            completedTasks = completedTasks.filter(task => task !== taskText);
            localStorage.setItem("completed", JSON.stringify(completedTasks));
        }
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(label);

    const rightDiv = document.createElement("div");
    rightDiv.className = "flex items-center space-x-2";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.className = "text-gray-400 hover:text-blue-500 text-xl";

    editBtn.addEventListener("click", () => {
        const taskInput = document.querySelector("#new-task");
        const li = editBtn.closest("li");
        const taskLabel = li.querySelector("label");
        const originalText = taskLabel.textContent;

        taskInput.value = originalText;
        taskInput.focus();

        li.remove();

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task !== originalText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.className = "text-gray-400 hover:text-red-500 text-xl";

    deleteBtn.addEventListener("click", () => {
        const taskList = document.querySelector("#task-list");
        const taskLabel = deleteBtn.closest("li").querySelector("label").textContent;

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task !== taskLabel);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        taskList.removeChild(deleteBtn.closest("li"));

        let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
        completedTasks = completedTasks.filter(task => task !== taskLabel);
        localStorage.setItem("completed", JSON.stringify(completedTasks));
    });

    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            const allTasks = document.querySelectorAll("#task-list li");

            allTasks.forEach(task => {
                const status = task.getAttribute("data-status") || "active";

                if (filter === "all") {
                    task.style.display = "flex";
                } else if (filter === "active") {
                    task.style.display = status === "active" ? "flex" : "none";
                } else if (filter === "completed") {
                    task.style.display = status === "completed" ? "flex" : "none";
                }
            });

            filterButtons.forEach(btn => btn.classList.remove("bg-pink-500", "text-white"));
            button.classList.add("bg-pink-500", "text-white");
        });
    });

    rightDiv.appendChild(editBtn);
    rightDiv.appendChild(deleteBtn);

    newTask.appendChild(leftDiv);
    newTask.appendChild(rightDiv);

    return newTask;
}

addTask.addEventListener("click", function () {
    const taskInputValue = document.querySelector("#new-task").value.trim();
    const taskList = document.querySelector("#task-list");

    if (taskInputValue === "") return;

    const newTask = createTaskElement(taskInputValue);
    taskList.appendChild(newTask);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskInputValue);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.querySelector("#new-task").value = "";
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.querySelector("#task-list");

    savedTasks.forEach(task => {
        const newTask = createTaskElement(task);
        taskList.appendChild(newTask);
    });
});
