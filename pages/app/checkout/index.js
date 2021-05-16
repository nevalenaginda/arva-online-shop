import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { makeOrder } from "../../../src/config/redux/actions/order";
import {
  getListAddressUser,
  insertAddressUser,
} from "../../../src/config/redux/actions/users";
import Rupiah from "../../../src/helper/rupiah";
import { ListAddressCheckout } from "../../../src/component/module";
import Swal from "sweetalert2";
import withAuth from "../../../src/helper/authNext";
import { useRouter } from "next/router";

function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading, listAddressUser } = useSelector((state) => state.user);
  const { carts } = useSelector((state) => state.carts);
  const [state, setState] = useState({
    toggleModal: false,
    // addAdsress: false
  });
  const [modalCheckout, setModalCheckout] = useState(false);
  const [resultCheckout, setResultCheckout] = useState(null);
  const handleBuy = () => {
    const newData = carts.map((item) => {
      return {
        id: item.productId,
        quantity: item.quantity,
      };
    });
    if (newData.length > 0) {
      const data = {
        productId: JSON.stringify(newData),
        deliveryCost: 15000,
        methodPayment: "bank_transfer",
        email: "abudzaralghifari8@gmail.com",
      };
      dispatch(makeOrder(data)).then((res) => {
        setResultCheckout(res.data);
        setModalCheckout(true);
      });
    } else {
      Swal.fire("Info", "Select product first.", "info");
    }
  };

  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [localListAddress, setLocalListAddress] = useState([]);
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
        .min(2, "Mininum 2 characters")
        .max(15, "Maximum 15 characters")
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
          Swal.fire("Success", res.data.message, "success");
        })
        .catch((err) => {
          setIsLoadingProcess(false);
          Swal.fire("Something Error!", err.response.data.message, "error");
        });
    },
  });

  if (isLoadingProcess === true) {
    Swal.fire({
      icon: "info",
      title: "Loading!",
      text: "Please wait",
      showConfirmButton: false,
    });
  }

  return (
    <div className="container">
      <div className="row row mt-7 mb-5">
        <h2 className="fw-bold mt-3 mb-4">Checkout</h2>

        {/* left columns */}
        <div className="col-lg-8">
          <h4 className="f-16 fw-bold mb-3">Shipping Adress</h4>
          {/* awal shipping addres */}
          <div className="card custom-card mb-3">
            {/* <div className="card-body "> */}
            {localListAddress.length === 0 && (
              <button
                className="color-gray w-100 py-4 bg-transparent rounded"
                style={{ border: "3px dashed #9B9B9B" }}
                onClick={() => {
                  setState({ toggleModal: true });
                }}
              >
                Add your address before shopping
              </button>
            )}
            {localListAddress.map((data, idx) => {
              if (data.isPrimary) {
                return (
                  <ListAddressCheckout
                    item={data}
                    fireEvents={setLocalListAddress}
                  />
                );
              }
            })}
            {/* <button className="btn custom-btn color-gray shadow-none" onClick={() => { setState({ ...state, toggleModal: true }) }} >
              Choose another address
              </button> */}
            {/* </div> */}
          </div>
          {/* akhir shipping addres */}

          {/* awal item */}
          {carts &&
            carts.map((item, index) => {
              return (
                <>
                  <div className="card custom-card mb-3" key={index}>
                    <div className="card-body">
                      <div className="d-sm-block d-md-flex align-items-center">
                        <div className="text-center border-md">
                          <img
                            src={item.imageProduct[0]}
                            alt="product"
                            className="border-image"
                          />
                        </div>
                        <div className="d-md-inline mt-3 mt-md-0  ms-0 ms-md-3 d-md-flex flex-column  align-items-center">
                          <div
                            className=" me-auto f-16 fw-bold d-inline-block text-truncate"
                            style={{ maxWidth: "350px" }}
                          >
                            {`(${item.quantity})`} {item.nameProduct}
                          </div>
                          <div className=" me-auto color-gray f-12 fw-500">
                            {item.nameSeller}
                          </div>
                        </div>
                        <div className="d-md-inline ms-md-auto f-18 fw-bold">
                          {Rupiah(`Rp ${item.totalPrice}`)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}

          {/* akhir item */}
        </div>
        {/* end left columns */}

        {/* right columns */}
        <div className="col-lg-4">
          {/* awal shopping summary */}
          <div className="card custom-card">
            <div className="card-body">
              <h4 className="f-16 fw-bold mb-3">Shopping summary</h4>
              <div className="d-flex justify-content-between">
                <div className="color-gray fw-500 f-16">Order</div>
                <div className="f-18 fw-bold">
                  {Rupiah(
                    `Rp ${carts
                      .map((item) => item.totalPrice)
                      .reduce((a, b) => a + b, 0)}`
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="color-gray fw-500 f-16">Delivery</div>
                <div className="f-18 fw-bold">{Rupiah("Rp 15000")}</div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <div className="f-16 fw-bold mb-3">Shopping summary</div>
                <div className="color-red fw-bold f-18">
                  {Rupiah(
                    `Rp ${carts
                      .map((item) => item.totalPrice)
                      .reduce((a, b) => a + b, 0) + 15000
                    }`
                  )}
                </div>
              </div>
              <div className="d-grid gap-2 col-12 mx-auto">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  className="btn mx-auto w-100 custom-red-btn shadow-none text-white"
                >
                  Select Payment
                </button>
              </div>
            </div>
          </div>
          {/* akhir shopping summary */}

          {/* awal modal payment */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="d-flex justify-content-start">
                    <button
                      type="button "
                      className="btn-close align-self-center"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                    <h5
                      className="modal-title ms-2 f-22 fw-bold align-self-center"
                      id="exampleModalLabel"
                    >
                      Payment
                    </h5>
                  </div>
                  <hr />
                  <h4 className="f-16 fw-bold mb-3">Payment method</h4>
                  <div className="d-flex justify-content-between mb-4">
                    <div
                      className="align-self-center"
                      style={{ width: "80px" }}
                    >
                      <img
                        src={require("../../../public/img/payment/bri.png")}
                        alt="product"
                        className="ms-1 img-bri"
                      />
                    </div>
                    <div className="fw-bold f-18 align-self-center ms-5 me-auto">
                      Bank BRI
                    </div>
                    <input
                      className="form-check-input shadow-none border-0 align-self-center custom-checkbox bg-red "
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <div
                      className="align-self-center"
                      style={{ width: "80px" }}
                    >
                      <img
                        src={require("../../../public/img/payment/bca.png")}
                        alt="product"
                        className="img-bca"
                      />
                    </div>
                    <div className=" fw-bold f-18 align-self-center ms-5 me-auto">
                      Bank BCA
                    </div>
                    <input
                      className="form-check-input shadow-none border-0 align-self-center custom-checkbox bg-red "
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <div
                      className="align-self-center"
                      style={{ width: "80px" }}
                    >
                      <img
                        src={require("../../../public/img/payment/bni.png")}
                        alt="product"
                        className="img-bni"
                      />
                    </div>
                    <div className="fw-bold f-18 align-self-center ms-5 me-auto">
                      Bank BNI
                    </div>
                    <input
                      className="form-check-input shadow-none border-0 align-self-center custom-checkbox bg-red "
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                  </div>
                  <hr />
                  <h4 className="f-16 fw-bold mb-3">Shopping summary</h4>
                  <div className="d-flex justify-content-between">
                    <div className="color-gray fw-500 f-16">Order</div>
                    <div className="f-18 fw-bold">
                      {Rupiah(
                        `Rp ${carts
                          .map((item) => item.totalPrice)
                          .reduce((a, b) => a + b, 0)}`
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="color-gray fw-500 f-16">Delivery</div>
                    <div className="f-18 fw-bold">{Rupiah("Rp 15000")}</div>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex flex-column align-self-start">
                      <div className="f-16 fw-bold">Shopping summary</div>
                      <div className="color-red fw-bold f-18">
                        {Rupiah(
                          `Rp ${carts
                            .map((item) => item.totalPrice)
                            .reduce((a, b) => a + b, 0) + 15000
                          }`
                        )}
                      </div>
                    </div>
                    <div className="align-self-end">
                      <button
                        data-bs-dismiss="modal"
                        type="button "
                        className="btn  custom-red-btn shadow-none text-white"
                        style={{ width: "140px" }}
                        onClick={handleBuy}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end right columns */}
      </div>

      {/* modal dari buy product detail */}
      {resultCheckout && (
        <Modal
          isOpen={modalCheckout}
          className="modalPositionAndSizeConfig2"
          overlayClassName="modalOverLayConfig"
          closeTimeoutMS={400}
          ariaHideApp={false}
          style={{ maxHeight: "60px" }}
        >
          <div className="w-100 d-flex mb-2">
            <span
              className="material-icons ms-auto hover-danger c-pointer"
              onClick={() => {
                setModalCheckout(false);
                router.push("/app");
              }}
            >
              close
            </span>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img alt="logo success" src="/img/success.png" />
            </div>
            <h4 className="fw-bold text-center mt-1">
              {resultCheckout.message}
            </h4>

            <div className="px-4 py3 all-list-checkout">
              <div className="p-3 border border-black rounded">
                <div>
                  <p className="fw-bold mb-0">Name: </p>
                  <p>{user.name}</p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Order Id: </p>
                  <p>{resultCheckout.data.order_id}</p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Transaction Id: </p>
                  <p>{resultCheckout.data.transaction_id}</p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Status: </p>
                  <p>{resultCheckout.data.transaction_status}</p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Payment method: </p>
                  <p>
                    {resultCheckout.data.payment_type === "bank_transfer"
                      ? "Bank Transfer"
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Bank: </p>
                  <p>{resultCheckout.data.va_numbers[0].bank}</p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Virtual Account Number: </p>
                  <p>{resultCheckout.data.va_numbers[0].va_number}</p>
                </div>
                <div>
                  <p className="fw-bold mb-0">Total Payment: </p>
                  <p>{`Rp ${resultCheckout.data.gross_amount}`}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 ms-4">
              <button
                className="btn custom-red-btn shadow-none text-white "
                onClick={() => {
                  setModalCheckout(false);
                  router.push("/app");
                }}
              >
                Back to home
              </button>
            </div>
          </div>
        </Modal>
      )}

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

        <div className={state.toggleModal == true ? "show" : "hide"}>
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

      {/* end modal */}
      <style jsx>
        {`
          .f-22 {
            font-size: 22px;
          }
          .f-18 {
            font-size: 18px;
          }
          .f-16 {
            font-size: 16px;
          }

          .f-14 {
            font-size: 14px;
          }

          .f-12 {
            font-size: 12px;
          }

          .fw-400 {
            font-weight: 400;
          }

          .fw-500 {
            font-weight: 500;
          }
          .all-list-checkout {
            overflow-y: auto;
            height: 360px;
          }

          .all-list-checkout::-webkit-scrollbar {
            width: 10px;
            height: 5px;
          }
          .custom-card {
            box-shadow: 0px 0px 8px rgba(115, 115, 115, 0.25);
            border-radius: 4px;
          }

          .custom-btn {
            border: 1px solid #9b9b9b;
            box-sizing: border-box;
            border-radius: 24px;
            transition: background 0.5s;
          }

          .custom-btn:hover {
            background-color: #db3022;
            border: 1px solid #db3022;
            color: #fff;
          }

          .custom-red-btn {
            background-color: #db3022;
            border: 1px solid #db3022;
            border-radius: 24px;
            transition: background 0.5s;
          }
          .color-p {
            color: #222222;
          }

          .color-red {
            color: #db3022;
          }

          .color-g {
            color: #9b9b9b;
          }

          .bg-red {
            background-color: #db3022 !important;
          }

          .custom-checkbox {
            height: 20px;
            width: 20px;
            border-radius: 4px;
          }
          .border-image {
            border-radius: 8px !important;
            width: 69px;
            height: 69px;
            object-fit: contain;
          }

          .custom-modal-footer {
            box-shadow: 0px -8px 10px rgba(217, 217, 217, 0.25);
            border-radius: 0px 0px 8px 8px;
          }
          .img-bri {
            width: auto;
            height: 30px;
          }
          .img-bca {
            width: auto;
            height: 40px;
          }
          .img-bni {
            width: auto;
            height: 40px;
          }
          @media (max-width: 767px) {
            .border-image {
              border-radius: 8px !important;
              width: 150px;
              height: 150px;
              object-fit: cover;
            }
            .border-md {
              padding: 10px 0px;
              background-color: #fff;
            }
          }
        `}
      </style>
    </div>
  );
}

export default withAuth(Checkout);
