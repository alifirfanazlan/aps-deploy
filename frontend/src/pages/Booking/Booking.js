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
import "./Booking.css";
import Item from "./Item";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { new_search } from "../../redux/bookingSlice";
import { Row, Col } from "react-bootstrap";
import { Grid } from "@mui/material";
import ItemCard from "./ItemCard";
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

function Booking() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const token = Cookies.get("access_token");
  if (token) {
    const data = JSON.parse(token);
    // console.log(data);
  } else {
    console.log("Failed");
  }

  let datatoken;

  if (token && typeof token !== "undefined") {
    datatoken = JSON.parse(token);
    // use datatoken here
  }

  const [items, setItems] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [store, setStore] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [itemBook, setItemBook] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [storeDropdown, setStoreDropdown] = useState([]);

  useEffect(() => {
    try {
      axios.get("http://54.209.211.222:5000/inventory").then((response) => {
        setItems(response.data);
        setStoreDropdown(
          Array.from(new Set(response.data.map((item) => item.store)))
        );
        response.data.forEach((item) =>
          setQuantity({ ...quantity, [item._id]: 1 })
        );
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // const handleStartTimeChange = (e) => {
  //   setStartTime(e.target.value);

  //   const date = startDate.toDateString();
  //   const updatedStartDate = new Date(`${date} ${startTime}`);
  //   setStartDate(updatedStartDate);
  //   console.log(startDate)
  // }

  const handleChange = (event) => {
    setSelectedStore(event.target.value);
  };

  return (
    <div className="Inventory">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="btn btn-primary m-2"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCartIcon style={{ cursor: "pointer" }} />
          Cart
        </button>
        <button
          className="btn btn-success m-2"
          onClick={() => navigate(`/bookingstatus/${datatoken._id}`)}
        >
          <NotificationsActiveIcon style={{ cursor: "pointer" }} />
          Booking Status
        </button>
      </div>

      <Grid container spacing={0}>
        <Grid className="header-container">
          <Row className="header-row">
            <Col xs={12} sm={6} lg={6} xl={4} style={{ marginTop: "15px" }}>
              <label style={{ color: "white" }}>Item name:</label>
              <input
                type="text"
                placeholder="Enter item name"
                // className="search-input"
                className="search-input"
                onChange={(e) => setItemBook(e.target.value)}
              />
            </Col>
            <Col xs={12} sm={6} lg={6} xl={4} style={{ marginTop: "15px" }}>
              <label style={{ color: "white" }}>Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="check-in"
                placeholderText="Start date"
                dateFormat="dd/MM/yyyy"
              />
            </Col>

            <Col xs={12} sm={6} lg={6} xl={4} style={{ marginTop: "15px" }}>
              <label style={{ color: "white" }}>Start Time :</label>
              <input
                type="time"
                placeholder="Enter time (HH:MM)"
                className="time-start"
                // className="auth_input"
                pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                onChange={(e) => setStartTime(e.target.value)}
                // onChange={handleStartTimeChange}
              />
            </Col>

            <Col xs={12} sm={6} lg={6} xl={4}>
              <label style={{ color: "white" }}>End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="check-out"
                // className="auth_input"
                placeholderText="End date"
                dateFormat="dd/MM/yyyy"
              />
            </Col>

            <Col xs={12} sm={6} lg={6} xl={4}>
              <label style={{ color: "white" }}>End Time:</label>
              <input
                type="time"
                placeholder="Enter time (HH:MM)"
                className="time-end"
                // className="auth_input"

                onChange={(e) => setEndTime(e.target.value)}
              />
            </Col>

            <Col xs={12} sm={6} lg={6} xl={4}>
              <label style={{ color: "white" }}>Select Store:</label>
              <select
                placeholder="Select store"
                value={selectedStore}
                className="store-select"
                // className="auth_input"
                onChange={handleChange}
              >
                {storeDropdown.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
                {/* {storeDropdown.map(store => (
        <option key={store} value={store}>{store}</option>
    ))} */}
              </select>
            </Col>
          </Row>
        </Grid>
      </Grid>

      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {items
          .filter((item) => !selectedStore || item.store === selectedStore)
          .filter(
            (item) =>
              !itemBook ||
              item.item_name.toLowerCase().includes(itemBook.toLowerCase())
          )
          .map((item) => (
            <Grid item xs={12} md={6} lg={4}>
              <ItemCard
                key={item._id}
                item={item}
                endDate={endDate}
                startDate={startDate}
                endTime={endTime}
                startTime={startTime}

                // quantity={quantity} setQuantity={setQuantity}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
}

export default Booking;
