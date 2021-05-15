import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Verify() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/app");
    } else {
      const token = window.location.href.split("token=")[1];
      if (token) {
        axios
          .get("https://be.arva-shop.xyz/v1/users/verify", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((result) => {
            Swal.fire("Success", result.data.message, "success");
            router.push("/auth/login");
          })
          .catch((err) => {
            Swal.fire("Something Error!", err.response.data.message, "error");
            router.push("/");
          });
      } else {
        router.push("/");
      }
    }
  }, []);

  return <>Process. . .</>;
}
