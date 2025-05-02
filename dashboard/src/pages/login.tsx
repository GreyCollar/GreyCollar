import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && window.opener) {
      window.opener.postMessage({ code }, window.origin);
    }

    setTimeout(() => window.close(), 300);
  }, []);

  return null;
};

export default Login;
