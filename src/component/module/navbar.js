import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { refresPage } from "../../config/redux/actions/users";

export default function Navbar() {
  const { status, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const page = router.pathname.split("/")[2];
  const [state, setState] = useState({
    navbarMobileToggle: false,
    dropdownToggle: false,
    openWindowNavbar: false,
  });

  useEffect(() => {
    dispatch(refresPage());
  }, []);

  const toggleOpenNavbarMobile = () => {
    setState({ ...state, navbarMobileToggle: true });
  };
  const toggleCloseNavbarMobile = () => {
    setState({ ...state, navbarMobileToggle: false });
  };
  const handleLogin = () => {
    router.push("/auth/login");
  };
  const handleRegister = () => {
    router.push("/auth/register");
  };
  const handleMyBag = () => {
    router.push("/app/myBag");
  };

  const handleClickProfile = () => {
    router.push("/app/profile");
  };

  const handleSearch = (event) => {
    dispatch({
      type: "SET_QUERY_SEARCH_PRODUCT",
      payload: event.target.value,
    });
    if (event.target.value.length > 0) {
      router.push("/app/searchProduct");
    }
  };

  const handleLogout = () => {
    router.push("/auth/login");
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      {/* Navbar Mobile after login */}
      <div className={status === false ? "hide" : "show"}>
        <div
          className={
            state.navbarMobileToggle == true
              ? "navbarMobile navbarMobile-show hide-lg overflow-auto"
              : "navbarMobile navbarMobile-hide hide-lg"
          }
        >
          <div className="d-flex justify-content-end w-100">
            <button
              className="material-icons bg-transparent border-0 text-danger my-3"
              onClick={toggleCloseNavbarMobile}
            >
              close
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="rounded-circle overflow-hidden bg-transparent border-0 mb-3 d-flex justify-content-center"
              style={{ width: "100px", height: "100px" }}
            >
              <img src={user.avatar} className="w-100 align-self-center" />
            </button>
          </div>
          <h5 className="text-center mb-5 fw-bold">{user.name}</h5>
          <div className="rounded-md border p-2 d-flex mb-4">
            <input
              type="text"
              className="border-0 me-2 px-2 w-100"
              style={{ outline: "none" }}
              placeholder="search"
              onKeyUp={(event) => handleSearch(event)}
            />
            <button className="material-icons border-0 bg-transparent color-gray ">
              search
            </button>
          </div>
          <button className="bg-transparent border-0 border-top border-bottom py-3 d-flex w-100 text-danger">
            <span className="material-icons">mail</span>{" "}
            <p className="m-0 ms-2">Mail</p>
          </button>
          <button className="bg-transparent border-0 border-top border-bottom py-3 d-flex w-100 text-danger">
            <span className="material-icons">notifications_none</span>{" "}
            <p className="m-0 ms-2">notifications</p>
          </button>
          <div className={page == "profile" ? "show" : "hide"}>
            <div className="d-flex my-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#456BF3" }}
              >
                person_outline
              </span>
              <button
                className="m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                onClick={() => {
                  dispatch({ type: "MYACOUNT" });
                }}
              >
                my acount
              </button>
            </div>
            <div className="d-flex my-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#F36F45" }}
              >
                location_on
              </span>
              <button
                className="m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                onClick={() => {
                  dispatch({ type: "SHIPPING_ADDRESS" });
                }}
              >
                Shipping Adrress
              </button>
            </div>
            <div className="d-flex my-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#F3456F" }}
              >
                mode_edit
              </span>
              <button
                className="m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                onClick={() => {
                  dispatch({ type: "MYORDER" });
                }}
              >
                My order
              </button>
            </div>
          </div>
          <div className={page == "profile-store" ? "show" : "hide"}>
            <div className="d-flex my-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#456BF3" }}
              >
                home
              </span>
              <button
                className="m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                onClick={() => {
                  dispatch({ type: "OPEN_STORE" });
                }}
              >
                Store
              </button>
            </div>
            <div className="my-4">
              <div
                className="d-flex c-pointer hover-danger"
                onClick={() => {
                  if (state.dropdownToggle) {
                    setState({ ...state, dropdownToggle: false });
                  } else {
                    setState({ ...state, dropdownToggle: true });
                  }
                }}
              >
                <span
                  className="material-icons text-white rounded-circle p-2 me-3"
                  style={{ background: "#F36F45" }}
                >
                  shopping_cart
                </span>
                <p className="m-0 my-auto fs-6 fw-bold bg-transparent border-0">
                  Product
                </p>
                <span className="material-icons my-auto ms-auto">
                  expand_more
                </span>
              </div>
              <div
                className={state.dropdownToggle == true ? "show" : "hide"}
                style={{ marginLeft: "3.5rem" }}
              >
                <div className="my-3">
                  <button
                    className="m-0 my-auto fs-6 hover-danger bg-transparent border-0"
                    onClick={() => {
                      dispatch({ type: "OPEN_PRODUCT" });
                    }}
                  >
                    My products
                  </button>
                </div>
                <div className="my-3">
                  <button
                    className="m-0 my-auto fs-6 hover-danger bg-transparent border-0"
                    onClick={() => {
                      dispatch({ type: "OPEN_SELLING_PRODUCT" });
                    }}
                  >
                    Selling products
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex my-4">
              <span
                className="material-icons text-white rounded-circle p-2 me-3"
                style={{ background: "#F3456F" }}
              >
                list_alt
              </span>
              <button
                className="m-0 my-auto fs-6 fw-bold hover-danger bg-transparent border-0"
                onClick={() => {
                  dispatch({ type: "OPEN_ORDER" });
                }}
              >
                Order
              </button>
            </div>
          </div>

          <button
            className="bg-transparent border-0 border-top border-bottom py-3 d-flex w-100 text-danger"
            onClick={handleMyBag}
          >
            <span className="material-icons">add_shopping_cart</span>{" "}
            <p className="m-0 ms-2">My Bag</p>
          </button>
          <button
            className="bg-transparent border-0 border-top border-bottom py-3 d-flex w-100 text-danger"
            onClick={handleLogout}
          >
            <span className="material-icons">logout</span>{" "}
            <p className="m-0 ms-2">Logout</p>
          </button>
        </div>
      </div>
      {/*  */}
      {/* Navbar Mobile after Logout */}
      <div className={status === true ? "hide" : "show"}>
        <div
          className={
            state.navbarMobileToggle == true
              ? "navbarMobile navbarMobile-show hide-lg"
              : "navbarMobile navbarMobile-hide hide-lg"
          }
        >
          <div className="d-flex justify-content-end w-100">
            <button
              className="material-icons bg-transparent border-0 text-danger my-5"
              onClick={toggleCloseNavbarMobile}
            >
              close
            </button>
          </div>
          <div className="rounded-md border p-2 d-flex mb-4">
            <input
              type="text"
              className="border-0 me-2 px-2 w-100"
              style={{ outline: "none" }}
              placeholder="search"
              onKeyUp={(event) => handleSearch(event)}
            />
            <button className="material-icons border-0 bg-transparent color-gray">
              search
            </button>
          </div>
          <button
            className="bg-transparent border-0 border-top border-bottom py-3 d-flex w-100 text-danger"
            onClick={handleLogin}
          >
            <span className="material-icons">login</span>{" "}
            <p className="m-0 ms-2">Login</p>
          </button>
          <button
            className="bg-transparent border-0 border-top border-bottom py-3 d-flex w-100 text-danger"
            onClick={handleRegister}
          >
            <span className="material-icons">logout</span>{" "}
            <p className="m-0 ms-2">Signup</p>
          </button>
        </div>
      </div>
      {/*  */}
      {/* nvbar dekstop */}
      <div
        className="shadow bg-white py-4 position-fixed top-0"
        style={{ zIndex: "9", width: "100vw" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-10 col-lg-3">
              <div
                className="d-flex c-pointer"
                onClick={() => {
                  router.push("/app");
                }}
              >
                <Image src="/img/logo_navbar.png" width={34} height={44} />
                <h4 className="text-danger ms-3 my-auto fw-bold">ARVA SHOP</h4>
              </div>
            </div>
            <div className="col-md-5 col-lg-4 ms-auto hide-sm show-lg">
              <div className="rounded-md border p-2 d-flex">
                <input
                  type="text"
                  className="border-0 me-2 px-2 w-100"
                  style={{ outline: "none" }}
                  placeholder="search"
                  onKeyUp={(event) => handleSearch(event)}
                />
                <button className="material-icons border-0 bg-transparent color-gray">
                  search
                </button>
              </div>
            </div>
            <div className="col hide-sm show-lg">
              <div className="d-flex justify-content-center align-items-center ">
                <button
                  className="material-icons border-0 bg-transparent mt-2 color-gray filter "
                  style={{
                    width: "auto",
                    height: "30px",
                    fontSize: "28px",
                    cursor: "pointer",
                  }}
                >
                  filter_alt
                </button>
              </div>
            </div>

            {/* ini komponen belum login */}
            <div
              className={
                status === false
                  ? "col-3 col-lg-4 ms-auto hide-sm show-lg"
                  : "hide"
              }
            >
              <div className="d-flex justify-content-end">
                <button
                  className="material-icons bg-transparent border-0 my-auto me-4 color-gray"
                  onClick={handleMyBag}
                >
                  add_shopping_cart
                </button>
                <button
                  className="bg-danger text-white border-0 rounded-pill px-4 py-2 me-3"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="bg-danger text-white border-0 rounded-pill px-4 py-2"
                  onClick={handleRegister}
                >
                  Signup
                </button>
              </div>
            </div>
            {/* -------- */}
            {/* ini komponen sudah login */}
            <div
              className={
                status === true
                  ? "col-3 col-lg-4 ms-auto hide-sm show-lg"
                  : "hide"
              }
            >
              <div className="d-flex justify-content-end">
                <button
                  className="material-icons bg-transparent border-0 mt-2 me-4 hover-danger"
                  onClick={handleMyBag}
                >
                  add_shopping_cart
                </button>
                <button className="material-icons bg-transparent border-0 mt-2 me-4 hover-danger">
                  notifications_none
                </button>
                <button className="material-icons bg-transparent border-0 mt-2 me-4 hover-danger">
                  mail
                </button>
                <button
                  className="rounded-circle overflow-hidden bg-transparent border-0 d-flex justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                  onClick={() => {
                    if (state.openWindowNavbar) {
                      setState({ ...state, openWindowNavbar: false });
                    } else {
                      setState({ ...state, openWindowNavbar: true });
                    }
                  }}
                >
                  <img src={user.avatar} className="align-self-center w-100" />
                </button>
                <div
                  className={
                    state.openWindowNavbar === true
                      ? "bg-white rounded-sm shadow overflow-hidden"
                      : "hide"
                  }
                  style={{
                    background: "white",
                    position: "absolute",
                    top: "110%",
                  }}
                >
                  <div
                    className="py-2 px-3 d-flex hover-danger c-pointer hover-bg-gray"
                    style={{ minWidth: "300px" }}
                    onClick={() => {
                      if (user.role == "seller") {
                        router.push("/app/profile-store");
                      } else {
                        router.push("/app/profile");
                      }
                    }}
                  >
                    <span className="material-icons me-3">person</span>
                    <p className="m-0 fw-bold">profile</p>
                  </div>
                  <div
                    className="py-2 px-3 d-flex hover-danger c-pointer hover-bg-gray"
                    style={{ minWidth: "300px" }}
                    onClick={handleLogout}
                  >
                    <span className="material-icons me-3">logout</span>
                    <span className="fw-bold">logout</span>
                  </div>
                </div>
              </div>
            </div>
            {/* -------- */}
            <div className="col-2 hide-lg my-auto">
              <div className="d-flex justify-content-end">
                <button
                  className="bg-transparent border-0 material-icons fs-1"
                  onClick={toggleOpenNavbarMobile}
                >
                  menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      {/* siluet, layar hitam ketika navbar mobile keluar */}
      <div
        className={
          state.navbarMobileToggle == true ? "position-fixed hide-lg" : "hide"
        }
        style={{
          width: "100vw",
          height: "100vh",
          top: 0,
          right: 0,
          zIndex: "999",
          background: "rgba(0,0,0,.6)",
        }}
        onClick={toggleCloseNavbarMobile}
      ></div>
      {/*  */}
      <style jsx>
        {`
          .filter:hover {
            color: #f3456f !important;
          }
        `}
      </style>
    </>
  );
}
