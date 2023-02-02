import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Cookies from "js-cookie";
import axios from "axios";
import Moment from "react-moment";
import moment from "moment";

const CartPage = () => {
  let navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const token = Cookies.get("access_token");

  const datatoken = JSON.parse(token);
  const id = datatoken._id;

  useEffect(() => {
    // Retrieve the cart items from local storage when the component is loaded
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]").filter(
      (item) => item.user_id === id
    );
    setCartItems(items);
  }, []);

  const handleIncrement = (index) => {
    let newCartItems = [...cartItems];
    newCartItems[index].quantity += 1;
    setCartItems(newCartItems);
  };

  const handleDecrement = (index) => {
    let newCartItems = [...cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity -= 1;
    }
    setCartItems(newCartItems);
  };

  const formattedStartTime = (startTime) => {
    return moment(startTime, "HH:mm").format();
  };

  const formattedEndTime = (endTime) => {
    return moment(endTime, "HH:mm").format();
  };

  const handleSubmit = async (item, index) => {
    const res = await axios.post("http://54.209.211.222:5000/booking/", {
      // item_name: item.item.item_name,
      // item_amount: item.quantity,
      // // startDate: ,
      // // endDate: ,
      // userId : id,
      // store : item.item.store

      item_name: cartItems[index].item.item_name,
      item_amount: cartItems[index].quantity,
      startDate: cartItems[index].startDate,
      endDate: cartItems[index].endDate,
      startTime: cartItems[index].startTime,
      endTime: cartItems[index].endTime,
      userId: id,
      store: cartItems[index].item.store,
    });
    console.log(res);
  };

  const handleDelete = (index) => {
    let newCartItems = cartItems.filter((item, i) => i !== index);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  return (
    <div>
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol size="12">
              <MDBCard
                className="card-registration card-registration-2"
                style={{ borderRadius: "15px" }}
              >
                <MDBCardBody className="p-0">
                  <MDBRow className="g-0">
                    <MDBCol lg="12">
                      <div className="p-5">
                        <div className="d-flex justify-content-center align-items-center mb-5">
                          <MDBTypography
                            tag="h1"
                            className="fw-bold mb-0 text-black align"
                          >
                            Booking Cart
                          </MDBTypography>
                          {/* <MDBTypography className="mb-0 text-muted">
                            3 items
                          </MDBTypography> */}
                        </div>

                        <hr className="my-4" />

                        {cartItems.map((item, index) => (
                          <MDBRow
                            className="mb-4 d-flex justify-content-between align-items-center"
                            key={index}
                          >
                            {/* <MDBCol md="2" lg="2" xl="2">
                      <MDBCardImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img5.webp"
                        fluid className="rounded-3" alt="Cotton T-shirt" />
                    </MDBCol> */}
                            <MDBCol md="3" lg="3" xl="3">
                              <MDBTypography
                                tag="h4"
                                className="text-black fw-bold"
                              >
                                {item.item.item_name}
                              </MDBTypography>
                              <MDBTypography
                                tag="h5"
                                className="text-black mb-0"
                              >
                                Store : {item.item.store}
                              </MDBTypography>
                              <MDBTypography
                                tag="h6"
                                className="text-black mt-3 mb-0"
                              >
                                Start Date :{" "}
                                <Moment format="DD - MMM - YYYY">
                                  {item.startDate}
                                </Moment>
                              </MDBTypography>

                              <MDBTypography
                                tag="h6"
                                className="text-black mt-1 mb-0"
                              >
                                {/* <p>Start Time: <Moment format="h:mm A">{item.startTime}</Moment></p> */}

                                <p>
                                  Start Time:{" "}
                                  <Moment
                                    format="h:mm A"
                                    date={formattedStartTime(item.startTime)}
                                  />
                                </p>
                              </MDBTypography>

                              <MDBTypography
                                tag="h6"
                                className="text-black mt-1 mb-0"
                              >
                                End Date :{" "}
                                <Moment format="DD - MMM - YYYY">
                                  {item.endDate}
                                </Moment>
                              </MDBTypography>

                              <MDBTypography
                                tag="h6"
                                className="text-black mt-1 mb-0"
                              >
                                <p>
                                  End Time:{" "}
                                  <Moment
                                    format="h:mm A"
                                    date={formattedEndTime(item.endTime)}
                                  />
                                </p>
                              </MDBTypography>
                            </MDBCol>
                            <MDBCol
                              md="4"
                              lg="3"
                              xl="3"
                              className="d-flex align-items-center"
                            >
                              {/* <MDBBtn className="px-2">
                        <MDBIcon fas icon="minus" />
                      </MDBBtn> */}
                              <button
                                className="btn btn-primary m-2"
                                onClick={() => handleDecrement(index)}
                              >
                                -
                              </button>

                              <MDBInput
                                type="number"
                                min="1"
                                value={item.quantity}
                                size="sm"
                              />

                              <button
                                className="btn btn-primary m-2"
                                onClick={() => handleIncrement(index)}
                                disabled={
                                  item.quantity === item.item.item_amount
                                }
                              >
                                +
                              </button>

                              {/* <MDBBtn className="px-2">
                        <MDBIcon fas icon="plus" />
                      </MDBBtn> */}
                            </MDBCol>
                            <MDBCol
                              md="3"
                              lg="2"
                              xl="2"
                              className="text-end mt-1"
                            >
                              {/* <MDBTypography tag="h6" className="mb-0">
                                € 44.00
                              </MDBTypography> */}
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  handleSubmit(item, index);
                                  handleDelete(index);
                                }}
                              >
                                Confirm Booking
                              </button>
                            </MDBCol>
                            <MDBCol
                              md="1"
                              lg="1"
                              xl="2"
                              className="text-end mt-1"
                            >
                              {/* <a href="#!" className="text-muted">
                                <MDBIcon fas icon="trashcan" />
                              </a> */}
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(index)}
                              >
                                Delete Booking
                              </button>
                            </MDBCol>

                            <hr className="my-4" />
                          </MDBRow>
                        ))}

                        <div className="pt-5">
                          <MDBTypography tag="h6" className="mb-0">
                            <MDBCardText
                              tag="a"
                              href="/booking"
                              className="text-body"
                            >
                              <MDBIcon fas icon="long-arrow-alt-left me-2" />{" "}
                              Back to booking page
                            </MDBCardText>
                          </MDBTypography>
                        </div>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
};

export default CartPage;
