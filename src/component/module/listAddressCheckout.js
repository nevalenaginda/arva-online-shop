import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from "react-modal";
import {
  deleteAddressUser,
  updateAddressUser,
  getListAddressUser,
  insertAddressUser,
} from "../../config/redux/actions/users";

function listAddressCheckout({ item, fireEvents }) {
  const dispatch = useDispatch();
  const [address, setAddress] = useState(item);
  const { listAddressUser } = useSelector((state) => state.user);

  //state loading update
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleModal2, setToggleModal2] = useState(false);
  const [toggleModal3, setToggleModal3] = useState(false);
  const [data, setData] = useState([]);
  if (isLoadingProcess === true) {
    Swal.fire({
      icon: "info",
      title: "Loading!",
      text: "Please wait",
      showConfirmButton: false,
    });
  }
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

  const handleDeleteAddress = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoadingProcess(true);
        dispatch(deleteAddressUser(id))
          .then((res) => {
            setIsLoadingProcess(false);
            Swal.fire("Success", res.data.message, "success");
          })
          .catch((err) => {
            setIsLoadingProcess(false);
            Swal.fire("Something Error!", err.response.data.message, "error");
          });
      }
    });
  };

  //insert address pake form validasi
  const formik = useFormik({
    initialValues: {
      saveAs: data.saveAs,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      postalCode: data.postalCode,
      city: data.city,
      address: data.address,
      isPrimary: data.isPrimary,
    },
    enableReinitialize: true,
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
      setToggleModal(false);
      setIsLoadingProcess(true);
      const id = data.id;
      dispatch(updateAddressUser(id, values))
        .then((res) => {
          setIsLoadingProcess(false);
          fireEvents([]);
          Swal.fire("Success", res.data.message, "success");
        })
        .catch((err) => {
          setIsLoadingProcess(false);

          Swal.fire("Something Error!", err.response.data.message, "error");
        });
    },
  });

  const formik2 = useFormik({
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
      setToggleModal2(false);
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

  // useEffect(() => {
  //   dispatch(getListAddressUser());
  // }, [dispatch]);

  return (
    <div className="p-3 border rounded" key={address.id}>
      <p className="fw-bold">
        {address.recipientName}{" "}
        {address.isPrimary && <span className="text-danger">[Utama]</span>}
      </p>
      <p>
        {`${address.recipientPhone} `} <br />
        {`${address.address}, Kota ${address.city}, Pos ${address.postalCode}. [${address.saveAs}]`}
      </p>
      <button
        className="btn fw-bold text-danger rounded-pill border-danger me-2"
        onClick={() => setToggleModal(true)}
      >
        Change address
      </button>
      <button
        className="btn btn-danger border-0 rounded-pill fw-bold "
        onClick={(e) => handleDeleteAddress(address.id)}
      >
        Delete Address
      </button>

      <Modal
        isOpen={toggleModal}
        className="modalPositionAndSizeConfig2"
        overlayClassName="modalOverLayConfig"
        closeTimeoutMS={400}
        ariaHideApp={false}
        style={{ maxHeight: "60px" }}
      >
        <div className="w-100 d-flex mb-4 ">
          <span
            className="material-icons ms-auto hover-danger c-pointer"
            onClick={() => setToggleModal(false)}
          >
            close
          </span>
        </div>

        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 my-2 ">
            <div className="px-4 py3">
              <button
                className="color-gray w-100 py-4 bg-transparent rounded my-4"
                style={{ border: "3px dashed #9B9B9B" }}
                onClick={() => {
                  setToggleModal2(true);
                }}
              >
                Add new address
              </button>
              <div className="all-list-address">
                {localListAddress.map((item, idx) => {
                  return (
                    <>
                      <div
                        className="p-3 border border-danger rounded mb-2"
                        key={item.id}
                      >
                        <p className="fw-bold">
                          {item.recipientName}{" "}
                          {item.isPrimary && (
                            <span className="text-danger">[Utama]</span>
                          )}
                        </p>
                        <p>
                          {`${item.recipientPhone} `} <br />
                          {`${item.address}, Kota ${item.city}, Pos ${item.postalCode}. [${item.saveAs}]`}
                        </p>

                        <button
                          className="btn fw-bold text-danger rounded-pill border-danger me-2 "
                          onClick={() => {
                            setData(item);
                            setToggleModal3(true);
                          }}
                        >
                          Change Adress
                        </button>
                        <button
                          className="btn btn-danger border-0 rounded-pill fw-bold "
                          onClick={(e) => handleDeleteAddress(item.id)}
                        >
                          Delete Address
                        </button>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={toggleModal2}
        className="modalPositionAndSizeConfig2"
        overlayClassName="modalOverLayConfig"
        closeTimeoutMS={400}
        ariaHideApp={false}
        style={{ maxHeight: "60px" }}
      >
        <div className="w-100 d-flex mb-4 ">
          <span
            className="material-icons ms-auto hover-danger c-pointer"
            onClick={() => setToggleModal2(false)}
          >
            close
          </span>
        </div>
        <div>
          <h3 className="fw-bold text-center mb-4">Add address</h3>
          <div className="my-2">
            <label className="color-gray">
              Save address as (ex : home address, office address)
            </label>
            <input
              type="text"
              className="w-100 border p-2"
              style={{ outline: "nonde" }}
              name="saveAs"
              value={formik2.values.saveAs}
              onChange={formik2.handleChange}
            />
            {formik2.errors.saveAs && formik2.touched.saveAs && (
              <p className="text-danger">{formik2.errors.saveAs}</p>
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
                value={formik2.values.recipientName}
                onChange={formik2.handleChange}
              />
              {formik2.errors.recipientName &&
                formik2.touched.recipientName && (
                  <p className="text-danger">{formik2.errors.recipientName}</p>
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
                value={formik2.values.recipientPhone}
                onChange={formik2.handleChange}
              />
              {formik2.errors.recipientPhone &&
                formik2.touched.recipientPhone && (
                  <p className="text-danger">{formik2.errors.recipientPhone}</p>
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
                value={formik2.values.address}
                onChange={formik2.handleChange}
              />
              {formik2.errors.address && formik2.touched.address && (
                <p className="text-danger">{formik2.errors.address}</p>
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
                value={formik2.values.postalCode}
                onChange={formik2.handleChange}
              />
              {formik2.errors.postalCode && formik2.touched.postalCode && (
                <p className="text-danger">{formik2.errors.postalCode}</p>
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
                value={formik2.values.city}
                onChange={formik2.handleChange}
              />
              {formik2.errors.city && formik2.touched.city && (
                <p className="text-danger">{formik2.errors.city}</p>
              )}
            </div>
            <div className="col-12 my-2">
              <input
                type="checkbox"
                className="me-2"
                name="isPrimary"
                value={formik2.values.isPrimary}
                onChange={formik2.handleChange}
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
                    onClick={formik2.handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="border-danger rounded-pill py-2 px-5 bg-transparent text-danger overflow-hidden"
                    onClick={() => {
                      setToggleModal2(false);
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

      {data.saveAs && (
        <Modal
          isOpen={toggleModal3}
          className="modalPositionAndSizeConfig2"
          overlayClassName="modalOverLayConfig"
          closeTimeoutMS={400}
          ariaHideApp={false}
          style={{ maxHeight: "60px" }}
        >
          <div className="w-100 d-flex mb-4 ">
            <span
              className="material-icons ms-auto hover-danger c-pointer"
              onClick={() => setToggleModal3(false)}
            >
              close
            </span>
          </div>
          <div>
            <h3 className="fw-bold text-center mb-4">Change address</h3>
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
                {formik.errors.recipientName &&
                  formik.touched.recipientName && (
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
                    <p className="text-danger">
                      {formik.errors.recipientPhone}
                    </p>
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
                        setToggleModal3(false);
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
      )}
      <style jsx>
        {`
          .all-list-address {
            overflow-y: auto;
            height: 360px;
          }

          .all-list-address::-webkit-scrollbar {
            width: 10px;
            height: 5px;
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
        `}
      </style>
    </div>
  );
}

export default listAddressCheckout;
