import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IOAxios } from "../config/axios";
import useTheme from "../hooks/useTheme";
import { BsFillSendFill } from "react-icons/bs";
import { FaTimes, FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import gsap from "gsap";
import Toast from 'react-hot-toast';

const ProjectHome = () => {
  const [Message, setMessage] = useState("");
  const { id: ProjectID } = useParams();
  const { Theme, setTheme } = useTheme(); // Added setTheme from useTheme hook
  const [UserPanel, setUserPanel] = useState(false);
  const [AddUserPanel, setAddUserPanel] = useState(false);
  const [SelectedUsers, setSelectedUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Project, setProject] = useState(null);

  const UserPanelRef = useRef(null);
  const UserAddPanelRef = useRef(null);

  async function GetProject() {
    try {
      const res = await IOAxios.get(`/project/get-project/${ProjectID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
        },
      });
      if (res.data.success) {
        setProject(res.data.Project)
        // Assuming the project users are in the response and need to be set to the userList state
        // setUserList(res.data.Project.users);
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    }
  }
  async function GetUsers() {
    try {
      const res = await IOAxios.get("/user/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
        },
      });
      if (res?.data?.success) {
        const users = res.data.Users;
        users.forEach((user) => {
          if (user.projects.indexOf(ProjectID) >= 0) {
            setSelectedUsers((prev) => [...prev, user._id]);
          }
        });
        setUsers(users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  useEffect(() => {
    GetUsers();
    GetProject();
    return () => {};
  }, []);

  const AddUsers = async () => {
    try {
      const res = await IOAxios.put(
        `/project/add-user`,
        {
          UsersID: SelectedUsers,
          ProjectID,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
          },
        }
      );

      if (res?.data?.success) {
        Toast.success("COLLAB UPDATED")
        toggleAddUserPanel()
        GetProject()
      }

    } catch (error) {}
  };

  function toggleUserPanel () {
    gsap.killTweensOf(UserPanelRef.current);
    if (UserPanel) {
      gsap.to(UserPanelRef.current, {
        left: "-100%",
      });
      setUserPanel(false);
    } else {
      gsap.to(UserPanelRef.current, {
        left: 0,
      });
      setUserPanel(true);
    }
  };
  function toggleAddUserPanel () {
    gsap.killTweensOf(".floating");
    if (AddUserPanel) {
      gsap.to(".floating", {
        display: "none",
        opacity: 0,
        pointerEvents: "none",
        background: "none",
      });
      setAddUserPanel(false);
    } else {
      gsap.to(".floating", {
        display: "flex",
        opacity: 1,
        pointerEvents: "all",
        background: "rgba(1,1,1,.3)",
      });
      setAddUserPanel(true);
    }
  };

  return (
    <main
      className={`flex justify-start items-start overflow-hidden w-screen h-screen relative ${
        Theme == "dark" ? "bg-gray-900 text-white" : "bg-zinc-400 text-black"
      }`}
    >
      <div className="container absolute top-1 right-2 h-[70px] py-3 gap-3 mx-auto flex justify-end">
        <button
          onClick={() => setTheme(Theme === "dark" ? "light" : "dark")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
            Theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          {Theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
      <div
        className={`chat-area relative w-[400px] ${
          Theme === "dark" ? "bg-gray-800" : "bg-zinc-300"
        } h-screen`}
      >
        <div className="nav w-full relative z-30 h-[70px] px-4 flex justify-between items-center">
          <div
            onClick={toggleUserPanel}
            className={`btn mx-1 cursor-pointer flex justify-center items-center h-[70%] duration-200 aspect-square ${
              Theme === "dark"
                ? "bg-gray-700 hover:text-gray-700 hover:bg-white "
                : "bg-gray-200 hover:text-white hover:bg-black"
            }`}
          >
            <FaUser fontSize={25} />
          </div>
          <div
            onClick={toggleAddUserPanel}
            className={`btn mx-1 cursor-pointer gap-2 flex justify-center items-center h-[70%] duration-200 `}
          >
            <FaUserPlus fontSize={24} />
            <p className="text-2xl">Collaborators</p>
          </div>
        </div>
        <div className="chat w-full pb-[70px] overflow-y-scroll h-[90%] max-h-[90%] p-2">
          {/* Messages.map((item, i) => {
            if (item.sender == "other") {
              return (
                <div
                  key={i}
                  className={`message p-2 flex flex-col justify-start items-start my-1 w-fit ${
                    Theme === "dark"
                      ? "bg-[#0c1320] text-white"
                      : "bg-black text-white"
                  }`}
                >
                  <span className="opacity-70">{item.name}</span>
                  <p className="text-xl font-medium w-fit h-full  rounded-b-2xl rounded-tr-2xl">
                    {item.message}
                  </p>
                </div>
              );
            } else if (item.sender == "me") {
              return (
                <div
                  key={i}
                  className={`message p-2 flex flex-col justify-self-end items-start my-1 w-fit ${
                    Theme === "dark"
                      ? "bg-[#0c1320] text-white"
                      : "bg-black text-white"
                  }`}
                >
                  <span className="opacity-70">{item.name}</span>
                  <p className="text-xl font-semibold w-fit h-full rounded-b-2xl rounded-tl-2xl">
                    {item.message}
                  </p>
                </div>
              );
            }
          })} */}
        </div>
        <div className="inputs fixed bg-gray-800 bottom-0 left-0 w-[400px] z-30 h-[10%] py-2 gap-1 px-1 flex justify-evenly items-center">
          <div
            className={`w-full h-full overflow-hidden flex justify-start items-center ${
              Theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <input
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className={`w-full h-full input p-2 bg-transparent border-none ${
                Theme === "dark" ? "outline-gray-600" : "outline-gray-300"
              }`}
              type="text"
            />
          </div>
          <div className="chat-box gap-1 flex h-[50px]">
            <div
              className={`send rounded-sm cursor-pointer duration-200 ${
                Theme === "dark"
                  ? "hover:bg-black hover:text-zinc-200"
                  : "hover:bg-black hover:text-white"
              } flex justify-center items-center h-full aspect-square ${
                Theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <BsFillSendFill className="pointer-events-none" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={UserPanelRef}
        className={`user-panel overscroll-y-scroll absolute flex gap-5 flex-col justify-start items-center pt-14 px-4 -left-full z-40 w-[400px] ${
          Theme === "dark" ? "bg-gray-700" : "bg-zinc-300"
        } h-screen transition-opacity duration-300 ease-in-out`}
      >
        <button
          onClick={() => toggleUserPanel()}
          className={`absolute top-0 right-0 m-4 p-2  rounded-full ${
            Theme === "dark" ? "bg-gray-600" : "bg-gray-300"
          } `}
        >
          <FaTimes />
        </button>
        <h1 className="w-full text-3xl text-start">Collaborators</h1>
        {Project?.users?.map((user, i) => (
          <div key={user._id} className="user flex justify-start gap-2 w-full">
            <div className="icon h-[50px] aspect-square flex justify-center items-center  bg-zinc-500">
              <FaUser fontSize={25} />
            </div>
            <div className="info">
              <p className="leading-none opacity-70">{user.email}</p>
              <h1 className="text-2xl">{user.name}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="floating hidden  w-screen h-screen fixed left-0 top-0 z-40 justify-center items-center">
        <div
          ref={UserAddPanelRef}
          className={`add-user-panel overflow-y-scroll pb-[70px] absolute pt-16 px-4  z-40 w-[400px] ${
            Theme === "dark" ? "bg-gray-700" : "bg-zinc-300"
          } h-[80%] duration-300 ease-in-out `}
        >
          <button
            onClick={() => toggleAddUserPanel()}
            className={`absolute top-0 right-0 m-4 p-2 rounded-full ${
              Theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            } `}
          >
            <FaTimes />
          </button>
          <button
            onClick={AddUsers}
            className={`absolute w-[96%] h-[50px]  bottom-2 left-2 text-2xl bg-blue-600 `}
          >
            UPDATE COLLABS
          </button>
          <div className="users w-full h-[100%] overflow-y-scroll">
          {Users?.map((user) => (
            // SelectedUsers?.includes(user._id)
            <div
              onClick={() => {
                setSelectedUsers((prev) => {
                  let NewArr = [...prev];
                  if (NewArr.includes(user._id)) {
                    NewArr = NewArr.filter((e) => e !== user._id);
                  } else {
                    NewArr.push(user._id);
                  }
                  return NewArr;
                });
              }}
              key={user._id}
              className={`user flex justify-start my-1 gap-2  w-full rounded-md border ${
                SelectedUsers.includes(user._id)
                  ? Theme == "light"
                    ? "border-black"
                    : "border-white/70"
                  : "border-white/0"
              } p-2 cursor-pointer duration-300`}
            >
              <div className="icon h-[50px] aspect-square flex justify-center items-center  bg-zinc-500">
                <FaUser fontSize={25} />
              </div>
              <div className="info">
                <p className="leading-none opacity-70">{user.email}</p>
                <h1 className="text-2xl">{user.name}</h1>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="code-area flex-1 h-full "></div>
    </main>
  );
};

export default ProjectHome;
