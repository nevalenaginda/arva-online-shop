import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(null);

    // Check Token In localStorage
    useEffect(() => {
      if (!window.localStorage.getItem("token")) {
        setIsLogin("notLogin");
      } else {
        setIsLogin("login");
      }
    });

    if (isLogin) {
      if (isLogin === "login") {
        return <Component {...props} />;
      } else {
        router.push("/auth/login");
      }
    }
    return <Component {...props} />;

    // If user is logged in, return original component
  };

  return Auth;
};

export default withAuth;
