const axios = require("axios");
const axiosApiInstance = axios.create();
const Swal = require("sweetalert2");

//ambil token dari localstorage
let token;
if (process.browser) {
  token = localStorage.getItem("token");
}

axiosApiInstance.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error.response.status === 400) {
      if (error.response.data.message === "Invalid Token") {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
