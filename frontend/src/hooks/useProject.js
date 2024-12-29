import { useContext } from 'react';
import { ProjectContext } from '../context/Project.context';

const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectContextProvider');
    }
    return context;
};

export default useProject; 