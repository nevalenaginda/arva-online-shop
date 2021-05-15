import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [togglestate, setToggleState] = useState(1);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const tooglePasswordVisibility = () => {
    setIsPasswordShow(!isPasswordShow);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(15, "Maximum 15 characters")
        .required("Required!"),
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      axios
        .post(`${process.env.api}/v1/users/`, values)
        .then((res) => {
          Swal.fire("Success", res.data.message, "success");
          router.push("/auth/login");
        })
        .catch((err) => {
          if (err.response) {
            Swal.fire("Something Error!", err.response.data.message, "error");
          } else {
            Swal.fire("Internal Server Error!.", "", "error");
          }
        });
    },
  });

  const formik2 = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      nameStore: "",
      role: "seller",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(15, "Maximum 15 characters")
        .required("Required!"),
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      phone: Yup.string()
        .min(8, "Minimum 9 characters")
        .max(15, "Maximum 15 characters")
        .required("Required!"),
      nameStore: Yup.string()
        .min(2, "Minimum 2 characters")
        .max(21, "Maximum 21 characters")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      axios
        .post(`${process.env.api}/v1/users/`, values)
        .then((res) => {
          Swal.fire("Success", res.data.message, "success");
          router.push("/auth/login");
        })
        .catch((err) => {
          Swal.fire("Something Error!", err.response.data.message, "error");
        });
    },
  });

  const toggleTab = (index) => {
    setToggleState(index);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/app");
    }
  }, []);

  return (
    <div className="auth-login mt-4 mb-5">
      <div className="container">
        <div className="d-flex justify-content-center">
          <Image src="/img/logo_navbar.png" width={34} height={44} />
          <h4 className="text-danger ms-3 my-auto fw-bold">ARVA SHOP</h4>
        </div>
        <h1 className="mt-4">Please sign up with your account</h1>
        <div className="tab-button-auth mt-4">
          <button
            type="button"
            className={
              togglestate === 1 ? "btn-active-auth" : "btn-nonactive-auth"
            }
            onClick={() => toggleTab(1)}
          >
            Custommer
          </button>
          <button
            type="button"
            className={
              togglestate === 2 ? "btn-active-auth" : "btn-nonactive-auth"
            }
            onClick={() => toggleTab(2)}
          >
            Seller
          </button>
          {togglestate === 1 && (
            <>
              <form className="mt-4" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <p className="error">{formik.errors.name}</p>
                  )}
                </div>
                <div className="form-group mt-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="error">{formik.errors.email}</p>
                  )}
                </div>
                <div className="form-group mt-3 mb-5 password-input">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="error">{formik.errors.password}</p>
                  )}
                  {/* <i className={`fa ${isPasswordShow ? "fa-eye-slash" : "fa-eye"} password-icon`} onClick={tooglePasswordVisibility} /> */}
                </div>
                <button type="submit" className="btn-auth">
                  Register
                </button>
                <p className="text-center mt-4 text-account">
                  Already have a arvashop.id account?{" "}
                  <Link href="/auth/login">
                    <a>Login</a>
                  </Link>{" "}
                </p>
              </form>
            </>
          )}
          {togglestate === 2 && (
            <>
              <form className="mt-4" onSubmit={formik2.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={formik2.values.name}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.name && formik2.touched.name && (
                    <p className="error">{formik2.errors.name}</p>
                  )}
                </div>
                <div className="form-group mt-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={formik2.values.email}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.email && formik2.touched.email && (
                    <p className="error">{formik2.errors.email}</p>
                  )}
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    id="phone"
                    placeholder="Phone number"
                    value={formik2.values.phone}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.phone && formik2.touched.phone && (
                    <p className="error">{formik2.errors.phone}</p>
                  )}
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="nameStore"
                    id="nameStore"
                    placeholder="Store Name"
                    value={formik2.values.nameStore}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.nameStore && formik2.touched.nameStore && (
                    <p className="error">{formik2.errors.nameStore}</p>
                  )}
                </div>

                <div className="form-group mt-3 mb-5 password-input">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formik2.values.password}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.password && formik2.touched.password && (
                    <p className="error">{formik2.errors.password}</p>
                  )}
                  {/* <i className={`fa ${isPasswordShow ? "fa-eye-slash" : "fa-eye"} password-icon`} onClick={tooglePasswordVisibility} /> */}
                </div>
                <button type="submit" className="btn-auth">
                  Register
                </button>
                <p className="text-center mt-4 text-account">
                  Already have a arvashop.id account?{" "}
                  <Link href="/auth/login">
                    <a>Login</a>
                  </Link>{" "}
                </p>
              </form>
            </>
          )}
        </div>

        <style jsx>
          {`
            img {
              margin-left: auto;
              margin-right: auto;
            }
            ,
            h1 {
              text-align: center;
              font-family: Metropolis;
              font-style: normal;
              font-weight: bold;
              font-size: 18px;
              line-height: 18px;
              color: #222222;
            }
            ,
            p {
              font-family: Metropolis;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 14px;
              color: #222222;
            }
            ,
            a {
              font-family: Metropolis;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 14px;
              color: #db3022;
            }

            // pindahin ke component reusable
            .btn-auth {
              border: none;
              height: 48px;
              width: 401px;
              border-radius: 25px;
              background: #db3022;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              text-align: center;
              color: #ffffff;
            }
            .btn-active-auth {
              border: none;
              height: 48px;
              width: 123px;
              background: #db3022;
              box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.05);
              border-radius: 0px;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              align-items: center;
              color: #ffffff;
            }
            .btn-nonactive-auth {
              height: 48px;
              width: 123px;
              border: 1px solid #9b9b9b;
              box-sizing: border-box;
              filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.05));
              border-radius: 0px;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              align-items: center;
              color: #9b9b9b;
            }
            // pindahin ke component reusable

            .form-group input {
              height: 48px;
              width: 400px;
              margin-left: auto;
              margin-right: auto;
              border: 1px solid #9b9b9b;
              box-sizing: border-box;
              filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.05));
              border-radius: 4px;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              color: #9b9b9b;
              text-align: left;
            }
            .error {
              margin-top: 3px;
              margin-left: -290px;
              color: #d41a1a;
              font-size: 12px;
            }
            .text-forgot {
              margin-left: 280px;
            }
          `}
        </style>
      </div>
    </div>
  );
}
