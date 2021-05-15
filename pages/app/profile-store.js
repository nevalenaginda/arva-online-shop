import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { requestUpdateProfile } from "../../src/config/redux/actions/seller";
import swal from "sweetalert";
import axiosApiInstance from "../../src/helper/axios";
import { AddProductSeller, OrderSeller } from "../../src/component/module";
import Withauth from "../../src/helper/authNext";
import { getProfile } from "../../src/config/redux/actions/users";
import { useRouter } from "next/router";
const profil_store = () => {
  const router = useRouter();
  const Url = process.env.api;
  const profileRef = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { profilStore } = useSelector((state) => state.Helpers);
  const [state, setState] = useState({
    toggleModal: false,
    linkSideBar: {
      store: {
        storeProfile: true,
      },
      product: {
        MyProducts: false,
        settingProducts: false,
      },
      order: false,
    },
    myProduct: {
      allItem: true,
      soldOut: false,
      archived: false,
      loading: false,
    },
    youWantToEdit: false,
    dataImg: "",
    dataProduct: {
      allItem: [],
      allItemBackup: [],
      soldOut: [],
      archived: [],
    },
    isSortedByProductName: true,
    isSortedByPrice: false,
    isSortedByStock: false,
  });
  const [dataProfil, setDataProfil] = useState({
    storeName: "loading...",
    name: "loading...",
    email: "loading...",
    phoneNumber: "0",
    storeDesc: "loading...",
    avatar: "",
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  useEffect(() => {
    if (user.role !== "seller") {
      router.push("/app/profile");
    }
    setDataProfil({
      storeName: user.nameStore,
      name: user.name,
      email: user.email,
      phoneNumber: user.phone,
      storeDesc: user.descriptionStore,
      avatar: user.avatar,
    });
  }, [user]);
  useEffect(() => {
    setState({ ...state, myProduct: { ...state.myProduct, loading: true } });
    axiosApiInstance
      .get(`${Url}/v1/product/product`)
      .then((res) => {
        setState({
          ...state,
          dataProduct: {
            ...state.dataProduct,
            allItem: res.data.data,
            allItemBackup: res.data.data,
          },
          myProduct: { ...state.myProduct, loading: false },
        });
      })
      .catch((err) => {});
  }, []);
  const openSoldOut = () => {
    if (state.dataProduct.soldOut.length === 0) {
      axiosApiInstance
        .get(`${Url}/v1/product/product?soldout=.`)
        .then((res) => {
          setState({
            ...state,
            dataProduct: { ...state.dataProduct, soldOut: res.data.data },
          });
        })
        .catch((err) => {});
    }
  };
  const openArchived = () => {
    if (state.dataProduct.archived.length === 0) {
      axiosApiInstance
        .get(`${Url}/v1/product/product?archived=.`)
        .then((res) => {
          setState({
            ...state,
            dataProduct: { ...state.dataProduct, archived: res.data.data },
          });
        })
        .catch((err) => {});
    }
  };
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (
          event.target.files[0].type === "image/png" ||
          event.target.files[0].type === "image/jpg" ||
          event.target.files[0].type === "image/jpeg"
        ) {
          setState({ ...state, dataImg: event.target.files[0] });
          setDataProfil({ ...dataProfil, avatar: e.target.result });
        } else {
          swal("Oops", "hanya mendukung format gambar", "error");
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const upadateProfil = () => {
    const data = {
      name: dataProfil.name,
      nameStore: dataProfil.storeName,
      phone: dataProfil.phoneNumber,
      descriptionStore: dataProfil.storeDesc,
    };
    const form = new FormData();
    form.append("nameStore", dataProfil.storeName);
    form.append("name", dataProfil.name);
    // form.append("email", dataProfil.email);
    form.append("phone", dataProfil.phoneNumber);
    form.append("descriptionStore", dataProfil.storeDesc);
    form.append("avatar", state.dataImg);
    if (dataProfil.avatar === user.avatar) {
      setLoadingUpdate(true);
      dispatch(requestUpdateProfile(data))
        .then((res) => {
          dispatch(getProfile());
          swal("success", res, "success");
          setLoadingUpdate(false);
        })
        .catch((err) => {
          swal("Oops", err, "error");
          setLoadingUpdate(false);
        });
    } else {
      setLoadingUpdate(true);
      dispatch(requestUpdateProfile(form))
        .then((res) => {
          setLoadingUpdate(false);
          dispatch(getProfile());
          swal("success", res, "success");
        })
        .catch((err) => {
          setLoadingUpdate(false);
          swal("Oops", err, "error");
        });
    }
  };
  const searchProductSeller = (e) => {
    let re = new RegExp(e.target.value);
    let result = state.dataProduct.allItemBackup.filter((item) => {
      if (item.name.match(re) !== null) {
        return item;
      }
    });
    setState({
      ...state,
      dataProduct: { ...state.dataProduct, allItem: result },
    });
  };
  const sortByNameProduct = () => {
    if (state.isSortedByProductName) {
      const result = state.dataProduct.allItem.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        let comparison = 0;
        if (nameA < nameB) {
          comparison = 1;
        } else if (nameA > nameB) {
          comparison = -1;
        }
        return comparison;
      });
      setState({
        ...state,
        dataProduct: { ...state.dataProduct, allItem: result },
        isSortedByProductName: false,
      });
    } else {
      const result = state.dataProduct.allItem.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        let comparison = 0;
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        }
        return comparison;
      });
      setState({
        ...state,
        dataProduct: { ...state.dataProduct, allItem: result },
        isSortedByProductName: true,
      });
    }
  };
  const sortByPrice = () => {
    if (state.isSortedByPrice) {
      const result = state.dataProduct.allItem.sort((a, b) => {
        const priceA = a.price;
        const priceB = b.price;
        let comparison = 0;
        if (priceA < priceB) {
          comparison = 1;
        } else if (priceA > priceB) {
          comparison = -1;
        }
        return comparison;
      });
      setState({
        ...state,
        dataProduct: { ...state.dataProduct, allItem: result },
        isSortedByPrice: false,
      });
    } else {
      const result = state.dataProduct.allItem.sort((a, b) => {
        const priceA = a.price;
        const priceB = b.price;
        let comparison = 0;
        if (priceA > priceB) {
          comparison = 1;
        } else if (priceA < priceB) {
          comparison = -1;
        }
        return comparison;
      });
      setState({
        ...state,
        dataProduct: { ...state.dataProduct, allItem: result },
        isSortedByPrice: true,
      });
    }
  };
  const sortByStock = () => {
    if (state.isSortedByStock) {
      const result = state.dataProduct.allItem.sort((a, b) => {
        const stockA = a.stock;
        const stockB = b.stock;
        let comparison = 0;
        if (stockA < stockB) {
          comparison = 1;
        } else if (stockA > stockB) {
          comparison = -1;
        }
        return comparison;
      });
      setState({
        ...state,
        dataProduct: { ...state.dataProduct, allItem: result },
        isSortedByStock: false,
      });
    } else {
      const result = state.dataProduct.allItem.sort((a, b) => {
        const stockA = a.stock;
        const stockB = b.stock;
        let comparison = 0;
        if (stockA > stockB) {
          comparison = 1;
        } else if (stockA < stockB) {
          comparison = -1;
        }
        return comparison;
      });
      setState({
        ...state,
        dataProduct: { ...state.dataProduct, allItem: result },
        isSortedByStock: true,
      });
    }
  };
  return (
    <div
      style={{ background: "#F5F5F5", minHeight: "100vh", paddingTop: "10rem" }}
    >
      <div className="container">
        <div className="row">
          {/* my product */}
          <div
            className={
              profilStore.product == true ? "col-12 col-lg-8 ms-auto" : "hide"
            }
          >
            <div
              className="bg-white p-4 border rounded"
              style={{ minHeight: "550px" }}
            >
              <h4 className="fw-bold">My Product</h4>
              <div className="d-flex my-4">
                <button
                  className={
                    state.myProduct.allItem == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myProduct: {
                        allItem: true,
                        soldOut: false,
                        archived: false,
                      },
                    });
                  }}
                >
                  All items
                </button>
                <button
                  className={
                    state.myProduct.soldOut == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myProduct: {
                        allItem: false,
                        soldOut: true,
                        archived: false,
                      },
                    });
                    openSoldOut();
                  }}
                >
                  Sould out
                </button>
                <button
                  className={
                    state.myProduct.archived == true
                      ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                      : "bg-transparent me-4 hover-danger border-0 fw-bold"
                  }
                  onClick={() => {
                    setState({
                      ...state,
                      myProduct: {
                        allItem: false,
                        soldOut: false,
                        archived: true,
                      },
                    });
                    openArchived();
                  }}
                >
                  Archived
                </button>
              </div>
              <div
                className="d-flex rounded-pill border p-2 mb-4"
                style={{ width: "300px" }}
              >
                <span className="material-icons color-gray me-2">search</span>
                <input
                  type="text"
                  className="border-0 w-100 my-auto"
                  style={{ outline: "none" }}
                  placeholder="search..."
                  onChange={searchProductSeller}
                  disabled={state.myProduct.allItem === true ? false : true}
                />
              </div>
              <div className="w-100 border mb-5">
                <div
                  className="w-100 d-flex justify-content-between"
                  style={{ background: "#F6F6F6" }}
                >
                  <div
                    className="c-pointer px-4 py-3 d-flex h-100 hover-bg-gray"
                    onClick={sortByNameProduct}
                  >
                    <p className="m-0 me-3">Product name</p>
                    <span className="material-icons">sort</span>
                  </div>
                  <div className="d-flex">
                    <div
                      className="c-pointer px-4 py-3 d-flex h-100 hover-bg-gray"
                      onClick={sortByPrice}
                    >
                      <p className="m-0 me-3">Price</p>
                      <span className="material-icons">sort</span>
                    </div>
                    <div
                      className="c-pointer px-4 py-3 d-flex h-100 hover-bg-gray"
                      onClick={sortByStock}
                    >
                      <p className="m-0 me-3">Stock</p>
                      <span className="material-icons">sort</span>
                    </div>
                    <div
                      className={
                        state.myProduct.archived === true ? "hide" : "px-4 py-3"
                      }
                    >
                      <span>action</span>
                    </div>
                  </div>
                </div>
                {state.myProduct.loading ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center bg-white p-4 border rounded "
                    style={{ minHeight: "300px" }}
                  >
                    <div
                      className="spinner-grow text-danger mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h3 className="fw-bold">Wait a moment...</h3>
                  </div>
                ) : (
                  <div>
                    {/* all_item */}
                    <div
                      className={
                        state.myProduct.allItem === true
                          ? "w-100 justify-content-center overflow-auto"
                          : "hide"
                      }
                      style={{ maxHeight: "300px" }}
                    >
                      {state.dataProduct.allItem.map((item) => {
                        const price = item.price.toString();
                        const sisa = price.length % 3;
                        let rupiah = price.substr(0, sisa);
                        const ribuan = price.substr(sisa).match(/\d{3}/g);
                        if (ribuan) {
                          const separator = sisa ? "." : "";
                          rupiah += separator + ribuan.join(".");
                        }
                        return (
                          <div
                            className="d-flex  hover-bg-gray border-top  justify-content-between w-100"
                            style={{ background: "#F6F6F6" }}
                          >
                            <div
                              className="py-2 ps-4 my-auto"
                              style={{ width: "50%" }}
                            >
                              <span
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: "250px" }}
                              >
                                {item.name}
                              </span>
                            </div>
                            <div
                              className="d-flex pe-4"
                              style={{ width: "50%" }}
                            >
                              <p className="py-2 m-0 ms-auto my-auto px-4">
                                Rp. {rupiah}
                              </p>
                              <p className="py-2 m-0 ms-auto my-auto px-4">
                                {item.stock}
                              </p>
                              <div className="my-auto">
                                <button
                                  className="border-danger text-danger rounded-pill px-2 bg-transparent"
                                  onClick={() => {
                                    swal({
                                      title: "anda yakin?",
                                      text: "data akan dihapus!!!",
                                      icon: "warning",
                                      dangerMode: true,
                                    }).then((willDelete) => {
                                      if (willDelete) {
                                        axiosApiInstance
                                          .delete(
                                            `${Url}/v1/product?id=${item.id}`
                                          )
                                          .then((err) => {
                                            axiosApiInstance
                                              .get(`${Url}/v1/product/product`)
                                              .then((res) => {
                                                setState({
                                                  ...state,
                                                  dataProduct: {
                                                    ...state.dataProduct,
                                                    allItem: res.data.data,
                                                    allItemBackup:
                                                      res.data.data,
                                                  },
                                                });
                                              })
                                              .catch((err) => {});
                                          });
                                        swal(
                                          "Deleted!",
                                          "delete berhasil",
                                          "success"
                                        );
                                      }
                                    });
                                  }}
                                >
                                  delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div
                        className={
                          state.dataProduct.allItem.length === 0
                            ? "show"
                            : "hide"
                        }
                      >
                        <div
                          className="d-flex justify-content-center"
                          style={{ height: "300px" }}
                        >
                          <div
                            className="my-auto"
                            style={{ width: "224px", height: "177px" }}
                          >
                            <Image
                              src="/img/data_null.png"
                              width={224}
                              height={177}
                              layout="responsive"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                    {/* sold out */}
                    <div
                      className={
                        state.myProduct.soldOut === true
                          ? "w-100 justify-content-center overflow-auto"
                          : "hide"
                      }
                      style={{ maxHeight: "300px" }}
                    >
                      {state.dataProduct.soldOut.map((item) => {
                        const price = item.price.toString();
                        const sisa = price.length % 3;
                        let rupiah = price.substr(0, sisa);
                        const ribuan = price.substr(sisa).match(/\d{3}/g);
                        if (ribuan) {
                          const separator = sisa ? "." : "";
                          rupiah += separator + ribuan.join(".");
                        }
                        return (
                          <div
                            className="d-flex  hover-bg-gray border-top  justify-content-between w-100"
                            style={{ background: "#F6F6F6" }}
                          >
                            <div className="py-2 ps-4" style={{ width: "60%" }}>
                              <span
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {item.name}
                              </span>
                            </div>
                            <div
                              className="d-flex pe-4"
                              style={{ width: "40%" }}
                            >
                              <p className="py-2 m-0 ms-auto">Rp. {rupiah}</p>
                              <p className="py-2 m-0 ms-auto">{item.stock}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div
                        className="d-flex justify-content-center"
                        style={{ height: "300px" }}
                      >
                        <div
                          className={
                            state.dataProduct.soldOut.length === 0
                              ? "my-auto"
                              : "hide"
                          }
                          style={{ width: "224px", height: "177px" }}
                        >
                          <Image
                            src="/img/data_null.png"
                            width={224}
                            height={177}
                            layout="responsive"
                          />
                        </div>
                      </div>
                    </div>
                    {/*  */}
                    {/* archived */}
                    <div
                      className={
                        state.myProduct.archived === true
                          ? "w-100 justify-content-center overflow-auto"
                          : "hide"
                      }
                      style={{ maxHeight: "300px" }}
                    >
                      {state.dataProduct.allItem.map((item) => {
                        const price = item.price.toString();
                        const sisa = price.length % 3;
                        let rupiah = price.substr(0, sisa);
                        const ribuan = price.substr(sisa).match(/\d{3}/g);
                        if (ribuan) {
                          const separator = sisa ? "." : "";
                          rupiah += separator + ribuan.join(".");
                        }
                        if (item.isArchive === true) {
                          return (
                            <div
                              className="d-flex  hover-bg-gray border-top  justify-content-between w-100"
                              style={{ background: "#F6F6F6" }}
                            >
                              <div
                                className="py-2 ps-4"
                                style={{ width: "60%" }}
                              >
                                <span
                                  className="d-inline-block text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {item.name}
                                </span>
                              </div>
                              <div
                                className="d-flex pe-4"
                                style={{ width: "40%" }}
                              >
                                <p className="py-2 m-0 ms-auto">Rp. {rupiah}</p>
                                <p className="py-2 m-0 ms-auto">{item.stock}</p>
                              </div>
                            </div>
                          );
                        }
                      })}
                      <div
                        className="d-flex justify-content-center"
                        style={{ height: "300px" }}
                      >
                        <div
                          className={
                            state.dataProduct.archived.length === 0
                              ? "my-auto"
                              : "hide"
                          }
                          style={{ width: "224px", height: "177px" }}
                        >
                          <Image
                            src="/img/data_null.png"
                            width={224}
                            height={177}
                            layout="responsive"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* my profil */}
          <div
            className={
              profilStore.store == true ? "col-12 col-lg-8 ms-auto" : "hide"
            }
          >
            <div
              className="bg-white p-4 border rounded"
              style={{ minHeight: "550px" }}
            >
              <h4 className="fw-bold">My Profile Store</h4>
              <p className="color-gray m-0 pb-3 border-bottom">
                Manage your profile information
              </p>
              <div className="d-flex flex-column-reverse flex-lg-row w-100 mt-3">
                <div className="w-100-sm w-60-lg">
                  {/* check box */}
                  <div className="w-100 d-flex mb-5">
                    <input
                      type="checkbox"
                      className="me-3 my-auto"
                      onClick={(e) => {
                        setState({ ...state, youWantToEdit: e.target.checked });
                      }}
                    />
                    <label htmlFor="input" className="my-auto" ref={profileRef}>
                      You Want To Edit ?
                    </label>
                  </div>
                  {/* ---- */}
                  <div className="w-100 d-flex mb-3">
                    <div style={{ width: "30%" }}>
                      <label htmlFor="input" className="my-auto">
                        Store Name
                      </label>
                    </div>
                    <div className="ms-3" style={{ width: "70%" }}>
                      <input
                        disabled={state.youWantToEdit === true ? false : true}
                        type="text"
                        placeholder="write your name..."
                        className="p-2 border rounded w-100"
                        style={{ outline: "none" }}
                        value={dataProfil.storeName}
                        onChange={(e) => {
                          setDataProfil({
                            ...dataProfil,
                            storeName: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex mb-3">
                    <div style={{ width: "30%" }}>
                      <label htmlFor="input" className="my-auto">
                        Name Account
                      </label>
                    </div>
                    <div className="ms-3" style={{ width: "70%" }}>
                      <input
                        disabled={state.youWantToEdit === true ? false : true}
                        type="text"
                        placeholder="write your Email..."
                        className="p-2 border rounded w-100"
                        style={{ outline: "none" }}
                        value={dataProfil.name}
                        onChange={(e) => {
                          setDataProfil({
                            ...dataProfil,
                            name: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex mb-3">
                    <div style={{ width: "30%" }}>
                      <label htmlFor="input" className="my-auto">
                        Email
                      </label>
                    </div>
                    <div className="ms-3" style={{ width: "70%" }}>
                      <input
                        disabled={state.youWantToEdit === true ? false : true}
                        type="text"
                        placeholder="write your Email..."
                        className="p-2 border rounded w-100"
                        style={{ outline: "none" }}
                        value={dataProfil.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex mb-3">
                    <div style={{ width: "30%" }}>
                      <label htmlFor="input" className="my-auto">
                        Phone Number
                      </label>
                    </div>
                    <div className="ms-3" style={{ width: "70%" }}>
                      <input
                        disabled={state.youWantToEdit === true ? false : true}
                        type="number"
                        placeholder="write your password..."
                        className="p-2 border rounded w-100"
                        style={{ outline: "none" }}
                        value={dataProfil.phoneNumber}
                        onChange={(e) => {
                          setDataProfil({
                            ...dataProfil,
                            phoneNumber: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex mb-3">
                    <div style={{ width: "30%" }}>
                      <label htmlFor="input" className="me-4">
                        Store Description
                      </label>
                    </div>
                    <div className="ms-3" style={{ width: "70%" }}>
                      <textarea
                        disabled={state.youWantToEdit === true ? false : true}
                        rows={5}
                        className="p-2 border w-100"
                        style={{ outline: "none" }}
                        value={dataProfil.storeDesc}
                        onChange={(e) => {
                          setDataProfil({
                            ...dataProfil,
                            storeDesc: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      state.youWantToEdit === true
                        ? "w-100 d-flex justify-content-end mb-3"
                        : "hide"
                    }
                  >
                    <div
                      className="d-flex justify-content-start"
                      style={{ width: "70%" }}
                    >
                      <button
                        className="bg-danger text-white border-0 rounded-pill px-5 py-2 me-3"
                        onClick={upadateProfil}
                      >
                        {loadingUpdate ? "...loading" : "save"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="my-5 my-lg-auto w-100-sm w-40-lg">
                  <div
                    className="rounded-circle overflow-hidden mx-auto d-flex justify-content-center"
                    style={{ width: "100px", height: "100px" }}
                  >
                    <img
                      src={dataProfil.avatar}
                      className="w-100 align-self-center"
                    />
                  </div>
                  <div
                    className={
                      state.youWantToEdit === true
                        ? "d-flex justify-content-center"
                        : "hide"
                    }
                  >
                    <button className="border-danger rounded-pill py-2 px-5 bg-transparent text-danger overflow-hidden position-relative my-4">
                      Select Image
                      <input
                        type="file"
                        className="position-absolute"
                        style={{
                          left: "-100px",
                          top: 5,
                          opacity: 0,
                          cursor: "pointer",
                        }}
                        onChange={onImageChange}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* inventory */}
          <div
            className={
              profilStore.sellingProduct == true
                ? "col-12 col-lg-8 ms-auto"
                : "hide"
            }
          >
            <AddProductSeller />
          </div>
          {/* my order */}
          <div
            className={
              profilStore.order == true ? "col-12 col-lg-8 ms-auto" : "hide"
            }
          >
            <OrderSeller />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withauth(profil_store);
