import useTheme from "../hooks/useTheme";
import Project from "../components/Project";
import { useEffect, useState } from "react";
import { IOAxios } from "../config/axios";
import Nav from "../components/Nav";

const Home = () => {
  const { Theme } = useTheme();

  const [Projects, setProjects] = useState([]);

  useEffect(() => {
    async function GetProjects() {
      try {
        const res = await IOAxios.get("/project/all",{headers: { Authorization: `Bearer ${localStorage.getItem('auth/v1')}` },});
        if (res?.data?.success) {
          setProjects(res?.data?.Projects || []);
        }
      } catch (error) {}
    }
    GetProjects();
    return () => {};
  }, []);

  return (
    <>
    <Nav />
    <main
      className={`h-screen pt-[70px] p-4 w-full flex justify-start items-start gap-5 flex-wrap transition-colors duration-300 relative ${
        Theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {Projects.map((project, i) => {
        return (
          <Project
            key={i}
            id={project._id}
            name={project.name}
            users={project.users}
            author={project.author}
          />
        );
      })}
    </main>
    </>
  );
};

export default Home;
