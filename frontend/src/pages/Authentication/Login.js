import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import "./PersonalInfo.css";
import { AuthContext } from "../../context/AuthContext";
import { setCookie } from "react-auth-kit";
import { useSignIn } from "react-auth-kit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://54.209.211.222:5000/account/login", {
        username,
        password,
      });

      if (res.data.username && res.data.password) {
        const token = JSON.stringify(res.data);
        Cookies.set("access_token", token, { expires: 7 });
        navigate("/home");
      } else {
        toast.error("Incorrect username or password!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {}
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     handleLogin(event);
  //   }
  // };

  return (
    <div>
      <div className="register-box">
        <h2>Login</h2>
        <div className="signup_form">
          <div className="form-box">
            <input
              type="text"
              className="signup_input"
              // value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>

          <div className="form-box">
            <input
              type={showPassword ? "text" : "password"}
              className="signup_input"
              // value={password}
              // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password : </label>
            <button
              className="btn btn-success"
              style={{ marginBottom: "20px" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div>
            <a href="/forgotpassword">Forget Password</a>
          </div>

          <button
            className="signup_button"
            onClick={handleLogin}
            // onKeyDown={handleKeyDown}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
