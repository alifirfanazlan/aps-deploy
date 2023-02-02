import React, { useEffect } from "react";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

import { Link, useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import { useDispatch, useSelector } from "react-redux";
import { new_search } from "../../redux/bookingSlice";
import { Row, Col } from "react-bootstrap";
import { Grid } from "@mui/material";

import DateTimePicker from "react-datetime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Cookies from "js-cookie";
import {
  toast,
  ToastContainer,
  Slide,
  Bounce,
  Flip,
  Zoom,
} from "react-toastify";

function Create_Announcement() {
  const [date, setDate] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const addAnnouncement = () => {
    axios
      .post("http://54.209.211.222:5000/announcement", {
        announcementBody: announcement,
        date: date,
      })
      .then((response) => {
        toast.success("Announcement created successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        if (response.data.error) {
          toast.error(response.data.error, {
            position: toast.POSITION.TOP_CENTER,
          });
          // } else {
          //   res.json("error")
          // const commentToAdd = {
          //   commentBody: newComment,
          //   // username: response.data.username,
          // };
          // setComments([...comments, commentToAdd]);
          // setNewComment("");
        }
      });
  };

  return (
    <div>
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <header className="header">
            <Link to="/admin">
              <button className="header_button">
                <span className="text">Manage Requests</span>
              </button>
            </Link>
            <Link to="/announcement">
              <button className="header_button">
                <span className="text">Announcement</span>
              </button>
            </Link>
            <Link to="/createteam">
              <button className="header_button">
                <span className="text">Create Team</span>
              </button>
            </Link>
          </header>
        </Grid>
      </Grid>

      <div
        class="register-box"
        style={{ background: "linear-gradient(#80FFDB, #5390D9)" }}
      >
        <h2 style={{ color: "black" }}>Create Announcement</h2>
        <div className="signup_form">
          <div class="form-box">
            <textarea
              style={{ color: "black" }}
              rows={3}
              className="signup_input"
              // value={formData.username}
              onChange={(e) => {
                setAnnouncement(e.target.value);
              }}
            />
            <label style={{ color: "black" }}>Announcement Text</label>
          </div>

          <div class="form-box">
            <input
              className="signup_input"
              type="date"
              style={{ color: "black" }}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              // onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
            <label style={{ color: "black" }}>Date : </label>
          </div>

          {/* <button className="signup_button"
                            style={{color: 'black'}}
                    // onClick={handleLogin}
                      
                    >

                        <span style={{background: 'black'}}></span>
                        <span style={{background: 'black'}}></span>
                        <span style={{background: 'black'}}></span>
                        <span style={{background: 'black'}}></span>
                        Submit
                    </button> */}
          <button
            className="btn"
            style={{ background: "black", color: "white" }}
            onClick={addAnnouncement}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create_Announcement;
