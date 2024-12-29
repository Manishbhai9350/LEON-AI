import { useEffect } from "react";
import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { IOAxios } from "../config/axios";
import Toast from "react-hot-toast";
import useUser from "../hooks/userUser";

const Logout = () => {
  const { Theme } = useTheme();

  const navigate = useNavigate();

  const { User, setUser } = useUser();

  useEffect(() => {
    async function LogOut() {
      try {
        const Token = localStorage.getItem("auth/v1");
        const res = await IOAxios.get("/user/logout", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth/v1")}`,
          },
        });
        localStorage.setItem("auth/v1", "");
        Toast.success("LogOut Success");
        navigate("/auth");
        setUser({ name: "", email: "", password: "" });
      } catch (error) {
        localStorage.setItem("auth/v1", "");
        Toast.success("LogOut Success");
        navigate("/auth");
        setUser({ name: "", email: "", password: "" });
      }
    }
    LogOut();
    return () => {};
  }, []);

  return (
    <div
      className={`transition-colors h-screen duration-300 ${
        Theme === "dark" ? "text-white bg-gray-900 " : "text-black bg-white"
      }`}
    >
      Logout
    </div>
  );
};

export default Logout;
