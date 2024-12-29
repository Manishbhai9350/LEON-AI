import React from "react";
import useTheme from "../hooks/useTheme";
import { Link } from "react-router-dom";

const Project = ({ name, users, author, id }) => {
  const { Theme } = useTheme();
  return (
    <div
      className={`border max-w-[500px] p-4 rounded-md shadow-md ${
        Theme === "dark"
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-gray-100 text-black hover:bg-gray-200"
      } transition-all duration-300 ease-in-out`}
    >
      <h3 className="text-lg font-bold">{name}</h3>
      <p>
        <strong>Author:</strong> {author.name}
      </p>
      <p>
        <strong>Collaborators:</strong> {users.length}
      </p>
      <Link to={`/project/${id}`}>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300">
          View
        </button>
      </Link>
    </div>
  );
};

export default Project;
