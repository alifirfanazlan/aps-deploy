import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import Upload from './Upload';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { loginSuccess } from "../../redux/userSlice";
import "./Home.css";
import { useNavigate } from "react-router-dom";
// import { useValue } from '../../context/ContextProvider';
// import useCheckToken from '../../hooks/useCheckToken';
import { Grid } from "@mui/material";
import { async } from "@firebase/util";
import { setLogLevel } from "firebase/app";
import Cookies from "js-cookie";

function Home() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const [profileDetails, setProfileDetails] = useState({});
  const [booking, setBooking] = useState([]);
  const [announcementDetails, setAnnouncementDetails] = useState("");
  // const { datatoken } = useSelector((state) => state.user);
  const [announcement, setAnnouncement] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [message, setMessage] = useState("");
  const [wellness, setwellness] = useState("");
  const [fitness, setfitness] = useState("");

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
    // console.log(datatoken._id)
    // use datatoken here
  }
  // useEffect(() => {
  //   const accountRes = axios.get(`http://54.209.211.222:5001/account/find/${datatoken._id}`);
  //   // axios.get(`http://54.209.211.222:5001/account/${id}`).then((response) => {
  //   //       setProfileDetails(response.data);
  //   //     });
  //   setProfileDetails(accountRes.data);

  //   // axios.post("http://54.209.211.222:5001/announcement").then((response) => {
  //   //   setAnnouncementDetails(response.data);
  //   // });

  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountRes = await axios.get(
          `http://54.209.211.222:5001/account/find/${datatoken._id}`
        );
        setProfileDetails(accountRes.data);
        const bookingRes = await axios.get(
          `http://54.209.211.222:5001/booking/nearest/${datatoken._id}`
        );
        setBooking(bookingRes.data);
        console.log("Success");
        const fitnessGet = await axios.get(
          `http://54.209.211.222:5001/fitness/getfitness/${datatoken._id}`
        );
        setfitness(fitnessGet.data);
        const wellnessGet = await axios.get(
          `http://54.209.211.222:5001/wellness/getmood/${datatoken._id}`
        );
        setwellness(wellnessGet.data);
      } catch (err) {}
    };
    fetchData();
  }, [datatoken._id]);

  // if(token) {
  //   console.log(token)
  // } else {
  //   console.log("No token")
  // }

  // const addAnnouncement = async () => {
  //   await axios.post("http://54.209.211.222:5001/announcement",
  //     {
  //       announcementBody: newAnnouncement
  //       // , ProfileId: _id
  //     }
  //     , { withCredentials: true }

  //   )
  //     .then((response) => {
  //       if (response.data.error) {
  //         console.log(response.data.error);
  //       } else {
  //         const announcementToAdd = {
  //           announcementBody: newAnnouncement,
  //           // username: response.data.username,
  //         };
  //         setAnnouncement([...announcement, announcementToAdd]);
  //         setNewAnnouncement("");
  //       }
  //     });
  // };

  return (
    <div>
      <Grid container justify="center" alignItems="center" marginTop={15}>
        <Grid item xs={12} xl={6} sm={6}>
          <div className="home-card">
            <div className="home-card-header">
              <img
                src={
                  datatoken.imgUrl
                    ? datatoken.imgUrl
                    : "https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png"
                }
                className="profile-img"
              />
            </div>
            <div className="home-card-body">
              <p
                className="name"
                onClick={() => navigate(`/profile/${datatoken._id}`)}
              >
                {datatoken.username}
              </p>

              <p>Name : {profileDetails.name}</p>
              <p>Role : {profileDetails.role}</p>
              <p>Sport : {profileDetails.sport}</p>
              <p>Age : {profileDetails.age}</p>

              {datatoken.role !== "athlete" ? (
                <></>
              ) : (
                <>
                  <p>Height : {profileDetails.height}</p>
                  <p>Weight : {profileDetails.weight}</p>
                  <p>Birthday : {profileDetails.birthday}</p>
                </>
              )}

              <p>Email : {profileDetails.email}</p>
              <p>Contact : {profileDetails.contact}</p>
            </div>
          </div>
        </Grid>
        {/* <Grid item xs={12} xl={6} sm={6} >
<div className="profile-home-container">
          <span className="pro">PRO</span>
          <img className="round" src={datatoken.imgUrl ? datatoken.imgUrl : 'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'} alt="user" />
          <h3>Ricky Park</h3>
          <h6>New York</h6>
          <p>User interface designer and <br /> front-end developer</p>
          <div className="buttons">
            <button className="primary">
              Message
            </button>
            <button className="primary ghost">
              Following
            </button>
          </div>
          
        </div>
        </Grid> */}

        <Grid item xs={12} xl={6} sm={6}>
          <div className="home-card">
            <div className="home-card-header">
              <h1>Bookings</h1>
            </div>
            <div className="home-card-body">
              {/* {booking !== [] && booking !== "undefined" && booking !== "" && booking !== Array(0) ? 
             (<div>
             <p className="name" >Nearest Booking Details</p>
             <p>Item : {booking.item_name}</p>
             <p>Amount : {booking.item_amount}</p>
             <p>Store : {booking.store}</p>
             <p>Start Date : {booking.startDate}</p>
             <p>Start Time : {booking.startTime}</p>
             <p>End Date : {booking.startDate}</p>
             <p>End Time : {booking.endTime}</p>
             </div> )
             :(<p className="name" >No Bookings As Of Now</p>)}
               */}

              {booking.length > 0 ? (
                <div>
                  <p className="name">Nearest Booking Details</p>
                  <p>Item : {booking.item_name}</p>
                  <p>Amount : {booking.item_amount}</p>
                  <p>Store : {booking.store}</p>
                  <p>Start Date : {booking.startDate}</p>
                  <p>Start Time : {booking.startTime}</p>
                  <p>End Date : {booking.startDate}</p>
                  <p>End Time : {booking.endTime}</p>
                </div>
              ) : (
                <p className="name">No Bookings As Of Now</p>
              )}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} xl={6} sm={6}>
          <div className="home-card">
            <div className="home-card-header">
              <h1>Wellness Record</h1>
            </div>
            <div className="home-card-body">
              <p className="name">Your Wellness Status is </p>
              <p>{wellness.wellnessmood}</p>

              <p>{wellness.injuryInput > 0 ? "Injured" : "No Injury"}</p>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} xl={6} sm={6}>
          <div className="home-card">
            <div className="home-card-header">
              <h1>Fitness Record</h1>
            </div>
            <div className="home-card-body">
              <p className="name">Your Recent Fitness Record : </p>
              <p>Activity: {fitness.weeklyactivities}</p>
              <p>Distance: {fitness.distance} km</p>
              <p>Exercise Time: {fitness.time}</p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
