import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [approval, setApproval] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setRole("Athlete");
    setApproval(true);
    dispatch(loginStart());
    try {
      const res = await axios.post("http://54.209.211.222:5000/account", {
        username,
        password,
        role,
        approval,
      });
      dispatch(loginSuccess(res.data));
      navigate("/home");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  return (
    <div>
      <div>
        <div className="form-container">
          <form
            className="registerForm"
            // action="#"
          >
            <h1>Create Account</h1>

            <input
              className="auth_input"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="auth_input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* <label htmlFor="select_role">Select a role:</label>
        <select className='auth_role' id="select_role" value={selectedStore} onChange={handleChange}>
        <option value="Athlete">Athlete</option>
          <option value="Coach">Coach</option>
          <option value="Manager">Manager</option>
          <option value="Storekeeper">Storekeeper</option>
        </select> */}
            {/* <input className='auth_input' type="text" placeholder="Role" /> */}
            <button className="btn btn-primary" onClick={handleSignUp}>
              Sign Up as Athlete
            </button>
            <h1 className="or_header">OR</h1>
          </form>
        </div>

        <button
          className="others_button btn btn-primary"
          onClick={() => navigate("/registerothers")}
        >
          Sign Up as others
        </button>
      </div>
    </div>
  );
}

export default Register;
