import { createContext, useState, useContext, useEffect } from "react"
import { useSocket } from "../hooks/socket"
export const UserContext = createContext()

const UserContextProvider = ({children}) => {
    const [User, setUser] = useState({name:'',email:'',id:''})
    const {socket,ConnectSocket} = useSocket()

  return (
    <UserContext.Provider value={{User,setUser}}>{children}</UserContext.Provider>
  )
}

export default UserContextProvider