import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";

import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

function Forgot_Password() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [showErrorUsername, setShowErrorUsername] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    checkPasswordMatch(password, e.target.value);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      const res = await axios.patch(
        `http://54.209.211.222:5001/account/forgotpassword/${email}`,
        { password: password }
      );

      if (res.data.email && res.data.password) {
        toast.success("Your password has been updated!", {
          position: toast.POSITION.TOP_CENTER,
        });

        navigate("/");
      } else {
        toast.error("Incorrect email!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      toast.error("Email not found!", { position: toast.POSITION.TOP_CENTER });
    }
  };

  return (
    <div>
      <div className="register-box">
        <h2>Reset Password</h2>
        <div className="signup_form">
          <div className="form-box">
            <input
              type="text"
              className="signup_input"
              // value={username}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div class="form-box">
            <input
              type={showPassword ? "text" : "password"}
              className="signup_input"
              value={password}
              // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length >= 8) {
                  setShowErrorPassword(false);
                } else {
                  setShowErrorPassword(true);
                }
              }}
            />
            <label>New Password : </label>
            <button
              className="btn btn-success"
              style={{ marginBottom: "20px" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {showErrorPassword && password.length < 8 && (
            <p style={{ color: "red" }}>
              Password must be at least 8 characters
            </p>
          )}

          <div class="form-box">
            <input
              type={showPassword ? "text" : "password"}
              className="signup_input"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <label>Confirm Password : </label>
          </div>

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}

          <button className="signup_button" onClick={handleLogin}>
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
}

export default Forgot_Password;
