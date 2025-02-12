// TaskEditModal.tsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editTask } from "../../redux/slice/taskSlice";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskEditComponent: React.FC<TaskEditModalProps> = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Task | null>(task);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (formData) {
      dispatch(editTask({ id: formData.id, updatedTask: formData }));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <input name="title" value={formData.title} onChange={handleChange} className="border rounded p-2 w-full mb-2" />
        <input name="description" value={formData.description} onChange={handleChange} className="border rounded p-2 w-full mb-2" />
        <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="border rounded p-2 w-full mb-2" />
        <select name="priority" value={formData.priority} onChange={handleChange} className="border rounded p-2 w-full mb-2">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange} className="border rounded p-2 w-full mb-2">
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white  rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 btn-secondary  text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditComponent;
