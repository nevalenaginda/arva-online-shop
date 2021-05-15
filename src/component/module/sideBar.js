import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
export default function SideBar() {
  const [state, setState] = useState({
    dropdownToggle: false,
  });
  const router = useRouter();
  const { myAcount, shippingAddress, myOrder } = useSelector(
    (state) => state.Helpers
  );
  const { user } = useSelector((state) => state.user);

  const page = router.pathname.split("/")[2];
  const dispatch = useDispatch();
  return (
    <div>
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
                <img
                  src={user.avatar}
                  width={60}
                  height={60}
                  layout="responsive"
                />
              </div>
              <div className="align-self-center">
                <p className="fw-bold m-0 mb-1">{user.name}</p>
                <button className="d-flex bg-transparent border-0 " disabled>
                  <span
                    class="material-icons me-2"
                    style={{ fontSize: "20px" }}
                  >
                    mode_edit
                  </span>
                  <p className="m-0 my-auto">Ubah Profil</p>
                </button>
              </div>
            </div>
            {/* komponen profil */}
            <div className={page == "profile" ? "show" : "hide"}>
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
                    dispatch({ type: "MYACOUNT" });
                  }}
                >
                  my acount
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
                    dispatch({ type: "MYORDER" });
                  }}
                >
                  My order
                </button>
              </div>
            </div>
            {/*  */}
            {/* komponen profil-store */}
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
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  );
}
