import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { FaCheck, FaTrash, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  fetchTasks,
  markComplete,
} from "../redux/taskSlice";
import { Loader } from "lucide-react";
import useTask from "../customHooks/useTask";
import toast from "react-hot-toast";
import useDelete from "../customHooks/useDelete";
import axios from "axios";

const TaskManagementPage = () => {
  const {
    tasks: tk,
    pending,
    error,
  } = useSelector((state: any) => state.tasks);
  const { token } = useSelector((state: any) => state?.auth);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0); // Overall progress state
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (tk) {
      setTasks(tk);
    }
  }, [tk]);

  useEffect(() => {
    calculateOverallProgress();
  }, [tasks]);

  const { loading, PostData } = useTask("/task/", token);

  const handleAddTask = async () => {
    const resp = await PostData({
      deadline: newTaskDeadline,
      title: newTaskTitle,
    });
    if (resp) {
      setNewTaskDeadline("");
      setNewTaskTitle("");
      setShowAddTaskModal(false);
      dispatch(addTask(resp?.task));
      toast.success(resp?.message);
    }
  };

  const { loading: isLoading, deleteData } = useDelete(
    `/task/${taskToDelete}`,
    token
  );

  const handleDeleteTask = async (id: string) => {
    const resp = await deleteData();
    if (resp) {
      dispatch(deleteTask(taskToDelete));
      setShowDeleteModal(false);
      toast.success(resp?.message);
    }
  };

  const handleCompleteTask = async (id: string) => {
    const resp = await axios.put(
      `/task/${id}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (resp?.data) {
      dispatch(markComplete(id));
      setShowCompletionModal(false);
      toast.success(resp.data?.message);
    }
  };

  const handleUpdateTask = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === id) {
        return {
          ...task,
          progress: task.progress + 10 > 100 ? 100 : task.progress + 10,
          status: task.progress + 10 >= 100 ? "Completed" : task.status,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const calculateOverallProgress = () => {
    if (!tasks.length) {
      setOverallProgress(0);
      return;
    }

    let totalProgress = 0;
    tasks.forEach((task) => {
      const deadlinePassed =
        new Date(task.deadline).getTime() < new Date().getTime();
      const penalty = deadlinePassed && task.status !== "Completed" ? 5 : 0;
      totalProgress += task.progress - penalty;
    });
    setOverallProgress(
      Math.max(0, Math.min(100, totalProgress / tasks.length))
    );
  };

  const colors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-red-100",
    "bg-indigo-100",
    "bg-pink-100",
    "bg-teal-100",
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <button
          onClick={() => setShowAddTaskModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="h-2.5 bg-green-500 rounded-full"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm">{overallProgress.toFixed(2)}%</span>
      </div>

      {/* Task List */}
      {tasks.length < 1 && (
        <div className="h-[200px] flex justify-center items-center w-full">
          <h3>You have no tasks created yet, please create one</h3>
        </div>
      )}

      {pending && (
        <div className="h-[200px] flex justify-center items-center w-full">
          <Loader className="animate-spin" />
        </div>
      )}

      {error && (
        <div className="h-[200px] flex justify-center items-center w-full">
          {error}
        </div>
      )}

      {tasks && (
        <div className="overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={`bg-white border-b dark:bg-gray-900 dark:border-gray-700 ${
                    colors[index % colors.length]
                  } ${task.status === "Completed" ? "opacity-75" : ""}`}
                >
                  <td className="px-6 py-4">{task.title}</td>
                  <td className="px-6 py-4">{task.deadline}</td>
                  <td className="px-6 py-4">
                    {task.status === "Completed" ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          task.status === "Completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{task.progress}%</span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    {task.status !== "Completed" && task.progress !== 100 ? (
                      <>
                        <button
                          onClick={() => handleUpdateTask(task._id)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          Update Progress
                        </button>
                        <button
                          onClick={() => {
                            setTaskToComplete(task._id);
                            handleMarkAsComplete(task._id); // Function to mark task as complete
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaCheck className="mr-2" />
                          Mark Complete
                        </button>
                        <button
                          onClick={() => {
                            setTaskToDelete(task._id);
                            setShowDeleteModal(true);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="p-2 px-4 border bg-green-500 rounded-full text-white text-sm font-semibold shadow-lg transform hover:scale-105 transition duration-300">
                          Completed
                        </span>
                        <button
                          onClick={() => handleUndoCompletion(task._id)} // Function to undo completion
                          className="px-2 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                          Undo
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal show={showAddTaskModal} onClose={() => setShowAddTaskModal(false)}>
        <Modal.Header>Add New Task</Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded-lg"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="date"
            className="w-full p-2 mb-4 border rounded-lg"
            value={newTaskDeadline}
            onChange={(e) => setNewTaskDeadline(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleAddTask}
            disabled={loading}
            className={`px-4 py-2 ${
              loading
                ? "bg-gray-200"
                : "bg-blue-500 text-white hover:bg-blue-700"
            } rounded-lg`}
          >
            {loading ? <Loader className="animate-spin" /> : "Add Task"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Task</Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleDeleteTask(taskToDelete!)}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {isLoading ? <Loader className="animate-spin" /> : " Delete"}
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      >
        <Modal.Header>Complete Task</Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this task as complete?
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleCompleteTask(taskToComplete!)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Mark Complete
          </button>
          <button
            onClick={() => setShowCompletionModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskManagementPage;
