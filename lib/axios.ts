import Axios from 'axios';

/*

const axios = Axios.create({
  baseURL: process.env.MAILERLITE_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
axios.defaults.headers.common["Authorization"] = "Bearer " + process.env.MAILERLITE_TOKEN;

*/

const axios = Axios.create({
  baseURL: process.env.MAILJET_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

axios.defaults.auth = {
  username: process.env.MAILJET_PUBLIC!,
  password: process.env.MAILJET_PRIVATE!
};

export default axios;
