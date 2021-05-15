import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

export default function Reset() {
  const { query } = useRouter();
  const router = useRouter();
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const tooglePasswordVisibility = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  const token = query.token;

  useEffect(() => {
    if (token) {
      if (localStorage.getItem("token")) {
        router.push("/app");
      } else {
        if (!token) {
          router.push("/auth/login");
        }
      }
    } else {
      if (localStorage.getItem("token")) {
        router.push("/app");
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
    }),

    onSubmit: (values) => {
      axios
        .put("https://be.arva-shop.xyz/v1/users/reset", values, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          Swal.fire("Success", res.data.message, "success");
          router.push("/auth/login");
        })
        .catch((err) => {
          Swal.fire("Something Error!", err.response.data.message, "error");
        });
    },
  });

  return (
    <div className="auth-login mt-4 mb-5">
      <div className="container">
        <div className="d-flex justify-content-center">
          <Image src="/img/logo_navbar.png" width={34} height={44} />
          <h4 className="text-danger ms-3 my-auto fw-bold">ARVA SHOP</h4>
        </div>
        <h1 className="mt-4">Reset password</h1>
        <h2 className="mt-3">Enter your new password</h2>
        <div className="tab-button-auth mt-4">
          <form className="mt-4" onSubmit={formik.handleSubmit}>
            <div className="form-group mt-4 mb-4 password-input">
              <input
                type={isPasswordShow ? "text" : "password"}
                className="form-control mt-1"
                name="password"
                id="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="error">{formik.errors.password}</p>
              )}
              {/* <i className={`fa ${isPasswordShow ? "fa-eye-slash" : "fa-eye"}  password-icon`} onClick={tooglePasswordVisibility} /> */}
            </div>

            <button type="submit" className="btn-auth">
              Reset Password
            </button>
          </form>
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
          `}
        </style>
      </div>
    </div>
  );
}
