import axios from 'axios';

const axiosConfig = axios.interceptors.request.use(function (config) {
  if (localStorage.getItem('token')) {
    const token = `Bearer ${localStorage.getItem('token')}`;
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosConfig;
