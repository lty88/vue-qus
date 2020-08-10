import axios from 'axios';
let request = axios.create({
    baseURL: '/api'
});

export default request;
