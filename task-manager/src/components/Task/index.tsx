import React, { useEffect, useState } from "react";
import Layout from "../Layout/index";

// Define the Task interface
interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

const TaskComponent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<Task["priority"]>("High");
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("To-Do");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  // Delete the selected task
  const handleDeleteTask = (): void => {
    if (selectedTask) {
      const updatedTasks = tasks.filter((task) => task !== selectedTask);
      setTasks(updatedTasks);
      setSelectedTask(null);
    }
  };

  // Add a new task
  const handleTaskSubmit = (): void => {
    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      return;
    }
    const newTask: Task = {
      title,
      description,
      dueDate,
      priority: selectedPriority,
      status: selectedStatus,
    };
    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
    setDueDate("");
    setSelectedPriority("High");
    setSelectedStatus("To-Do");
  };

  // Edit a selected task
  const handleEditTask = (updatedTask: Task): void => {
    const updatedTasks = tasks.map((task) =>
      task === selectedTask ? updatedTask : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  // Filter tasks based on search, priority, and status
  const filteredTasks = tasks
    .filter((task) => (filterPriority ? task.priority === filterPriority : true))
    .filter((task) => (filterStatus ? task.status === filterStatus : true))
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-8">
      {/* Task Input Section */}
      <div className="lg:flex grid gap-2 items-center font-main">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          placeholder="Task Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2"
          placeholder="Task Description"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as Task["priority"])}
          className="border rounded p-2"
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Task["status"])}
          className="border rounded p-2"
        >
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>
        <button onClick={handleTaskSubmit} className="btn btn-secondary">
          Add Task
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Search tasks by title or description"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Task Display Section */}
      <div className="mt-4 space-y-4 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["High", "Medium", "Low"].map((level) => (
            <Layout
              key={level}
              tasks={filteredTasks.filter((task) => task.priority === level)}
              level={level as Task["priority"]}
            //   getTasksByPriority={getTasksByPriority}
              handleDeleteTask={handleDeleteTask}
              selectedTask={selectedTask}
              handleEditTask={handleEditTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
