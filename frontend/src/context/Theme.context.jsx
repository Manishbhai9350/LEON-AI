import { createContext, useState, useContext } from "react";
import useTheme from '../hooks/useTheme';

export const ThemeContext = createContext()

export function ThemeContextProvider({children}){
    const [Theme, setTheme] = useState('dark')
    return <ThemeContext.Provider value={{Theme,setTheme}}>
        {children}
    </ThemeContext.Provider>
}
