import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/configureStore";
import { addTask, editTask, deleteTask } from "../../redux/slice/taskSlice";
import Layout from "../Layout/index";
import { v4 as uuidv4 } from "uuid";

// Define the Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

const TaskComponent: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Task input states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Task["priority"]>("High");
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("To-Do");

  // Error state to track touched fields
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    dueDate: false,
  });

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Check if the form is valid
  const isFormValid = useMemo(() => title.trim() && description.trim() && dueDate.trim(), [title, description, dueDate]);

  // Handle form field blur to mark fields as touched
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle adding a new task
  const handleTaskSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();
      setTouched({ title: true, description: true, dueDate: true }); // Mark all fields as touched

      if (!isFormValid) return;

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

      // Reset form fields
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedPriority("High");
      setSelectedStatus("To-Do");
      setTouched({ title: false, description: false, dueDate: false }); // Reset touched state
    },
    [dispatch, title, description, dueDate, selectedPriority, selectedStatus, isFormValid]
  );

  // Handle deleting a task
  const handleDeleteTask = useCallback(
    (id: string): void => {
      dispatch(deleteTask(id));
    },
    [dispatch]
  );

  // Handle editing a task
  const handleEditTask = useCallback(
    (id: string, updatedTask: Partial<Task>): void => {
      dispatch(editTask({ id, updatedTask }));
    },
    [dispatch]
  );

  // Memoized task filtering logic
  const filteredTasks = useMemo(
    () =>
      tasks
        .filter((task) => (filterPriority ? task.priority === filterPriority : true))
        .filter((task) => (filterStatus ? task.status === filterStatus : true))
        .filter(
          (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [tasks, filterPriority, filterStatus, searchQuery]
  );

  return (
    <div className="p-8">
      {/* Task Input Section */}
      <form className="gap-2 items-center font-main grid lg:grid-cols-6 3xl:grid-cols-4" onSubmit={handleTaskSubmit}>
        <div>
          <input
            type="text"
            value={title}
            className="border rounded p-2 w-full"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur("title")}
            placeholder="Task Title"
          />
          {touched.title && !title.trim() && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        <div>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Task Description"
          />
          {touched.description && !description.trim() && <p className="text-red-500 text-sm">Description is required</p>}
        </div>

        <div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onBlur={() => handleBlur("dueDate")}
            className="border rounded p-2 w-full"
          />
          {touched.dueDate && !dueDate.trim() && <p className="text-red-500 text-sm">Due Date is required</p>}
        </div>

        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value as Task["priority"])} className="border rounded p-2">
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as Task["status"])} className="border rounded p-2">
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>

        <button type="submit" className="btn btn-secondary cursor-pointer" disabled={!isFormValid}>
          Add Task
        </button>
      </form>

      {/* Search and Filter Section */}
      <div className="mt-4 gap-2 grid">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border rounded p-2 lg:w-full" placeholder="Search tasks by title or description" />
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border rounded p-2">
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded p-2">
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
            <Layout key={level} tasks={filteredTasks.filter((task) => task.priority === level)} level={level as Task["priority"]} handleDeleteTask={handleDeleteTask} handleEditTask={handleEditTask} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default TaskComponent;
