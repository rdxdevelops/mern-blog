import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect } from "react";

export default function PrivateRoute() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const token = Cookies.get("access_token");

  useEffect(() => {
    if (!token) {
      dispatch(signoutSuccess());
      return navigate("/sign-in");
    }
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;
    const isTokenExpired = Date.now() > expirationTime;

    if (isTokenExpired) {
      dispatch(signoutSuccess());
      return navigate("/sign-in");
    }
  }, [token, dispatch, navigate]);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
