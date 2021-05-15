import axios from "axios";
import axiosApiInstance from "../../../helper/axios";
import Swal from "sweetalert2";

export const getHomeProduct = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/product/home`)
      .then((res) => {
        dispatch({ type: "HOME_PRODUCT", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          reject(new Error(err.response.data.message));
        } else {
          Swal.fire("Internal Server Error!.", "", "error");
        }
      });
  });
};

export const getNewProduct = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/product/new`)
      .then((res) => {
        dispatch({ type: "NEW_PRODUCT", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        reject(new Error(err.response.data.message));
      });
  });
};

export const getPopularProduct = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/product/popular`)
      .then((res) => {
        dispatch({ type: "POPULAR_PRODUCT", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        reject(new Error(err.response.data.message));
      });
  });
};

export const getCategoryProduct =
  (category, queryPage, querySize) => (dispatch) => {
    return new Promise((resolve, reject) => {
      const Url = process.env.api;
      axios
        .get(
          `${Url}/v1/product/list?category=${category}&page=${queryPage}&size=${querySize}`
        )
        .then((res) => {
          dispatch({ type: "CATEGORY_PRODUCT", payload: res.data.data });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

export const getDetailProduct = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axios
      .get(`${Url}/v1/product/details?id=${id}`)
      .then((res) => {
        dispatch({ type: "DETAIL_PRODUCT", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          reject(new Error(err.response.data.message));
        } else {
          Swal.fire("Internal Server Error!.", "", "error");
        }
      });
  });
};

export const getRecomendationProduct = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axios
      .get(`${Url}/v1/product/recom?category=${data}`)
      .then((res) => {
        dispatch({ type: "RECOMENDATION_PRODUCT", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        reject(new Error(err.response.data.message));
      });
  });
};

export const searchProductProcess = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axios
      .post(`${Url}/v1/product/search`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
