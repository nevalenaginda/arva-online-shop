import axios from "axios";
import axiosApiInstance from "../../../helper/axios";

export const addCart = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    // if (parseInt(data.quantity) >= 0) {
    axiosApiInstance
      .post(`${Url}/v1/cart`, data)
      .then((res) => {
        dispatch({ type: "ADD_CART", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        reject(new Error(err.response.data.message));
      });
    // }
  });
};

export const getCart = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/cart`)
      .then((res) => {
        dispatch({ type: "GET_CART", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        // dispatch({ type: "GET_CART", payload: [] });
        reject(new Error(err));
      });
  });
};
export const deleteCart = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .delete(`${Url}/v1/cart`, data)
      .then((res) => {
        dispatch({ type: "DELETE_CART", payload: res.data.data });
        resolve(res.data.message);
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
};
