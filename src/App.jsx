import { CornerDownLeft, Plus, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const App = () => {
  const [create, setCreate] = useState(false);
  const createCloseRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        create &&
        createCloseRef.current &&
        !createCloseRef.current.contains(event.target)
      ) {
        setCreate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [create]);

  const [task, setTask] = useState([]);

  const FETCH_TASK_URL = "https://task-manager-server-crtj.onrender.com/task";

  useEffect(() => {
    axios.get(FETCH_TASK_URL).then((response) => {
      setTask(response.data);
    });
  }, []);

  const toggleActive = (id) => {
    const updatedTask = task.find((item) => item.id === id);
    if (!updatedTask) return;

    const newStatus = !updatedTask.isActive;
    setTask((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: newStatus } : item
      )
    );

    axios.patch(`${FETCH_TASK_URL}/${id}`, { isActive: newStatus });
  };

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      date: new Date().toLocaleDateString(),
      isActive: false,
    };

    axios
      .post(FETCH_TASK_URL, newTask)
      .then((response) => {
        setTask((prev) => [...prev, response.data]);
        setNewTitle("");
        setNewDescription("");
        setCreate(false);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const deleteTask = (id) => {
    setTask((prev) => prev.filter((item) => item.id !== id));
    axios
      .delete(`${FETCH_TASK_URL}/${id}`)
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl text-center font-extrabold pt-10 text-gray-800">
          Welcome To Your Task Manager
        </h1>

        {task.length === 0 ? (
          <div
            onClick={() => setCreate(true)}
            className="cursor-pointer border-2 mt-10 border-dashed border-gray-300 h-[50vh] flex flex-col justify-center items-center rounded-xl hover:bg-gray-100 transition"
          >
            <Plus size={40} className="text-gray-400 hover:text-gray-600 mb-2" />
            <p className="text-gray-400 font-medium">Add your first task</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-10">
            {task.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 border border-neutral-200 bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between pt-4">
                    <li className="text-xs text-green-500 list-disc">
                      <span className="text-gray-500">{item.date}</span>
                    </li>

                    <button
                      onClick={() => toggleActive(item.id)}
                      className={`text-white cursor-pointer text-xs px-4 py-2 rounded-full transition ${item.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                      {item.isActive ? "Completed" : "Incomplete"}
                    </button>
                  </div>

                  <div className="flex justify-end gap-5 pt-2">
                    <button
                      onClick={() => deleteTask(item.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Task Card */}
            <div
              onClick={() => setCreate(true)}
              className="cursor-pointer border-2 border-dashed border-gray-300 h-40 md:h-full flex justify-center items-center rounded-xl hover:bg-gray-100 transition"
            >
              <Plus size={40} className="text-gray-400 hover:text-gray-600 transition" />
            </div>
          </div>
        )}
      </div>

      {create && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            ref={createCloseRef}
            className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-800">
                Follow us on{" "}
                <a
                  href="https://www.instagram.com/viralface_1"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </h2>
              <button
                onClick={() => setCreate(false)}
                className="text-gray-500 cursor-pointer hover:text-red-500 transition"
              >
                <X />
              </button>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Title"
              className="w-full text-2xl border-l border-gray-300 p-3 outline-none mb-4 focus:border-blue-500"
            />

            <textarea
              rows={8}
              placeholder="Enter your task . . ."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border-l border-gray-300 p-3 outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-6 w-full flex cursor-pointer gap-1 justify-center items-center bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Enter <CornerDownLeft size={20} />
            </button>
            <p
              className={`mt-3 ${error ? "text-red-500" : "text-transparent"
                } text-center text-[10px]`}
            >
              Please fill out the above*
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
