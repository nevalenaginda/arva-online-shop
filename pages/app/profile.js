import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import Modal from "react-modal";
import toRupiah from "../../src/helper/rupiah";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  updateProfile,
  getListAddressUser,
  insertAddressUser,
  getHistoryOrderUser,
} from "../../src/config/redux/actions/users";
import { ListUserAddress } from "../../src/component/module";
import withAuth from "../../src/helper/authNext";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const api = process.env.api;
  const { myAcount, shippingAddress, myOrder } = useSelector(
    (state) => state.Helpers
  );
  const { user, loading, listAddressUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (user.role === "seller") {
      router.push("/app/profile-store");
    }
  }, [user]);

  const [state, setState] = useState({
    toggleModal: false,
    linkSideBar: {
      myAcount: true,
      shippingAddress: false,
      myOrder: false,
    },
    myOrder: {
      allItem: true,
      pending: false,
      noPaid: false,
      package: false,
      send: false,
      completed: false,
      orderCancel: false,
      orderStatus: "",
    },
  });

  //=============ini awal bagian edit profile user===============
  // state unable and disable edit profile
  const [profileIsDisable, setProfileIsDisabled] = useState(true);

  //state loading update or other
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);

  //state menampung alamat gambar
  const [imgUrl, setImgUrl] = useState(null);

  // state untuk nampung data user
  const [profileUser, setProfileUser] = useState({});

  //state status onchange gambar
  const [imgStatus, setImgStatus] = useState(false);

  //state untuk menampung file gambar
  const [dataImage, setDataImage] = useState({
    image: {},
  });

  const handleChangeImage = (event) => {
    // const imgFiles = event.target.files[0];
    const { type } = event.target.files[0];
    if (type.match(/jpeg|png/g)) {
      if (event.target.files[0].size > 2 * 1024 * 1024) {
        Swal.fire(
          "Something Error!",
          "This file is to large. Maximum file size 2 mb.",
          "error"
        );
      } else {
        setImgUrl(URL.createObjectURL(event.target.files[0]));
        setImgStatus(true);
        setDataImage({
          image: event.target.files[0],
        });
      }
    } else {
      Swal.fire(
        "Something Error!",
        "Only .png, .jpg and .jpeg format allowed!",
        "error"
      );
    }
  };

  //function untuk handle perubaha data pada form
  const handleChangeDataProfile = (e) => {
    setProfileUser({
      ...profileUser,
      [e.target.name]: e.target.value,
    });
  };

  //patch data profile yang diubah ke api
  const handleSubmitChangeProfile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", profileUser.name);

    formData.append("email", profileUser.email);
    formData.append("gender", profileUser.gender);

    if (profileUser.phone) {
      formData.append("phone", profileUser.phone);
    }
    if (profileUser.birthday) {
      formData.append("birthday", profileUser.birthday);
    }
    if (imgStatus) {
      formData.append("avatar", dataImage.image);
    }
    setIsLoadingProcess(true);
    dispatch(updateProfile(formData))
      .then((res) => {
        setIsLoadingProcess(false);
        Swal.fire("Success", res.data.message, "success");
      })
      .catch((err) => {
        setIsLoadingProcess(false);
        Swal.fire("Something Error!", err.response.data.message, "error");
      });
  };

  //fetch data user dari api
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  //set data user dari state global ke state lokal profileUser
  useEffect(() => {
    if (user) {
      setProfileUser(user);
      setImgUrl(user.avatar);
    }
  }, [user]);

  //set url profile user
  useEffect(() => {
    if (!imgUrl) {
      setImgUrl(
        "https://www.jewishinteractive.org/wp-content/uploads/2016/03/person.png"
      );
    }
  }, [profileUser]);
  //===========ini akhir bagian edit profile user========

  //======== ini awal bagian shipping address============
  //ini state menampung list address
  const [localListAddress, setLocalListAddress] = useState([]);

  //fetch data address user dari api
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getListAddressUser());
    }
  }, [dispatch]);

  //useEffect menampung list address ke state lokal
  useEffect(() => {
    if (listAddressUser) {
      setLocalListAddress(listAddressUser);
    }
  }, [listAddressUser]);

  //insert address pake form validasi
  const formik = useFormik({
    initialValues: {
      saveAs: "",
      recipientName: "",
      recipientPhone: "",
      postalCode: "",
      city: "",
      address: "",
      isPrimary: false,
    },
    validationSchema: Yup.object({
      saveAs: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(25, "Maximum 15 characters")
        .required("Required!"),
      recipientName: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(15, "Maximum 15 characters")
        .required("Required!"),
      recipientPhone: Yup.string().required("Required!"),
      postalCode: Yup.string()
        .min(6, "Mininum 6 characters")
        .max(6, "Maximum 6 characters")
        .required("Required!"),
      city: Yup.string()
        .min(2, "Mininum 2 characters")

        .required("Required!"),
      address: Yup.string().required("Required!"),
    }),
    onSubmit: (values) => {
      setState({ ...state, toggleModal: false });
      setIsLoadingProcess(true);

      dispatch(insertAddressUser(values))
        .then((res) => {
          setIsLoadingProcess(false);
          setLocalListAddress([]);
          Swal.fire("Success", res.data.message, "success");
        })
        .catch((err) => {
          setIsLoadingProcess(false);

          Swal.fire("Something Error!", err.response.data.message, "error");
        });
    },
  });

  //akhir dari shiipping address

  //kalau loading
  if (isLoadingProcess === true) {
    Swal.fire({
      icon: "info",
      title: "Loading!",
      text: "Please wait",
      showConfirmButton: false,
    });
  }

  //awal history order
  const [localHistoryOrder, setLocalHistoryOrder] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    setLoadingHistory(true);
    if (localStorage.getItem("token")) {
      dispatch(getHistoryOrderUser(state.myOrder.orderStatus))
        .then((res) => {
          setLoadingHistory(false);
          setLocalHistoryOrder(res.data.data);
        })
        .catch((err) => {
          setLoadingHistory(false);

          setLocalHistoryOrder([]);
        });
    }
  }, [state.myOrder.orderStatus]);

  return (
    <div
      style={{ paddingTop: "10rem", background: "#F5F5F5", minHeight: "100vh" }}
    >
      <div className="hide-sm show-lg">
        <div
          className="d-flex justify-content-end px-4 bg-white"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "450px",
            height: "100vh",
            paddingTop: "10rem",
          }}
        >
          <div className="me-5">
            <div className="d-flex mb-5">
              <div
                className="rounded-circle me-3 overflow-hidden"
                style={{ width: "60px", height: "60px" }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src="https://www.jewishinteractive.org/wp-content/uploads/2016/03/person.png"
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="align-self-center">
                {profileUser.name ? (
                  <p className="fw-bold m-0 mb-1">{user.name}</p>
                ) : (
                  <p className="fw-bold m-0 mb-1">username</p>
                )}

                <button
                  className={`d-flex bg-transparent border-0 `}
                  onClick={(e) => setProfileIsDisabled(!profileIsDisable)}
                >
                  <span
                    className={`material-icons  me-2 ${
                      profileIsDisable ? "color-gray" : "text-danger"
                    }`}
                    style={{ fontSize: "20px" }}
                  >
                    mode_edit
                  </span>
                  <p
                    className={`m-0 my-auto ${
                      profileIsDisable ? "color-gray" : "text-danger"
                    }`}
                  >
                    Ubah Profil
                  </p>
                </button>
              </div>
            </div>
            <div className="d-flex mb-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#456BF3" }}
              >
                person_outline
              </span>
              <button
                className={
                  myAcount == true
                    ? "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0 text-danger"
                    : "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                }
                onClick={() => {
                  setState({
                    ...state,
                    linkSideBar: {
                      ...state.linkSideBar,
                      myAcount: true,
                      shippingAddress: false,
                      myOrder: false,
                    },
                  });
                  dispatch({ type: "MYACOUNT" });
                }}
              >
                My Account
              </button>
            </div>
            <div className="d-flex mb-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#F36F45" }}
              >
                location_on
              </span>
              <button
                className={
                  shippingAddress == true
                    ? "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0 text-danger"
                    : "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                }
                onClick={() => {
                  setState({
                    ...state,
                    linkSideBar: {
                      ...state.linkSideBar,
                      shippingAddress: true,
                      myAcount: false,
                      myOrder: false,
                    },
                  });
                  dispatch({ type: "SHIPPING_ADDRESS" });
                }}
              >
                Shipping Adrress
              </button>
            </div>
            <div className="d-flex mb-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#F3456F" }}
              >
                mode_edit
              </span>
              <button
                className={
                  myOrder == true
                    ? "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0 text-danger"
                    : "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                }
                onClick={() => {
                  setState({
                    ...state,
                    linkSideBar: {
                      ...state.linkSideBar,
                      myOrder: true,
                      shippingAddress: false,
                      myAcount: false,
                    },
                  });
                  dispatch({ type: "MYORDER" });
                }}
              >
                My order
              </button>
            </div>
            <div className="d-flex mb-4">
              <span className="material-icons text-white rounded-circle p-2 me-3 bg-warning">
                logout
              </span>
              <button
                className={
                  "m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                }
                onClick={() => {
                  router.push("/auth/login");
                  localStorage.removeItem("token");
                  dispatch({ type: "LOGOUT" });
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {/* component user profil */}
          <div
            className={myAcount == true ? "col-12 col-lg-8 ms-auto" : "hide"}
          >
            {loading ? (
              <div
                className="d-flex flex-column align-items-center justify-content-center bg-white p-4 border rounded "
                style={{ minHeight: "550px" }}
              >
                <div className="spinner-grow text-danger mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="fw-bold">Wait a moment...</h3>
              </div>
            ) : (
              <div
                className="bg-white p-4 border rounded"
                style={{ minHeight: "550px" }}
              >
                <h4 className="fw-bold">My Profile</h4>
                <p className="color-gray m-0 pb-3 border-bottom">
                  Manage your profile information
                </p>

                <div className="row mt-3">
                  <div className="d-md-block d-lg-none col-12 col-md-12 my-auto">
                    <div
                      className="rounded-circle overflow-hidden mx-auto"
                      style={{ width: "100px", height: "100px" }}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          width={100}
                          height={100}
                          style={{ objectFit: "cover" }}
                          layout="responsive"
                        />
                      ) : (
                        <img
                          src={
                            "https://www.jewishinteractive.org/wp-content/uploads/2016/03/person.png"
                          }
                          width={100}
                          height={100}
                          style={{ objectFit: "cover" }}
                          layout="responsive"
                        />
                      )}
                    </div>
                    <div className="d-flex justify-content-center mt-3 mb-2">
                      <button
                        className={`d-flex bg-transparent border-0 `}
                        onClick={(e) => setProfileIsDisabled(!profileIsDisable)}
                      >
                        <span
                          className={`material-icons  me-2 ${
                            profileIsDisable ? "color-gray" : "text-danger"
                          }`}
                          style={{ fontSize: "20px" }}
                        >
                          mode_edit
                        </span>
                        <p
                          className={`m-0 my-auto ${
                            profileIsDisable ? "color-gray" : "text-danger"
                          }`}
                        >
                          Ubah Profil
                        </p>
                      </button>
                    </div>
                    <div className="d-flex justify-content-center ">
                      <button
                        className={` rounded-pill py-2 px-5  overflow-hidden position-relative my-4 ${
                          profileIsDisable
                            ? " bg-secondary text-white  "
                            : "bg-transparent border-danger text-danger"
                        }`}
                        disabled={profileIsDisable}
                      >
                        Select Image
                        <input
                          type="file"
                          accept="image/*"
                          className="position-absolute"
                          style={{
                            left: "-100px",
                            top: 5,
                            opacity: 0,
                            cursor: "pointer",
                          }}
                          disabled={profileIsDisable}
                          onChange={handleChangeImage}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-7">
                    <div className="w-100 d-flex justify-content-end mb-3">
                      <label htmlFor="input" className="me-4 my-auto">
                        Name
                      </label>
                      {profileUser.name ? (
                        <input
                          type="text"
                          placeholder="write your name..."
                          className="p-2 border rounded"
                          style={{ outline: "none", width: "70%" }}
                          value={profileUser.name}
                          name="name"
                          onChange={handleChangeDataProfile}
                          disabled={profileIsDisable}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="write your name..."
                          className="p-2 border rounded"
                          style={{ outline: "none", width: "70%" }}
                          name="name"
                          onChange={handleChangeDataProfile}
                          disabled={profileIsDisable}
                        />
                      )}
                    </div>

                    <div className="w-100 d-flex justify-content-end mb-3">
                      <label htmlFor="input" className="me-4 my-auto">
                        Email
                      </label>
                      {profileUser.email ? (
                        <input
                          type="text"
                          value={profileUser.email}
                          name="email"
                          placeholder="write your Email..."
                          className="p-2 border rounded"
                          style={{ outline: "none", width: "70%" }}
                          onChange={handleChangeDataProfile}
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          name="email"
                          placeholder="write your Email..."
                          className="p-2 border rounded"
                          style={{ outline: "none", width: "70%" }}
                          disabled
                        />
                      )}
                    </div>

                    <div className="w-100 d-flex justify-content-end mb-3">
                      <label htmlFor="input" className="me-4 my-auto">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={profileUser.phone || ""}
                        placeholder="write your phone number..."
                        className="p-2 border rounded"
                        style={{ outline: "none", width: "70%" }}
                        onChange={handleChangeDataProfile}
                        disabled={profileIsDisable}
                      />
                    </div>

                    {profileUser.gender && (
                      <div className="w-100 d-flex justify-content-end mb-3">
                        <p className="me-4 my-auto m-0">Gender</p>
                        <div
                          className="d-flex justify-content-start"
                          style={{ outline: "none", width: "70%" }}
                        >
                          <div className="d-flex me-4">
                            <input
                              type="radio"
                              id="male"
                              name="gender"
                              className="p-2 border rounded me-3 align-self-center"
                              value="male"
                              checked={
                                profileUser.gender === "male" ? true : false
                              }
                              onChange={handleChangeDataProfile}
                              disabled={profileIsDisable}
                            />
                            <label
                              htmlFor="male"
                              className={`my-auto ${
                                profileIsDisable && "text-muted"
                              }`}
                            >
                              Laki-laki
                            </label>
                          </div>
                          <div className="d-flex">
                            <input
                              type="radio"
                              id="female"
                              name="gender"
                              className="p-2 border rounded me-3 align-self-center color-danger"
                              value="female"
                              checked={
                                profileUser.gender === "female" ? true : false
                              }
                              onChange={handleChangeDataProfile}
                              disabled={profileIsDisable}
                            />
                            <label
                              htmlFor="female"
                              className={`my-auto ${
                                profileIsDisable && "text-muted"
                              }`}
                            >
                              Perempuan
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="w-100 d-flex justify-content-end mb-4">
                      <label htmlFor="input" className="me-4 my-auto">
                        Date of Birth
                      </label>

                      <input
                        type="date"
                        placeholder="write your name..."
                        name="birthday"
                        value={profileUser.birthday || "1990-01-01"}
                        className="p-2 border rounded form-control"
                        style={{ outline: "none", width: "70%" }}
                        onChange={handleChangeDataProfile}
                        disabled={profileIsDisable}
                      />
                    </div>

                    <div className="w-100 d-flex justify-content-center mb-3">
                      <div className="d-flex  justify-content-center">
                        <button
                          className={` text-white border-0 rounded-pill px-5 py-2 mx-3 ${
                            profileIsDisable ? "btn-secondary" : "btn-danger"
                          }`}
                          disabled={profileIsDisable}
                          onClick={handleSubmitChangeProfile}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-5 d-none d-lg-block my-auto">
                    <div
                      className="rounded-circle overflow-hidden mx-auto"
                      style={{ width: "100px", height: "100px" }}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          width={100}
                          height={100}
                          style={{ objectFit: "cover" }}
                          layout="responsive"
                        />
                      ) : (
                        <img
                          src={
                            "https://www.jewishinteractive.org/wp-content/uploads/2016/03/person.png"
                          }
                          width={100}
                          height={100}
                          style={{ objectFit: "cover" }}
                          layout="responsive"
                        />
                      )}
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        className={` rounded-pill py-2 px-5  overflow-hidden position-relative my-4 ${
                          profileIsDisable
                            ? " bg-secondary text-white  "
                            : "bg-transparent border-danger text-danger"
                        }`}
                        disabled={profileIsDisable}
                      >
                        Select Image
                        <input
                          type="file"
                          accept="image/*"
                          className="position-absolute"
                          style={{
                            left: "-100px",
                            top: 5,
                            opacity: 0,
                            cursor: "pointer",
                          }}
                          disabled={profileIsDisable}
                          onChange={handleChangeImage}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* shipping address */}
          <div
            className={
              shippingAddress == true ? "col-12 col-lg-8 ms-auto" : "hide"
            }
          >
            <div
              className="bg-white p-4 border rounded"
              style={{ minHeight: "550px" }}
            >
              <h4 className="fw-bold">Choose another address</h4>
              <p className="color-gray m-0 pb-3 border-bottom">
                Manage your shipping address
              </p>
              <div className="px-4 py3">
                <button
                  className="color-gray w-100 py-4 bg-transparent rounded my-4"
                  style={{ border: "3px dashed #9B9B9B" }}
                  onClick={() => {
                    setState({ ...state, toggleModal: true });
                  }}
                >
                  {localListAddress.length === 0
                    ? "Add your address before shopping"
                    : "Add new address"}
                </button>
                <div
                  style={{
                    paddingRight: "10px",
                    height: "600px",
                    overflowY: "auto",
                  }}
                >
                  {localListAddress.map((data, idx) => {
                    return (
                      <ListUserAddress
                        item={data}
                        fireEvents={setLocalListAddress}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={myOrder == true ? "col-12 col-lg-8 ms-auto" : "hide"}>
            <div
              className="bg-white p-4 border rounded"
              style={{ minHeight: "550px" }}
            >
              <h4 className="fw-bold">My order</h4>
              <div className="d-flex my-4 w-100 overflow-auto">
                <button
                  className={
                    state.myOrder.allItem == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myOrder: {
                        ...state.myOrder,
                        allItem: true,
                        pending: false,
                        package: false,
                        send: false,
                        completed: false,
                        orderCancel: false,
                        orderStatus: "",
                      },
                    });
                  }}
                >
                  All Items
                </button>
                <button
                  className={
                    state.myOrder.pending == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myOrder: {
                        ...state.myOrder,
                        allItem: false,
                        pending: true,
                        package: false,
                        send: false,
                        completed: false,
                        orderCancel: false,
                        orderStatus: "pending",
                      },
                    });
                  }}
                >
                  Pending
                </button>
                <button
                  className={
                    state.myOrder.package == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myOrder: {
                        ...state.myOrder,
                        allItem: false,
                        pending: false,
                        package: true,
                        send: false,
                        completed: false,
                        orderCancel: false,
                        orderStatus: "process",
                      },
                    });
                  }}
                >
                  Packed
                </button>
                <button
                  className={
                    state.myOrder.send == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myOrder: {
                        ...state.myOrder,
                        allItem: false,
                        pending: false,
                        package: false,
                        send: true,
                        completed: false,
                        orderCancel: false,
                        orderStatus: "sending",
                      },
                    });
                  }}
                >
                  Sent
                </button>
                <button
                  className={
                    state.myOrder.completed == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myOrder: {
                        ...state.myOrder,
                        allItem: false,
                        pending: false,
                        package: false,
                        send: false,
                        completed: true,
                        orderCancel: false,
                        orderStatus: "completed",
                      },
                    });
                  }}
                >
                  Completed
                </button>
                <button
                  className={
                    state.myOrder.orderCancel == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myOrder: {
                        ...state.myOrder,
                        allItem: false,
                        pending: false,
                        package: false,
                        send: false,
                        completed: false,
                        orderCancel: true,
                        orderStatus: "cancelled",
                      },
                    });
                  }}
                >
                  Order Cancel
                </button>
              </div>
              <div className="w-100 h-100" style={{ minHeight: "550px" }}>
                {/* disini looping history */}
                {loadingHistory ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center bg-white p-4 border-0 rounded "
                    style={{ minHeight: "500px" }}
                  >
                    <div
                      className="spinner-grow text-danger mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h3 className="fw-bold">Wait a moment...</h3>
                  </div>
                ) : localHistoryOrder.length < 1 ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center bg-white p-4 border-0 rounded "
                    style={{ minHeight: "500px" }}
                  >
                    <h3 className="fw-bold">Data not found...</h3>
                  </div>
                ) : (
                  <div
                    className=" bg-white  border-0 rounded"
                    style={{
                      height: "510px",

                      overflowY: "auto",
                    }}
                  >
                    {localHistoryOrder.map((data, idx) => {
                      return (
                        <div
                          className="p-3 border border-danger my-2 rounded w-100"
                          key={idx}
                        >
                          <h5 className="fw-bold">
                            Id Transactions: {data.id}
                          </h5>
                          <p>
                            <span>Product Name : {data.nameProduct}</span>
                            <br /> <span>Quantity : {data.quantity}</span>
                            <br />
                            <span>
                              Total Payment : {toRupiah(data.totalPayment)}
                            </span>
                            <br />{" "}
                            <span>Virtual Account : {data.vaNumber}</span>
                            <br /> <span>Status : {data.status}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={state.toggleModal}
        className="modalPositionAndSizeConfig2"
        overlayClassName="modalOverLayConfig"
        closeTimeoutMS={400}
        ariaHideApp={false}
        style={{ maxHeight: "60px" }}
      >
        <div className="w-100 d-flex mb-4 ">
          <span
            className="material-icons ms-auto hover-danger c-pointer"
            onClick={() => {
              setState({ ...state, toggleModal: false });
            }}
          >
            close
          </span>
        </div>
        <div>
          <h3 className="fw-bold text-center mb-4">Add new address</h3>
          <div className="my-2">
            <label className="color-gray">
              Save address as (ex : home address, office address)
            </label>
            <input
              type="text"
              className="w-100 border p-2"
              style={{ outline: "nonde" }}
              name="saveAs"
              value={formik.values.saveAs}
              onChange={formik.handleChange}
            />
            {formik.errors.saveAs && formik.touched.saveAs && (
              <p className="text-danger">{formik.errors.saveAs}</p>
            )}
          </div>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-6  my-2">
              <label htmlFor="name" className="color-gray mb-2">
                Recipient’s name
              </label>
              <input
                type="text"
                className="p-2 border rounded w-100"
                style={{ outline: "nonde" }}
                name="recipientName"
                value={formik.values.recipientName}
                onChange={formik.handleChange}
              />
              {formik.errors.recipientName && formik.touched.recipientName && (
                <p className="text-danger">{formik.errors.recipientName}</p>
              )}
            </div>
            <div className="col-12 col-md-12 col-lg-6  my-2">
              <label htmlFor="name" className="color-gray mb-2">
                Recipient's telephone number
              </label>
              <input
                type="text"
                className="p-2 border rounded w-100"
                style={{ outline: "nonde" }}
                name="recipientPhone"
                value={formik.values.recipientPhone}
                onChange={formik.handleChange}
              />
              {formik.errors.recipientPhone &&
                formik.touched.recipientPhone && (
                  <p className="text-danger">{formik.errors.recipientPhone}</p>
                )}
            </div>
            <div className="col-12 col-md-12 col-lg-6  my-2">
              <label htmlFor="name" className="color-gray mb-2">
                Address
              </label>
              <input
                type="text"
                className="p-2 border col-lg-6 rounded w-100"
                style={{ outline: "nonde" }}
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              {formik.errors.address && formik.touched.address && (
                <p className="text-danger">{formik.errors.address}</p>
              )}
            </div>
            <div className="col-12 col-md-12 col-lg-6 my-2">
              <label htmlFor="name" className="color-gray mb-2">
                Postal code
              </label>
              <input
                type="text"
                className="p-2 border rounded w-100"
                style={{ outline: "nonde" }}
                name="postalCode"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
              />
              {formik.errors.postalCode && formik.touched.postalCode && (
                <p className="text-danger">{formik.errors.postalCode}</p>
              )}
            </div>
            <div className="col-12 col-md-12 my-2">
              <label htmlFor="name" className="color-gray mb-2">
                City or Subdistrict
              </label>
              <input
                type="text"
                className="p-2 border rounded w-100"
                style={{ outline: "nonde" }}
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
              {formik.errors.city && formik.touched.city && (
                <p className="text-danger">{formik.errors.city}</p>
              )}
            </div>
            <div className="col-12 my-2">
              <input
                type="checkbox"
                className="me-2"
                name="isPrimary"
                value={formik.values.isPrimary}
                onChange={formik.handleChange}
              />
              <label htmlFor="name" className="color-gray">
                Make it the primary address
              </label>
            </div>
            <div className="col-12 my-2">
              <div className="d-flex justify-content-end">
                <div>
                  <button
                    className="btn-danger text-white border-0 rounded-pill px-5 py-2 me-3"
                    type="submit"
                    onClick={formik.handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="border-danger rounded-pill py-2 px-5 bg-transparent text-danger overflow-hidden"
                    onClick={() => {
                      setState({ ...state, toggleModal: false });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <style jsx>
        {`
          .link-Side-bar:ho {
          }
          .btn-save {
            width: 70%;
          }
          @media (max-width: 576px) {
            .modalPositionAndSizeConfig2 {
              min-height: 80vh;
              overflow-y: auto !important;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              min-width: 90vw;
              max-width: 800px !important;
              padding: 3rem 2rem;
              border-radius: 1rem;
              background: white;
            }
          }

          @media (min-width: 576px) {
            .modalPositionAndSizeConfig2 {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              max-width: 800px;
              padding: 3rem 2rem;
              border-radius: 1rem;
              background: white;
            }
          }
          @media (max-width: 768px) {
            .btn-save {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default withAuth(Profile);
