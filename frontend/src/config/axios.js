import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});

export { AxiosInstance as IOAxios }