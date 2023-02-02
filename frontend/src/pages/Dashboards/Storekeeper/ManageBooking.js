import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import Moment from "react-moment";

function ManageBooking() {
  const [bookings, setBookings] = useState([]);
  const [storeDropdown, setStoreDropdown] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    try {
      axios.get("http://54.209.211.222:5001/booking").then((response) => {
        setBookings(response.data);
        setStoreDropdown(
          Array.from(new Set(response.data.map((item) => item.store)))
        );
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const approveBooking = async (bookingid) => {
    await axios.post(`http://54.209.211.222:5001/booking/approve/${bookingid}`);
  };

  const rejectBooking = async (bookingid) => {
    await axios.post(`http://54.209.211.222:5001/booking/reject/${bookingid}`);
  };

  const pickedBooking = async (bookingid) => {
    await axios.post(`http://54.209.211.222:5001/booking/picked/${bookingid}`);
  };

  const returnedBooking = async (bookingid) => {
    await axios.post(`http://54.209.211.222:5001/booking/return/${bookingid}`);
  };

  const handleChange = (e) => {
    setSelectedStore(e.target.value);
  };

  const handleStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div>
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <header className="header">
            <Link to="/inventory">
              <button className="header_button">
                <span className="text">Inventory</span>
              </button>
            </Link>
            <Link to="/managebooking">
              <button className="header_button">
                <span className="text">Bookings</span>
              </button>
            </Link>
            <Link to="/inventorylist">
              <button className="header_button">
                <span className="text">Inventory List</span>
              </button>
            </Link>
          </header>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xl={6}>
          <label>Select Store : </label>
          <select
            placeholder="Select store"
            value={selectedStore}
            // className='store-select'
            className="auth_input"
            onChange={handleChange}
          >
            {storeDropdown.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </Grid>
        <Grid item xl={6}>
          <label>Select Status : </label>
          <select
            placeholder="Select store"
            // value={selectedStore}

            className="auth_input"
            onChange={handleStatus}
          >
            <option value="approved">Approved</option>
            <option value="returned">Returned</option>
            <option value="picked">Picked Up</option>
            {/* <option value="manager">Returned</option> */}
          </select>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: "15px" }}>
        {bookings
          .filter((item) => !selectedStore || item.store === selectedStore)
          .filter(
            (item) =>
              !selectedStatus ||
              (selectedStatus === "approved" && item.approved === true) ||
              (selectedStatus === "returned" && item.returned === true) ||
              (selectedStatus === "picked" && item.picked === true)
          )
          // .filter(item => !selectedStatus || item.approved === selectedStatus)
          .map((booking) => (
            <Grid xl={4}>
              <MDBCard className="m-4">
                <MDBCardBody>
                  <MDBCardText>Item : {booking.item_name}</MDBCardText>
                  <MDBCardText>Amount : {booking.item_amount}</MDBCardText>
                  <MDBCardText>Store : {booking.store}</MDBCardText>
                  <MDBCardText>
                    Start Date :{" "}
                    <Moment format="DD/MM/YYYY">{booking.startDate}</Moment>
                  </MDBCardText>
                  <MDBCardText>
                    End Date :{" "}
                    <Moment format="DD/MM/YYYY">{booking.endDate}</Moment>
                  </MDBCardText>

                  {booking.approved === false && booking.rejected === false ? (
                    <div>
                      <button
                        className="btn btn-primary m-2"
                        onClick={() => {
                          approveBooking(booking._id);
                          window.location.reload();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => {
                          rejectBooking(booking._id);
                          window.location.reload();
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {booking.approved === true &&
                  booking.picked === false &&
                  booking.returned === false ? (
                    <button
                      className="btn btn-success m-2"
                      onClick={() => {
                        pickedBooking(booking._id);
                        window.location.reload();
                      }}
                    >
                      Picked
                    </button>
                  ) : (
                    <div></div>
                  )}
                  {booking.picked === true && booking.returned === false ? (
                    <button
                      className="btn btn-warning m-2"
                      onClick={() => {
                        returnedBooking(booking._id);
                        window.location.reload();
                      }}
                    >
                      Returned
                    </button>
                  ) : (
                    <div></div>
                  )}
                </MDBCardBody>
              </MDBCard>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}

export default ManageBooking;
