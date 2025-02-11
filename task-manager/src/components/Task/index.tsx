import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/configureStore";
import { addTask, editTask, deleteTask } from "../../redux/slice/taskSlice";
import Layout from "../Layout/index";
import { v4 as uuidv4 } from "uuid";

// Define the Task interface
interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

const TaskComponent: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"High" | "Medium" | "Low">("High");
  const [selectedStatus, setSelectedStatus] = useState<"To-Do" | "In-Progress" | "Done">("To-Do");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleTaskSubmit = (): void => {
    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      return;
    }
    dispatch(
      addTask({
        id: uuidv4(),
        title,
        description,
        dueDate,
        priority: selectedPriority,
        status: selectedStatus,
      })
    );
    setTitle("");
    setDescription("");
    setDueDate("");
    setSelectedPriority("High");
    setSelectedStatus("To-Do");
  };

  const handleDeleteTask = (id: string): void => {
    dispatch(deleteTask(id));
  };

  const handleEditTask = (id: string, updatedTask: Partial<Task>): void => {
    dispatch(editTask({ id, updatedTask }));
  };

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
          onChange={(e) => setSelectedPriority(e.target.value as "High" | "Medium" | "Low")}
          className="border rounded p-2"
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as "To-Do" | "In-Progress" | "Done")}
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
           handleEditTask={handleEditTask}
         />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
