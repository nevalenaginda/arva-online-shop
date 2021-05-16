import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from "react-modal";
import {
  deleteAddressUser,
  updateAddressUser,
} from "../../config/redux/actions/users";

function listUserAddress({ item, fireEvents }) {
  const dispatch = useDispatch();
  const [address, setAddress] = useState(item);

  //state loading update
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);

  if (isLoadingProcess === true) {
    Swal.fire({
      icon: "info",
      title: "Loading!",
      text: "Please wait",
      showConfirmButton: false,
    });
  }

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
            fireEvents([]);
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
      saveAs: address.saveAs,
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      postalCode: address.postalCode,
      city: address.city,
      address: address.address,
      isPrimary: address.isPrimary,
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
      setToggleModal(false);
      setIsLoadingProcess(true);
      const id = address.id;
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

  return (
    <div className="p-3 border border-danger rounded mb-3" key={address.id}>
      <p className="fw-bold">
        {address.recipientName}{" "}
        {address.isPrimary && <span className="text-danger">[Utama]</span>}
      </p>
      <p>
        {`${address.recipientPhone} `} <br />
        {`${address.address}, Kota ${address.city}, Pos ${address.postalCode}. [${address.saveAs}]`}
      </p>
      <button
        className="btn fw-bold text-danger rounded-pill border-danger me-2 btn-custom"
        onClick={() => setToggleModal(true)}
      >
        Change address
      </button>
      <button
        className="btn btn-danger border-0 rounded-pill fw-bold btn-custom"
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
              <div className="d-flex justify-content-center justify-content-md-end">
                <div>
                  <button
                    className="btn-danger text-white border-0 rounded-pill px-5 py-2 me-3 btn-custom-modal"
                    type="submit"
                    onClick={formik.handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="border-danger rounded-pill py-2 px-5 bg-transparent text-danger overflow-hidden btn-custom-modal"
                    onClick={() => {
                      setToggleModal(false);
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
          @media (max-width: 498px) {
            .btn-custom {
              margin-top: 10px;
              width: 100%;
            }
          }
          @media (max-width: 730px) {
            .btn-custom-modal {
              margin-top: 10px;
              width: 100%;
            }
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

export default listUserAddress;
