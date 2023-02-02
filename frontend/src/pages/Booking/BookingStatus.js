import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import axios from "axios";
import Cookies from "js-cookie";
import Moment from "react-moment";
import moment from "moment";
import { Grid } from "@mui/material";

const BookingStatus = () => {
  const [items, setItems] = useState([]);
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

  useEffect(() => {
    try {
      axios
        .get(`http://54.209.211.222:5000/booking/${datatoken._id}`)
        .then((response) => {
          setItems(response.data);
          // setStoreDropdown(Array.from(new Set(response.data.map(item => item.store))))
          // response.data.forEach(item => setQuantity({ ...quantity, [item._id]: 1 }));
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const formattedStartTime = (startTime) => {
    return moment(startTime, "HH:mm").format();
  };

  const formattedEndTime = (endTime) => {
    return moment(endTime, "HH:mm").format();
  };

  const deleteBooking = (bookingId) => {
    axios.delete(`http://54.209.211.222:5000/booking/${bookingId}`);
    console.log("Booking deleted");
  };

  return (
    <div>
      <h1
        style={{ textAlign: "center", fontWeight: "bold", marginTop: "10px" }}
      >
        Booking Status
      </h1>
      <Grid container spacing={3} style={{ marginTop: "15px" }}>
        {items.map((booking) => (
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
                  <>
                    <p style={{ color: "blue" }}>Pending approval</p>
                  </>
                ) : (
                  <></>
                )}

                {booking.approved === false && booking.rejected === true ? (
                  <>
                    <p style={{ color: "red" }}>Booking Rejected</p>
                    <button
                      className="btn btn-danger"
                      onClick={deleteBooking(booking._id)}
                    >
                      Delete Booking
                    </button>
                  </>
                ) : (
                  <></>
                )}

                {booking.approved === true &&
                booking.picked === false &&
                booking.returned === false ? (
                  <>
                    <p style={{ color: "green" }}>
                      Booking approved, please pick up your item
                    </p>
                  </>
                ) : (
                  <div></div>
                )}

                {booking.picked === true && booking.returned === false ? (
                  <>
                    <p style={{ color: "blue" }}>
                      Item picked, please return upon booking expiry time
                    </p>
                  </>
                ) : (
                  <></>
                )}

                {booking.picked === true && booking.returned === true ? (
                  <>
                    <p style={{ color: "green" }}>Booking succeeded</p>
                    {/* <button className='btn btn-danger'
                                                onClick={deleteBooking(booking._id)}
                                            >Delete Booking</button> */}
                  </>
                ) : (
                  <></>
                )}

                {/* {booking.picked === false ? (
                    <button className='btn btn-success m-2' onClick={() => pickedBooking(booking._id)}>
                      Picked</button>) : (<div></div>)
                  }
                  {booking.returned === false ? (
                    <button className='btn btn-warning m-2' onClick={() => returnedBooking(booking._id)}>
                      Returned</button>) : (<div></div>)
                  } */}
              </MDBCardBody>
            </MDBCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BookingStatus;
