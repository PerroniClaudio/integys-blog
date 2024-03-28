import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.MAILERLITE_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
axios.defaults.headers.common["Authorization"] = "Bearer " + process.env.MAILERLITE_TOKEN;

export default axios;