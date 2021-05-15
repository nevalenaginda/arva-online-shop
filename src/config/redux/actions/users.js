import axios from "axios";
import axiosApiInstance from "../../../helper/axios";
import Swal from "sweetalert2";

const signUpRequest = () => {
  return { type: "SIGN_UP_REQUEST" };
};

const signUpSuccess = (data) => {
  return { type: "SIGN_UP_SUCCESS", payload: data };
};

const signUpFailure = (error) => {
  return { type: "SIGN_UP_FAILURE", payload: error };
};

const getProfileRequest = () => {
  return { type: "GET_PROFILE_REQUEST" };
};

const getProfileSuccess = (data) => {
  return { type: "GET_PROFILE_SUCCESS", payload: data };
};

const getProfileFailure = (error) => {
  return { type: "GET_PROFILE_FAILURE", payload: error };
};

const updateProfileSuccess = (data) => {
  return { type: "UPDATE_PROFILE_SUCCESS", payload: data };
};

const updateProfileFailure = (error) => {
  return { type: "UPDATE_PROFILE_FAILURE", payload: error };
};

const getListAddressUserSuccess = (data) => {
  return { type: "GET_LIST_ADDRESS_USER_SUCCESS", payload: data };
};

const getListAddressUserFailure = (error) => {
  return { type: "GET_LIST_ADDRESS_USER_FAILURE", payload: error };
};

const getHistoryOderUserSuccess = (data) => {
  return { type: "GET_HISTORY_ORDER_USER_SUCCESS", payload: data };
};

// const resetRequest = () => {
//     return { type: "RESET_REQUEST" };
// };

// const resetSuccess = () => {
//     return { type: "RESET_SUCCESS" };
// };

// const resetFailure = (error) => {
//     return { type: "RESET_FAILURE", payload: error };
// };

export const signUp = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    dispatch(signUpRequest());
    axios
      .post(`${Url}/v1/users/`, data)
      .then((res) => {
        dispatch(signUpSuccess(res.data.data));
        resolve(res.data.message);
      })
      .catch((err) => {
        dispatch(signUpFailure(err.response.data.message));
        reject(new Error(err.response.data.message));
      });
  });
};

export const verify = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/users/verify`)
      .then((res) => {
        resolve(res.data.message);
      })
      .catch((err) => {
        reject(new Error(err.response.data.message));
      });
  });
};

export const refresPage = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/users/profile`)
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data.data,
          role: res.data.data.role,
          status: res.data.status,
        });
      })
      .catch((err) => {
        reject(err.response.data.message);
      });
  });
};

export const login = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axios
      .post(`${Url}/v1/users/login`, data)
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data.data,
          role: res.data.data.role,
          status: true,
        });
        // localStorage.setItem("id", res.data.data.id)
        localStorage.setItem("token", res.data.data.token);
        resolve(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          reject(err.response.data.message);
        } else {
          Swal.fire("Internal Server Error!.", "", "error");
        }
      });
  });
};

export const getProfile = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    dispatch(getProfileRequest());
    axiosApiInstance
      .get(`${Url}/v1/users/profile`)
      .then((res) => {
        dispatch(getProfileSuccess(res.data.data));
        resolve(res.data.message);
      })
      .catch((err) => {
        dispatch(getProfileFailure(err));
        reject(err);
      });
  });
};

export const updateProfile = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .put(`${Url}/v1/users`, data)
      .then((res) => {
        dispatch(updateProfileSuccess(res.data.data));
        resolve(res);
      })
      .catch((err) => {
        // dispatch(updateProfileFailure(err.response.data.message));
        reject(err);
      });
  });
};

export const getListAddressUser = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .get(`${Url}/v1/address/list`)
      .then((res) => {
        dispatch(getListAddressUserSuccess(res.data.data));
        resolve(res);
      })
      .catch((err) => {
        // dispatch(getListAddressUserFailure(err.response.data.message));
        reject(err);
      });
  });
};

export const deleteAddressUser = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .delete(`${Url}/v1/address?id=${id}`)
      .then((res) => {
        resolve(res);
        dispatch(getListAddressUser());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const insertAddressUser = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .post(`${Url}/v1/address`, data)
      .then((res) => {
        resolve(res);
        dispatch(getListAddressUser());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateAddressUser = (id, data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const Url = process.env.api;
    axiosApiInstance
      .put(`${Url}/v1/address/edit?id=${id}`, data)
      .then((res) => {
        resolve(res);
        dispatch(getListAddressUser());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getHistoryOrderUser =
  (status = "") =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      const Url = process.env.api;
      axiosApiInstance
        .get(`${Url}/v1/order/user?status=${status}`)
        .then((res) => {
          dispatch(getHistoryOderUserSuccess(res.data.data));
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
