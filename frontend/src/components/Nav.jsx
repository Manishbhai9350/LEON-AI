import { Link } from "react-router-dom";
import { useState } from "react";
import useTheme from "../hooks/useTheme";
import useUser from "../hooks/userUser";
import { IOAxios } from "../config/axios"; // Import IOAxios for making requests
import Toast from "react-hot-toast"; // Import Toast for notifications

const Nav = () => {
  const { Theme, setTheme } = useTheme();
  const { User } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false); // State to track if project creation is in progress

  const handleCreateProject = async () => {
    if (isCreatingProject) return; // Disable button if project creation is already in progress
    setIsCreatingProject(true); // Set state to indicate project creation is in progress
    try {
      const response = await IOAxios.post(
        "/project/create",
        { name: projectName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
          },
        }
      );
      const Project = response?.data?.Project;
      if (response.data.success && Project) {
        // Handle success
        Toast.success("Project created successfully"); // Use Toast for success notification
        setShowPopup(false);
        setProjectName("");
      } else {
        Toast.error("Failed to create project"); // Use Toast for error notification
      }
    } catch (error) {
      Toast.error("Error creating project"); // Use Toast for error notification
    } finally {
      setIsCreatingProject(false); // Reset state after project creation attempt
    }
  };

  return (
    <nav
      className={`px-4 h-[70px] z-50 transition-all duration-300 ease-in-out flex justify-between items-center fixed top-0 left-0 w-screen ${
        Theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {User.email && (
        <>
          <Link to="/logout">
            <div
              className={`px-4 h-12 flex justify-center items-center rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                Theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <p>LOGOUT</p>
            </div>
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowPopup((prev) => !prev)}
              className={`h-12 w-40 mx-2 px-2 rounded-md gap-1 flex items-center justify-evenly transition-all duration-300 ease-in-out transform hover:scale-105 ${
                Theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-50 text-black"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform duration-300 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <h3>New Project</h3>
            </button>

            {showPopup && (
              <>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
                  onClick={() => setShowPopup(false)}
                />
                <div
                  className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg z-50 w-96 transition-all duration-300 ease-in-out ${
                    Theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={`mb-4 px-3 py-2 rounded-md w-full transition-all duration-300 ease-in-out ${
                      Theme === "dark"
                        ? "bg-gray-700 text-white focus:bg-gray-600"
                        : "bg-gray-100 text-black focus:bg-gray-200"
                    }`}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPopup(false)}
                      className={`flex-1 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        Theme === "dark"
                          ? "bg-red-500/60 hover:bg-red-500"
                          : "bg-red-400 hover:bg-red-500"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateProject}
                      className={`flex-1 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        Theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      disabled={isCreatingProject}
                    >
                      {isCreatingProject ? "Creating..." : "Create"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div className="container h-full py-3 gap-3 mx-auto flex justify-end">
        <button
          onClick={() => setTheme(Theme === "dark" ? "light" : "dark")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
            Theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {Theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
