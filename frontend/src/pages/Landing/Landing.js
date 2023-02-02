import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import { Container, Row } from "react-bootstrap";
import Slider from "./Slider";
import Search_Profile from "../Profile/Search_Profile";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { userRequest } from "../../requestMethod";
import { publicRequest } from "../../requestMethod";
import { Grid } from "@mui/material";
import AnnouncementSlider from "./AnnouncementSlider";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardLink,
} from "mdb-react-ui-kit";
// import Slider from "react-slick";

function Landing() {
  let navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);

  const [listofProfiles, setListofProfiles] = useState([]);
  const [listofTeams, setListofTeams] = useState([]);

  // useEffect( () => {
  //     axios.get("http://54.209.211.222:5001/announcement").then((response) => {
  //         setAnnouncements(response.data);
  //       });

  //       axios.get("http://54.209.211.222:5001/account/random").then((response) => {
  //         setListofProfiles(response.data);
  // });
  // }, []);

  useEffect(() => {
    const getAnnouncement = async () => {
      try {
        const res = await axios.get("http://54.209.211.222:5001/announcement");
        axios
          .get("http://54.209.211.222:5001/account/random")
          .then((response) => {
            // retrieve sport name data from other table
            setListofProfiles(response.data);
          });
        axios
          .get("http://54.209.211.222:5001/team/randomhome")
          .then((response) => {
            setListofTeams(response.data);
          });
        setAnnouncements(res.data);
      } catch {}
    };
    getAnnouncement();
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xl={6}>
          <Slider />
        </Grid>

        <Grid item xl={6}>
          <h1 className="announcement_title"> Latest Announcements </h1>

          <AnnouncementSlider announcements={announcements} />
        </Grid>

        {/* <h1> Meet Our Athletes! </h1> */}

        {listofProfiles.map((value, key) => {
          return (
            // <Row xl={12} style={{marginLeft: '2px'}}>
            <Grid item xs={12} lg={3}>
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
                    <h3>{value.sport} Player</h3>
                    <div className="size">
                      <h3>Age : {value.age} </h3>
                    </div>
                    <div className="color">
                      <h3>Position :</h3>
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

        {listofTeams.length > 0 &&
          listofTeams.map((team, key) => (
            <Grid item xl={3} sm={6} xs={12} key={key}>
              <MDBCard className="m-2 card-hover">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={team.logoUrl}
                    alt="avatar"
                    className="rounded-circle mt-4 mb-4"
                    style={{ width: "150px", height: "150px" }}
                    fluid
                  />
                  <p className="text-muted mb-4">{team.name}</p>
                  <MDBCardLink
                    onClick={() => navigate(`/team/${team.name}`)}
                    style={{
                      cursor: "pointer",
                      ":hover": { cursor: "pointer" },
                    }}
                  >
                    View Profile
                  </MDBCardLink>
                </MDBCardBody>
              </MDBCard>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}

export default Landing;
