import { useContext } from "react";
import { ThemeContext } from '../context/Theme.context';

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeContextProvider');
    }
    return context;
};

export default useTheme; 