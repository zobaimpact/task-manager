import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/configureStore";
import { addTask, deleteTask } from "../../redux/slice/taskSlice";
import Layout from "../Layout/index";
import { v4 as uuidv4 } from "uuid";
import TaskEditComponent from "../Editask";
import { useTranslation } from "react-i18next";

// Define the Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  active?: boolean;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

const TaskComponent: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedPriority, setSelectedPriority] =
    useState<Task["priority"]>("High");
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("To-Do");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [language, setLanguage] = useState("en");

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
  const [filterDueDate, setFilterDueDate] = useState("");

  // Check if the form is valid
  const isFormValid = useMemo(
    () => title.trim() && description.trim() && dueDate.trim(),
    [title, description, dueDate]
  );

  // Handle form field blur to mark fields as touched
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Language switcher
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setLanguage(language);
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
    [
      dispatch,
      title,
      description,
      dueDate,
      selectedPriority,
      selectedStatus,
      isFormValid,
    ]
  );

  // Handle deleting a task
  const handleDeleteTask = useCallback(
    (id: string): void => {
      dispatch(deleteTask(id));
    },
    [dispatch]
  );

  // Handle editing a task
  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  }, []);

  // Memoized task filtering logic
  const filteredTasks = useMemo(
    () =>
      tasks
        .filter((task) =>
          filterPriority ? task.priority === filterPriority : true
        )
        .filter((task) => (filterStatus ? task.status === filterStatus : true))
        .filter((task) =>
          filterDueDate ? task.dueDate === filterDueDate : true
        )
        .filter(
          (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [tasks, filterPriority, filterStatus, searchQuery, filterDueDate]
  );

  return (
    <>
      <div className="p-8">
        {/* Language Selection */}
        <div className="flex mb-4">
          <button
            onClick={() => changeLanguage("en")}
            className={`btn ${
              language === "en" ? "btn-secondary" : "btn-primary"
            } cursor-pointer ring rounded pb-1.5 min-w-32 focus:ring-0`}
            aria-pressed={language === "en"}
            aria-label="Switch to English"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("fr")}
            className={`btn ${
              language === "fr" ? "btn-secondary" : "btn-primary"
            } cursor-pointer ring rounded pb-1.5 min-w-32 ml-2 focus:ring-0`}
            aria-pressed={language === "fr"}
            aria-label="Switch to French"
          >
            French
          </button>
        </div>

        {/* Task Input Section */}
        <form
          className="gap-2 items-center font-main grid lg:grid-cols-6 3xl:grid-cols-4"
          onSubmit={handleTaskSubmit}
          aria-labelledby="task-form-title"
        >
          <h2 id="task-form-title" className="sr-only">
            Add a New Task
          </h2>

          <div>
            <label htmlFor="task-title" className="sr-only">
              {t("title")}
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              className="border rounded p-2 w-full focus:ring-0"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder={t("title")}
              aria-invalid={touched.title && !title.trim()}
            />
            {touched.title && !title.trim() && (
              <p className="text-red-500 text-sm" role="alert">
                {t("title")} is required
              </p>
            )}
          </div>

          <div>
            <label htmlFor="task-desc" className="sr-only">
              {t("description")}
            </label>
            <input
              id="task-desc"
              type="text"
              className="border rounded p-2 w-full focus:ring-0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder={t("description")}
              aria-invalid={touched.description && !description.trim()}
            />
            {touched.description && !description.trim() && (
              <p className="text-red-500 text-sm" role="alert">
                {t("description")} is required
              </p>
            )}
          </div>

          <div>
            <label htmlFor="task-due" className="sr-only">
              Due Date
            </label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={() => handleBlur("dueDate")}
              className="border rounded p-2 w-full focus:ring-1"
              aria-invalid={touched.dueDate && !dueDate.trim()}
            />
            {touched.dueDate && !dueDate.trim() && (
              <p className="text-red-500 text-sm" role="alert">
                Due Date is required
              </p>
            )}
          </div>

          <label htmlFor="task-priority" className="sr-only">
            {t("high")}
          </label>
          <select
            id="task-priority"
            value={selectedPriority}
            onChange={(e) =>
              setSelectedPriority(e.target.value as Task["priority"])
            }
            className="border rounded p-2 focus:ring-0"
          >
            <option value="High">{t("high")}</option>
            <option value="Medium">{t("medium")}</option>
            <option value="Low">{t("low")}</option>
          </select>

          <label htmlFor="task-status" className="sr-only">
            {t("statuses")}
          </label>
          <select
            id="task-status"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as Task["status"])
            }
            className="border rounded p-2 focus:ring-0"
          >
            <option value="To-Do">{t("todo")}</option>
            <option value="In-Progress">{t("progress")}</option>
            <option value="Done">{t("done")}</option>
          </select>

          <button
            type="submit"
            className="btn btn-secondary cursor-pointer focus:ring-0"
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
          >
            {t("add")}
          </button>
        </form>

        {/* Search and Filter Section */}
        {tasks.length > 0 && (
          <div className="mt-4 gap-2 grid">
            <label htmlFor="search-tasks" className="sr-only">
              Search tasks
            </label>
            <input
              id="search-tasks"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded p-2 lg:w-full focus:ring-0"
              placeholder="Search tasks by title or description"
            />

            <label htmlFor="filter-priority" className="sr-only">
              {t("all")}
            </label>
            <select
              id="filter-priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border rounded p-2 focus:ring-0"
            >
              <option value="">{t("all")}</option>
              <option value="High">{t("high")}</option>
              <option value="Medium">{t("medium")}</option>
              <option value="Low">{t("low")}</option>
            </select>

            <label htmlFor="filter-date" className="sr-only">
              Filter by Due Date
            </label>
            <input
              id="filter-date"
              type="date"
              value={filterDueDate}
              onChange={(e) => setFilterDueDate(e.target.value)}
              className="border rounded p-2 w-full focus:ring-0"
            />

            <label htmlFor="filter-status" className="sr-only">
              {t("statuses")}
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded p-2 focus:ring-0"
            >
              <option value="">{t("statuses")}</option>
              <option value="To-Do">{t("todo")}</option>
              <option value="In-Progress">{t("progress")}</option>
              <option value="Done">{t("done")}</option>
            </select>
          </div>
        )}

        {/* Task Display Section */}
        {tasks.length > 0 && (
          <div className="mt-4 space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["High", "Medium", "Low"].map((level) => (
                <Layout
                  key={level}
                  tasks={filteredTasks.filter(
                    (task) => task.priority === level
                  )}
                  level={level as Task["priority"]}
                  handleDeleteTask={handleDeleteTask}
                  handleEditTask={handleEditTask}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && editingTask && (
        <TaskEditComponent
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
});

export default TaskComponent;
