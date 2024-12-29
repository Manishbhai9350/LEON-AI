import { createContext, useState, useContext } from "react"
export const UserContext = createContext()

const UserContextProvider = ({children}) => {
    const [User, setUser] = useState({name:'',email:'',id:''})
  return (
    <UserContext.Provider value={{User,setUser}}>{children}</UserContext.Provider>
  )
}

export default UserContextProvider