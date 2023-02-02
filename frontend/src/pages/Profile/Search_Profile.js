import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search_Profile.css";
import useFetch from "../../hooks/useFetch";
import { Grid } from "@mui/material";
import { Card, Row, Col } from "react-bootstrap";
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
import Cookies from "js-cookie";

function Search_Profile() {
  const [listofProfiles, setListofProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState("");
  const [filteredSports, setFilteredSports] = useState("");
  const token = Cookies.get("access_token");

  if (token) {
    const data = JSON.parse(token);
    console.log(data);
  } else {
    console.log("Failed");
  }

  let datatoken;

  if (token && typeof token !== "undefined") {
    datatoken = JSON.parse(token);
    // use datatoken here
  }

  const [q, setQ] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://54.209.211.222:5000/account/random").then((response) => {
      // retrieve sport name data from other table
      setListofProfiles(response.data);
    });
  }, []);

  return (
    <div>
      <div className="Athlete_Search_Bar">
        {/* <label>Name :</label> */}
        <input
          className="profile_searchbar"
          placeholder="Enter athlete name or sport..."
          type={"text"}
          onChange={(e) => setFilteredProfiles(e.target.value)}
          // onChange={(e) => setQ(e.target.value)}
        />

        {/* <input
          className='profile_searchbar'
          placeholder='Enter sport...'
          type={'text'}></input> */}

        {/* <button className='btn btn-primary' onClick={() => navigate(`/search?q=${q}`)}>Search Profile</button> */}
      </div>

      <Grid container spacing={2}>
        {listofProfiles.length > 0 &&
          listofProfiles
            .filter(
              (value) =>
                !filteredProfiles ||
                (value.username &&
                  value.username
                    .toLowerCase()
                    .includes(filteredProfiles.toLowerCase())) ||
                (value.sport &&
                  value.sport
                    .toLowerCase()
                    .includes(filteredProfiles.toLowerCase()))
            )

            .map((value, key) => {
              return (
                <Grid item xs={12} lg={3} key={key}>
                  <div className="profile-card-container" key={key}>
                    <div
                      className="card"
                      onClick={() => navigate(`/profile/${value._id}`)}
                    >
                      <div className="imgBx">
                        <img
                          src={
                            value.imgUrl
                              ? value.imgUrl
                              : //'https://flaticons.net/icon.php?slug_category=application&slug_icon=user-profile'
                                "https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png"
                          }
                          alt=""
                        />
                      </div>
                      <div className="contentBx">
                        <h2>@{value.username ? value.username : "Unknown"}</h2>
                        <img
                          style={{
                            height: "50px",
                            marginTop: "3px",
                            marginBottom: "6px",
                          }}
                          src={
                            value.state === "Johor"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Johor.png"
                              : value.state === "Kelantan"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Kelantan.png"
                              : value.state === "Terengganu"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Terengganu.png"
                              : value.state === "Perlis"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Perlis.png"
                              : value.state === "Melaka"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Melaka.png"
                              : value.state === "Pulau Pinang"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Penang.png"
                              : value.state === "Negeri Sembilan"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Negeri-Sembilan.png"
                              : value.state === "WP Kuala Lumpur"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Kuala-Lumpur.png"
                              : value.state === "Perak"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Perak.png"
                              : value.state === "Sabah"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Sabah.png"
                              : value.state === "Sarawak"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Sarawak.png"
                              : value.state === "Pahang"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Pahang.png"
                              : value.state === "Kedah"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Kedah.png"
                              : value.state === "Selangor"
                              ? "https://www.flagcolorcodes.com/data/Flag-of-Selangor.png"
                              : ""
                          }
                        />

                        {/* <h3>{value.sport} Player</h3> */}
                        <div className="size">
                          <h3>Sport : {value.sport} </h3>
                        </div>
                        <div className="color">
                          <h3>Age : {value.age} </h3>
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/profile/${value._id}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </Grid>
              );
            })}
      </Grid>
    </div>
  );
}

export default Search_Profile;
