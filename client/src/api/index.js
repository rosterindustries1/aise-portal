import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Make sure this matches server port
});

export default api;
