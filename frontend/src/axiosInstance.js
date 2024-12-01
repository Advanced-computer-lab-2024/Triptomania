import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Ensures cookies are included
});

export default axiosInstance;
