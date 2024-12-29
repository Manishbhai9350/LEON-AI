import { createContext, useState } from "react";

export const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
    const [project, setProject] = useState({ name: '', users: '', author: '', _id: '' });

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectContextProvider;