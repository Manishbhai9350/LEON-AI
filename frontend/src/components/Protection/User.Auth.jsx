import { useEffect, useState } from "react";
import { useNavigate, useResolvedPath } from "react-router-dom";
import { IOAxios } from "../../config/axios";
import Toast from "react-hot-toast";
import useTheme from "../../hooks/useTheme";
import useUser from "../../hooks/userUser";

const UserAuthProtector = ({ children }) => {
  const [IsAuthenticating, setIsAuthenticating] = useState(true);
  const { Theme } = useTheme();

  const { User, setUser } = useUser();

  const { pathname } = useResolvedPath();
  const navigate = useNavigate();

  useEffect(() => {
    async function Authenticate() {
      try {
        const Token = localStorage.getItem("auth/v1");
        if (!Token && pathname == "/") {
          localStorage.setItem("auth/v1", "");
          setUser({name:'',email:'',password:''})
          return navigate("/auth");
        } else if (!Token && pathname == "/auth") {
          return setIsAuthenticating(false);
        }

        if (Token) {
          const Res = await IOAxios.get("/user/profile",{headers: { Authorization: `Bearer ${localStorage.getItem('auth/v1')}` },});
          const User = Res?.data?.User;
          if (User) {
            setUser(User);
            setIsAuthenticating(false);
          } else {
            localStorage.setItem("auth/v1", "");
            setUser({name:'',email:'',password:''})
            return navigate("/auth");
          }
        }
      } catch (error) {
        Toast.error("UnAuthenticated");
        localStorage.setItem("auth/v1", "");
        console.log(error);
        setUser({name:'',email:'',password:''})
        navigate("/auth");
      }
    }
    Authenticate();
    return () => {};
  }, []);

  if (IsAuthenticating) {
    return (
      <div
        className={`h-screen flex items-center justify-center transition-colors duration-300 ${
          Theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        Checking...
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default UserAuthProtector;
