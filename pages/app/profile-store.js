import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { requestUpdateProfile } from "../../src/config/redux/actions/seller";
import swal from "sweetalert";
import axiosApiInstance from "../../src/helper/axios";
import withAuth from "../../src/helper/authNext";

const profil_store = () => {
  const Url = process.env.api;
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
    },
    myOrder: {
      allItem: true,
      noPaid: false,
      package: false,
      send: false,
      completed: false,
      orderCancel: false,
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
    createProduct: {
      name: "",
      price: "",
      stock: "",
      desc: "",
      img: "",
      thumbnail: "",
      condition: {
        baru: true,
        bekas: false,
      },
    },
  });
  const [dataOrder, setDataOrder] = useState({
    dataHistoryOrder: [],
  });
  const [dataProfil, setDataProfil] = useState({
    storeName: "loading...",
    email: "loading...",
    phoneNumber: "0",
    storeDesc: "loading...",
    avatar: "",
  });
  useEffect(() => {
    setDataProfil({
      storeName: user.nameStore,
      email: user.email,
      phoneNumber: user.phone,
      storeDesc: user.descriptionStore,
      avatar: user.avatar,
    });
  }, [user]);
  useEffect(() => {
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
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  useEffect(() => {
    axiosApiInstance
      .get(`${Url}/v1/order/get`)
      .then((res) => {
        setDataOrder({
          dataHistoryOrder: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
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
        .catch((err) => {
          console.log(err.response);
        });
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
        .catch((err) => {
          console.log(err.response);
        });
    }
  };
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setState({ ...state, dataImg: event.target.files[0] });
        setDataProfil({ ...state, avatar: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const addProductImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setState({
          ...state,
          createProduct: {
            ...state.createProduct,
            thumbnail: e.target.result,
            img: event.target.files[0],
          },
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const upadateProfil = () => {
    const data = {
      nameStore: dataProfil.storeName,
      email: dataProfil.email,
      phone: dataProfil.phoneNumber,
      descriptionStore: dataProfil.storeDesc,
    };
    const form = new FormData();
    form.append("nameStore", dataProfil.storeName);
    form.append("email", dataProfil.email);
    form.append("phone", dataProfil.phoneNumber);
    form.append("descriptionStore", dataProfil.storeDesc);
    form.append("avatar", state.dataImg);
    if (dataProfil.avatar === user.avatar) {
      dispatch(requestUpdateProfile(data))
        .then((res) => {
          swal("success", res, "success");
        })
        .catch((err) => {
          swal("Oops", err, "error");
        });
    } else {
      dispatch(requestUpdateProfile(form))
        .then((res) => {
          swal("success", res, "success");
        })
        .catch((err) => {
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
  const addProduct = () => {
    const form = new FormData();
    form.append("name", state.createProduct.name);
    form.append("price", state.createProduct.price);
    form.append("stock", state.createProduct.stock);
    form.append("image", state.createProduct.img);
    axiosApiInstance
      .post(`${Url}/v1/product`, form)
      .then((res) => {
        swal("success", res.data.message, "success");
      })
      .catch((err) => {
        console.log(err.response);
      });
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
                    <div className="px-4 py-3">
                      <span>action</span>
                    </div>
                  </div>
                </div>

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
                        <div className="d-flex pe-4" style={{ width: "50%" }}>
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
                                      .delete(`${Url}/v1/product?id=${item.id}`)
                                      .then((err) => {
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
                                            });
                                          })
                                          .catch((err) => {
                                            console.log(err.response);
                                          });
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
                      state.dataProduct.allItem.length === 0 ? "show" : "hide"
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
                        <div className="d-flex pe-4" style={{ width: "40%" }}>
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
                  {state.dataProduct.archived.map((item) => {
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
                        <div className="d-flex pe-4" style={{ width: "40%" }}>
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
                {/* archivef */}
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
              <div className="row mt-3">
                <div className="col-12 col-md-7">
                  <div className="w-100 d-flex justify-content-start mb-5">
                    <input
                      type="checkbox"
                      className="me-3 my-auto"
                      onClick={(e) => {
                        setState({ ...state, youWantToEdit: e.target.checked });
                      }}
                    />
                    <label htmlFor="input" className="my-auto">
                      You Want To Edit ?
                    </label>
                  </div>
                  <div className="w-100 d-flex justify-content-end mb-3">
                    <label htmlFor="input" className="my-auto">
                      Store Name
                    </label>
                    <input
                      disabled={state.youWantToEdit === true ? false : true}
                      type="text"
                      placeholder="write your name..."
                      className="ms-3 p-2 border rounded"
                      style={{ outline: "none", width: "70%" }}
                      value={dataProfil.storeName}
                      onChange={(e) => {
                        setDataProfil({
                          ...dataProfil,
                          storeName: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="w-100 d-flex justify-content-end mb-3">
                    <label htmlFor="input" className="my-auto">
                      Email
                    </label>
                    <input
                      disabled={state.youWantToEdit === true ? false : true}
                      type="text"
                      placeholder="write your Email..."
                      className="ms-3 p-2 border rounded"
                      style={{ outline: "none", width: "70%" }}
                      value={dataProfil.email}
                      onChange={(e) => {
                        setDataProfil({ ...dataProfil, email: e.target.value });
                      }}
                    />
                  </div>
                  <div className="w-100 d-flex justify-content-end mb-3">
                    <label htmlFor="input" className="my-auto">
                      Phone Number
                    </label>
                    <input
                      disabled={state.youWantToEdit === true ? false : true}
                      type="number"
                      placeholder="write your password..."
                      className="ms-3 p-2 border rounded"
                      style={{ outline: "none", width: "70%" }}
                      value={dataProfil.phoneNumber}
                      onChange={(e) => {
                        setDataProfil({
                          ...dataProfil,
                          phoneNumber: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="w-100 d-flex justify-content-end mb-3">
                    <label htmlFor="input" className="me-4">
                      Store Description
                    </label>
                    <textarea
                      disabled={state.youWantToEdit === true ? false : true}
                      rows={5}
                      className="ms-3 border"
                      style={{ outline: "none", width: "70%" }}
                      value={dataProfil.storeDesc}
                      onChange={(e) => {
                        setDataProfil({
                          ...dataProfil,
                          storeDesc: e.target.value,
                        });
                      }}
                    />
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
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-5 my-auto">
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
            <div className="my-4">
              <div className="bg-white border p-4 rounded-top">
                <h4 className="fw-bold">Inventory</h4>
              </div>
              <div className="bg-white border p-4 rounded-bottom">
                <label htmlFor="input" className="mb-3">
                  Name of goods
                </label>
                <div>
                  <input
                    type="text"
                    className="p-2 border rounded w-100-sm w-50-lg"
                    style={{ outline: "none" }}
                    onChange={(e) => {
                      setState({
                        ...state,
                        createProduct: {
                          ...state.createProduct,
                          name: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="my-4">
              <div className="bg-white border p-4 rounded-top">
                <h4 className="fw-bold">Item details</h4>
              </div>
              <div className="bg-white border p-4 rounded-bottom">
                <div className="mb-3">
                  <label htmlFor="input" className="mb-3">
                    Unit price
                  </label>
                  <div>
                    <input
                      type="text"
                      className="p-2 border rounded w-100-sm w-50-lg"
                      style={{ outline: "none" }}
                      onChange={(e) => {
                        setState({
                          ...state,
                          createProduct: {
                            ...state.createProduct,
                            price: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="input" className="mb-3">
                    stock
                  </label>
                  <div className="d-flex">
                    <div className="d-flex border rounded w-100-sm w-50-lg me-4">
                      <input
                        type="text"
                        className="w-100 border-0 p-2"
                        style={{ outline: "none" }}
                        onChange={(e) => {
                          setState({
                            ...state,
                            createProduct: {
                              ...state.createProduct,
                              stock: e.target.value,
                            },
                          });
                        }}
                      />
                      <p className="m-0 p-2">buah</p>
                    </div>
                    <div className="d-flex me-4">
                      <input
                        type="radio"
                        className="me-2 my-auto"
                        checked={state.createProduct.condition.baru}
                        onChange={() => {
                          setState({
                            ...state,
                            createProduct: {
                              ...state.createProduct,
                              condition: {
                                baru: true,
                                bekas: false,
                              },
                            },
                          });
                        }}
                      />
                      <label className="my-auto">Baru</label>
                    </div>
                    <div className="d-flex">
                      <input
                        type="radio"
                        className="me-2 my-auto"
                        checked={state.createProduct.condition.bekas}
                        onChange={() => {
                          setState({
                            ...state,
                            createProduct: {
                              ...state.createProduct,
                              condition: {
                                baru: false,
                                bekas: true,
                              },
                            },
                          });
                        }}
                      />
                      <label className="my-auto">bekas</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="input" className="mb-3">
                    Description
                  </label>
                  <div className="d-flex border rounded w-100-sm w-50-lg">
                    <textarea
                      rows={5}
                      className="border w-100"
                      style={{ outline: "none" }}
                      onChange={(e) => {
                        setState({
                          ...state,
                          createProduct: {
                            ...state.createProduct,
                            desc: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4">
              <div className="bg-white border p-4 rounded-top">
                <h4 className="fw-bold">Photo of goods</h4>
                <div className="bg-white border p-4 rounded-bottom">
                  <div
                    className="px-4"
                    style={{ border: "3px dashed #D4D4D4" }}
                  >
                    <div className="d-flex justify-content-between py-4 border-bottom">
                      <div
                        className="rounded overflow-hidden"
                        style={{
                          width: "120px",
                          height: "120px",
                          background: "#c4c0c0",
                        }}
                      >
                        <img
                          src={state.createProduct.thumbnail}
                          width={640}
                          height={480}
                          layout="responsive"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-center my-4">
                      <button
                        className="border-danger rounded-pill py-2 px-5 bg-transparent text-danger overflow-hidden position-relative"
                        onChange={addProductImage}
                      >
                        Select Image
                        <input
                          type="file"
                          className="position-absolute m-0"
                          style={{
                            left: "-100px",
                            top: 5,
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-100 d-flex justify-content-end my-5">
              <button
                className="bg-danger text-white border-0 rounded-pill px-5 py-2 me-3"
                onClick={addProduct}
              >
                Save
              </button>
            </div>
          </div>
          {/* my order */}
          <div
            className={
              profilStore.order == true ? "col-12 col-lg-8 ms-auto" : "hide"
            }
          >
            <div
              className="bg-white p-4 border rounded"
              style={{ minHeight: "550px" }}
            >
              <h4 className="fw-bold">My order</h4>
              <div className="d-flex my-4">
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
                        noPaid: false,
                        package: false,
                        send: false,
                        completed: false,
                        orderCancel: false,
                      },
                    });
                  }}
                >
                  All items
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
                        noPaid: false,
                        package: true,
                        send: false,
                        completed: false,
                        orderCancel: false,
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
                        noPaid: false,
                        package: false,
                        send: true,
                        completed: false,
                        orderCancel: false,
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
                        noPaid: false,
                        package: false,
                        send: false,
                        completed: true,
                        orderCancel: false,
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
                        noPaid: false,
                        package: false,
                        send: false,
                        completed: false,
                        orderCancel: true,
                      },
                    });
                  }}
                >
                  Order cancel
                </button>
              </div>
              <div className="w-100 h-100">
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
                    disabled
                  />
                </div>
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
                      <p className="m-0 me-3">status</p>
                      <span className="material-icons">sort</span>
                    </div>
                    <div
                      className="c-pointer px-4 py-3 d-flex h-100 hover-bg-gray"
                      onClick={sortByStock}
                    >
                      <p className="m-0 me-3">Stock</p>
                      <span className="material-icons">sort</span>
                    </div>
                    <div className="px-4 py-3">
                      <span>action</span>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    state.myOrder.allItem === true
                      ? "w-100 justify-content-center overflow-auto"
                      : "hide"
                  }
                  style={{ maxHeight: "300px" }}
                >
                  {dataOrder.dataHistoryOrder.map((item) => {
                    return (
                      <div
                        className="d-flex  hover-bg-gray border-top  justify-content-between w-100"
                        style={{ background: "#F6F6F6" }}
                      >
                        <div
                          className="py-2 ps-4 my-auto"
                          style={{ width: "60%" }}
                        >
                          <span
                            className="d-inline-block text-truncate"
                            style={{ maxWidth: "250px" }}
                          >
                            {item.nameProduct}
                          </span>
                        </div>
                        <div className="d-flex pe-4" style={{ width: "40%" }}>
                          <p className="py-2 m-0 ms-auto my-auto px-4">
                            {item.status}
                          </p>
                          <p className="py-2 m-0 ms-auto my-auto px-4">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="my-auto pe-4">
                          <button
                            className="border-primary bg-transparent rounded-pill text-primary px-3 py-1"
                            disabled={item.status == "completed" ? true : false}
                            onClick={(e) => {
                              swal({
                                title: "anda yakin?",
                                text: "status akan diubah",
                                icon: "warning",
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  axiosApiInstance
                                    .put(`${Url}/v1/order`, {
                                      status: "completed",
                                      orderId: item.orderId,
                                    })
                                    .then((res) => {
                                      swal(
                                        "updated!",
                                        "data updated",
                                        "success"
                                      );
                                      axiosApiInstance
                                        .get(`${Url}/v1/order/get`)
                                        .then((res) => {
                                          setDataOrder({
                                            dataHistoryOrder: res.data.data,
                                          });
                                        })
                                        .catch((err) => {
                                          console.log(err.response);
                                        });
                                    })
                                    .catch((err) => {
                                      swal("err", err.response, "error");
                                    });
                                }
                              });
                            }}
                          >
                            done
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className={
                      dataOrder.dataHistoryOrder.length === 0 ? "show" : "hide"
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
                <div
                  className={
                    state.myOrder.completed === true
                      ? "w-100 justify-content-center overflow-auto"
                      : "hide"
                  }
                  style={{ maxHeight: "300px" }}
                >
                  {dataOrder.dataHistoryOrder.map((item) => {
                    if (item.status === "completed") {
                      return (
                        <div
                          className="d-flex  hover-bg-gray border-top  justify-content-between w-100"
                          style={{ background: "#F6F6F6" }}
                        >
                          <div
                            className="py-2 ps-4 my-auto"
                            style={{ width: "60%" }}
                          >
                            <span
                              className="d-inline-block text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
                              {item.nameProduct}
                            </span>
                          </div>
                          <div className="d-flex pe-4" style={{ width: "40%" }}>
                            <p className="py-2 m-0 ms-auto my-auto px-4">
                              {item.status}
                            </p>
                            <p className="py-2 m-0 ms-auto my-auto px-4">
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(profil_store);
