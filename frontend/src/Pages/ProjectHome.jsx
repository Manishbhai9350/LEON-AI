import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IOAxios } from "../config/axios";
import useTheme from "../hooks/useTheme";
import { BsFillSendFill } from "react-icons/bs";
import { FaJs, FaTimes, FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import gsap from "gsap";
import Toast from "react-hot-toast";
import { useSocket } from "../hooks/socket";
import useUser from "../hooks/useUser";
import { GetFileIcon } from "../utils";
import Markdown from "react-markdown";
import Syntax from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import File from "../components/File";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { GetWebContainer } from "../utils/WebContainer";

const ProjectHome = () => {
  const [Message, setMessage] = useState("");
  const [Messages, setMessages] = useState([]);
  const { id: ProjectID } = useParams();
  const { Theme, setTheme } = useTheme();
  const [UserPanel, setUserPanel] = useState(false);
  const [AddUserPanel, setAddUserPanel] = useState(false);
  const [SelectedUsers, setSelectedUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Project, setProject] = useState(null);
  const [IsMessageLoading, setIsMessageLoading] = useState(false);
  const [FileSystem, setFileSystem] = useState([
    {
      project: "Project-1",
      project_id: "tlcrccp26",
      "is-server": true,
      data: [
        {
          content:
            '{\n  "name": "express-server",\n  "version": "1.0.0",\n  "description": "A simple express server",\n  "main": "index.js",\n  "type": "module",\n  "scripts": {\n    "start": "nodemon index.js"\n  },\n  "author": "",\n  "license": "ISC",\n  "dependencies": {\n    "express": "^4.18.2",\n    "nodemon": "^3.0.1"\n  }\n}',
          ext: ".json",
          fullname: "package.json",
          file: "json",
        },
        {
          content:
            "import express from 'express';\nconst app = express();\nconst port = 3000;\napp.get('/', (req, res) => {\n  res.json({message:'Hello from Express!'});\n});\napp.listen(port, () => {\n  console.log(`Server is running at http://localhost:${port}`);\n});",
          ext: ".js",
          fullname: "index.js",
          file: "javascript",
        },
      ],
    },
  ]);
  const [CurrentFile, setCurrentFile] = useState(0);
  const [CurrentFileProject, setCurrentFileProject] = useState(0);
  const [WebContainerInstace, setWebContainerInstace] = useState(null);
  const [WebContainerFiles, setWebContainerFiles] = useState(null);
  const [IsWebContainerRunning, setIsWebContainerRunning] = useState(false);
  const [RunningProcess, setRunningProcess] = useState(null)

  const UserPanelRef = useRef(null);
  const UserAddPanelRef = useRef(null);
  const MessageBoxRef = useRef(null);

  const { socket, ConnectSocket, emitEvent, listenEvent, disconnectSocket } =
    useSocket();
  const { User } = useUser();

  useEffect(() => {
    
    return () => {};
  }, [CurrentFileProject]);

  async function RunWebContainer() {
    if (!WebContainerInstace) return;
    // setIsWebContainerRunning(true);
    if (!FileSystem) return;
    const CurrentProject = FileSystem[CurrentFileProject];
    if (!CurrentProject["is-server"]) return;

    let FileTree = {};

    CurrentProject.data.forEach((item) => {
      FileTree[item.fullname] = {
        file: {
          contents: item.content,
        },
      };
    });
    setWebContainerFiles(FileTree);
    await WebContainerInstace.mount(FileTree);

    if (RunningProcess) {
      RunningProcess?.kill()
      setRunningProcess(null)
    }
    
    const InstallProcess = await WebContainerInstace.spawn("npm", ["install"]);
    InstallProcess.output.pipeTo(
      new WritableStream({
        write: (chunk) => console.log(chunk),
      })
    );
    const RunProcess = await WebContainerInstace.spawn("npm", ["start"]);
    // setIsWebContainerRunning(false);
    setRunningProcess(RunProcess)
    RunProcess.output.pipeTo(
      new WritableStream({
        write: (chunk) => console.log(chunk),
      })
    );
    
    WebContainerInstace.on('server-ready',(port,url) => {
      console.log(port,url)
      setIsWebContainerRunning(false)
    })
    
    WebContainerInstace.on('error',(err) => {
      console.log(err)
      setIsWebContainerRunning(false)
    })

  }

  async function GetProject() {
    try {
      const res = await IOAxios.get(`/project/get-project/${ProjectID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
        },
      });
      if (res.data.success) {
        ConnectSocket(ProjectID);
        setProject(res.data.Project);
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
        const projectUsers = users.filter((user) =>
          user.projects.includes(ProjectID)
        );
        setSelectedUsers(projectUsers.map((user) => user._id));
        setUsers(users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  async function HandleAiResult(prompt, log_id) {
    try {
      setMessage("");
      setIsMessageLoading(true);
      const MessagePayload = {
        Message: "Thinking... Please wait for the AI response.",
        type: "text",
        Sender: {
          name: "@AI",
          id: User._id,
          email: User.email,
          log_id, // Use the generated log_id
        },
      };
      const UserMessagePayload = {
        Message: prompt,
        type: "text",
        Sender: {
          name: User.name,
          id: User._id,
          email: User.email,
        },
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        UserMessagePayload,
        MessagePayload,
      ]);
      emitEvent("project-message", JSON.stringify(UserMessagePayload));
      emitEvent("project-message", JSON.stringify(MessagePayload));

      const Response = await IOAxios.get("/ai/result", {
        params: {
          prompt,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
        },
      });
      if (Response?.data?.success) {
        emitEvent("remove-ai-boiler-plate", { log_id });
        const { result } = Response.data;
        console.log(result);
        const MessageData = {
          Message: result.Text,
          type: result.type || "text",
          Sender: {
            name: "@AI",
          },
        };
        setMessages((prev) =>
          prev.filter((msg) => msg.Sender.log_id !== log_id).concat(MessageData)
        );
        emitEvent("project-message", JSON.stringify(MessageData));
        if (result.FileSystem) {
          setFileSystem((PrevProjects) => {
            let NewProjects = [];
            if (PrevProjects) {
              NewProjects = [...PrevProjects];
            }
            NewProjects.push({
              project: "Project-" + (PrevProjects?.length + 1 || 1),
              project_id: Math.random().toString(36).substr(2, 9),
              "is-server": result["is-server"], // Generate a random ID
              data: [
                ...(Array.isArray(result.FileSystem)
                  ? result.FileSystem
                  : [result.FileSystem]),
              ],
            });
            console.log(NewProjects);
            emitEvent("ai-file-creation", JSON.stringify(NewProjects));
            return NewProjects;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching AI result:", error);
    } finally {
      setIsMessageLoading(false);
    }
  }

  function SendMessage() {
    if (!Message.trim() || IsMessageLoading) {
      Toast.error("Empty Message");
      return; // Prevent further execution if the message is empty
    }
    const log_id = Math.random().toString(36).substr(2, 9); // Generates a random ID
    if (Message.toLowerCase().includes("@ai")) {
      HandleAiResult(Message, log_id);
      return;
    }
    const MessagePayload = {
      Message,
      type: "text",
      quantity: "plane",
      Sender: {
        id: User._id,
        name: User.name,
        email: User.email,
        log_id, // Include log_id in the message payload
      },
    };
    setMessages((prevMessages) => {
      // Only add the message if it is not already the last message
      if (
        prevMessages.length === 0 ||
        prevMessages[prevMessages.length - 1].Message !== Message
      ) {
        return [...prevMessages, MessagePayload];
      }
      return prevMessages; // Prevent duplicate messages
    });
    emitEvent("project-message", JSON.stringify(MessagePayload));
    setMessage("");
  }

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
        Toast.success("COLLAB UPDATED");
        toggleAddUserPanel();
        GetProject();
      }
    } catch (error) {
      console.error("Failed to add users:", error);
    }
  };

  function toggleUserPanel() {
    gsap.killTweensOf(UserPanelRef.current);
    gsap.to(UserPanelRef.current, {
      left: UserPanel ? "-100%" : 0,
    });
    setUserPanel((prev) => !prev);
  }

  function toggleAddUserPanel() {
    gsap.killTweensOf(".floating");
    gsap.to(".floating", {
      display: AddUserPanel ? "none" : "flex",
      opacity: AddUserPanel ? 0 : 1,
      pointerEvents: AddUserPanel ? "none" : "all",
      background: AddUserPanel ? "none" : "rgba(1,1,1,.3)",
    });
    setAddUserPanel((prev) => !prev);
  }

  const scrollToBottom = () => {
    if (MessageBoxRef.current) {
      MessageBoxRef.current.scrollTop =
        MessageBoxRef.current.scrollHeight * 1.3;
    }
  };

  useEffect(() => {
    if (WebContainerInstace) {
      console.log("Web Container Is Booted UP");
      console.log(WebContainerInstace);
    } else {
      console.log("Web Container Is Not Booted ");
    }
  }, [WebContainerInstace]);

  useEffect(() => {
    GetUsers();
    GetProject();
    GetWebContainer().then((container) => {
      setWebContainerInstace(container);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      listenEvent("project-message-receive", (data) => {
        setMessages((prevMessages) => [...prevMessages, JSON.parse(data)]);
      });
      listenEvent("remove-ai-boiler", (id) => {
        setMessages((prevMessages) => {
          const index = prevMessages.findIndex(
            (message) => message.Sender.log_id === id
          );
          if (index !== -1) {
            return prevMessages.filter((_, i) => i !== index);
          }
          return prevMessages;
        });
      });
      listenEvent("ai-file-creation", (data) => {
        Toast.success("File Creation Recieved");
        setFileSystem(JSON.parse(data));
      });
    }
    return () => {
      disconnectSocket();
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom after receiving a message
  }, [Messages]);

  return (
    <main
      className={`flex justify-start items-start overflow-hidden w-screen h-screen relative ${
        Theme === "dark" ? "bg-gray-900 text-white" : "bg-zinc-400 text-black"
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
        <div
          style={{ scrollbarWidth: 0 }}
          ref={MessageBoxRef}
          className="chat w-full pb-[70px] overflow-y-scroll h-[90%] max-h-[90%] px-2"
        >
          {Messages.map((item, i) => {
            return (
              <div
                key={i}
                className={`flex items-center  ${
                  item.Sender?.id === User._id
                    ? "justify-end"
                    : item.Sender?.name.toLowerCase() === "ai"
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                <div
                  className={`message rounded-md px-2 w-fit max-w-fit overflow-x-scroll my-1 ${
                    Theme === "dark"
                      ? "bg-[#0c1320] text-white"
                      : "bg-black text-white"
                  } ${
                    item.Sender?.id !== User._id
                      ? "rounded-tl-none"
                      : "rounded-tr-none"
                  }`}
                >
                  <p className="text-sm opacity-70">{item.Sender?.name}</p>
                  {/* <Markdown remarkPlugins={syntax}  children={item.Message} /> */}
                  {item.type == "text" ? (
                    <p>{item.Message}</p>
                  ) : (
                    <div className="w-full max-w-full h-auto overscroll-x-scroll">
                      <Syntax
                        customStyle={{ fontSize: 12 }}
                        style={dark}
                        language={item.type}
                      >
                        {item.Message}
                      </Syntax>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={`inputs fixed ${
            Theme == "dark" ? "bg-gray-800" : "bg-gray-300"
          } bottom-0 left-0 w-[400px] z-30 h-[10%] py-2 gap-1 px-1 flex justify-evenly items-center`}
        >
          <div
            className={`w-full h-full overflow-hidden flex justify-start items-center ${
              Theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <input
              value={Message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  SendMessage();
                }
              }}
              placeholder="Enter message"
              className={`w-full h-full input p-2 bg-transparent border-none ${
                Theme === "dark" ? "outline-gray-600" : "outline-gray-300"
              }`}
              type="text"
            />
          </div>
          <div className="chat-box gap-1 flex h-[50px]">
            <div
              onClick={SendMessage}
              className={`send rounded-sm cursor-pointer duration-200 ${
                IsMessageLoading ? "opacity-70" : ""
              } ${
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
          onClick={toggleUserPanel}
          className={`absolute top-0 right-0 m-4 p-2 rounded-full ${
            Theme === "dark" ? "bg-gray-600" : "bg-gray-300"
          } `}
        >
          <FaTimes />
        </button>
        <h1 className="w-full text-3xl text-start">Collaborators</h1>
        {Project?.users?.map((user) => (
          <div key={user._id} className="user flex justify-start gap-2 w-full">
            <div className="icon h-[50px] aspect-square flex justify-center items-center bg-zinc-500">
              <FaUser fontSize={25} />
            </div>
            <div className="info">
              <p className="leading-none opacity-70">{user.email}</p>
              <h1 className="text-2xl">{user.name}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="floating hidden w-screen h-screen fixed left-0 top-0 z-40 justify-center items-center">
        <div
          ref={UserAddPanelRef}
          className={`add-user-panel overflow-y-scroll pb-[70px] absolute pt-16 px-4 z-40 w-[400px] ${
            Theme === "dark" ? "bg-gray-700" : "bg-zinc-300"
          } h-[80%] duration-300 ease-in-out `}
        >
          <button
            onClick={toggleAddUserPanel}
            className={`absolute top-0 right-0 m-4 p-2 rounded-full ${
              Theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            } `}
          >
            <FaTimes />
          </button>
          <button
            onClick={AddUsers}
            className={`absolute w-[96%] h-[50px] bottom-2 left-2 text-2xl bg-blue-600 `}
          >
            UPDATE COLLABS
          </button>
          <div className="users w-full h-[100%] overflow-y-scroll">
            {Users?.map((user) => (
              <div
                onClick={() => {
                  setSelectedUsers((prev) => {
                    const NewArr = prev.includes(user._id)
                      ? prev.filter((e) => e !== user._id)
                      : [...prev, user._id];
                    return NewArr;
                  });
                }}
                key={user._id}
                className={`user flex justify-start my-1 gap-2 w-full rounded-md border ${
                  SelectedUsers.includes(user._id)
                    ? Theme === "light"
                      ? "border-black"
                      : "border-white/70"
                    : "border-white/0"
                } p-2 cursor-pointer duration-300`}
              >
                <div className="icon h-[50px] aspect-square flex justify-center items-center bg-zinc-500">
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

      <div className="code-area relative flex justify-start items-start mt-[70px] flex-1 h-full">
        <div className="files flex flex-col justify-start items-center p-2 gap-2 w-[160px] h-full">
          {FileSystem &&
            FileSystem[CurrentFileProject].data.map((file, i) => (
              <File
                key={i}
                idx={i}
                current={CurrentFile}
                setCurrent={setCurrentFile}
                Theme={Theme}
                {...file}
              />
            ))}
        </div>
        <div className="code flex-1 h-full w-full">
          {FileSystem && FileSystem[CurrentFileProject].data.length > 0 && (
            <CodeiumEditor
              language={FileSystem[CurrentFileProject].data[CurrentFile].file}
              containerStyle={{
                backgroundColor: Theme === "dark" ? "#1e1e1e" : "#ffffff",
              }}
              value={FileSystem[CurrentFileProject].data[CurrentFile].content}
              onChange={(e) => {
                setFileSystem(() => {
                  const NewFileSystem = [...FileSystem];
                  NewFileSystem[CurrentFileProject].data[CurrentFile].content =
                    e;
                  return NewFileSystem;
                });
              }}
              className="w-full h-screen"
              theme="vs-dark"
            />
          )}
        </div>
      </div>
      <div className="current-file-project fixed top-3 right-1/3 z-[80] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {FileSystem && FileSystem.length > 0 ? (
          <select
            className={`w-full p-3  ${
              Theme == "dark" ? "bg-gray-600 text-white" : "bg-white text-black"
            }  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300`}
            value={CurrentFileProject}
            onChange={(e) => {
              setCurrentFile(0);
              setCurrentFileProject(e.target.value);
            }}
          >
            {FileSystem.map((project, i) => (
              <option value={i} key={project.project_id}>
                {project.project}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500 p-3 dark:text-gray-400">
            No projects available
          </p>
        )}
      </div>
      {FileSystem && FileSystem[CurrentFileProject]["is-server"] && (
        <div
          onClick={(e) => {
            if (IsWebContainerRunning) {
              Toast.error("Container Is Running");
              return;
            } else {
              RunWebContainer();
            }
          }}
          className={`fixed w-fit px-5 h-[40px] flex justify-center items-center rounded-md cursor-pointer bg-emerald-600 hover:bg-emerald-500 duration-150 top-3 right-1/2 z-[80]`}
        >
          <p className="pointer-events-none text-2xl font-medium">
            {IsWebContainerRunning ? "Running..." : "RUN"}
          </p>
        </div>
      )}
    </main>
  );
};

export default ProjectHome;
