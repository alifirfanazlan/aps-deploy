import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Upload from "./Upload";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./Spesific_Profile.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Card from "../Videos/Card";
import Add_Achievement from "./Add_Achievement";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
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
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { toast } from "react-toastify";

function Spesific_Profile() {
  const [profileDetails, setProfileDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [videos, setVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAchievement, setOpenAchievement] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const path = useLocation().pathname.split("/")[2];
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
    const fetchData = async () => {
      try {
        const accountRes = await axios.get(
          `http://54.209.211.222:5001/account/find/${path}`
        );
        // const profileRes = await axios.get(`/profile/${accountRes.data._id}`);
        const videoRes = await axios.get(
          `http://54.209.211.222:5001/videos/${path}`
        );

        // const channelRes = await axios.get(
        //   `/users/find/${videoRes.data.userId}`
        // );
        setProfileDetails(accountRes.data);
        setAchievements(accountRes.data.achievement);
        setVideos(videoRes.data);
        // dispatch(loginSuccess(accountRes.data));
      } catch (err) {}
    };
    fetchData();
  }, []);

  const deleteAchievement = async (achievementId) => {
    await axios.delete(
      `http://54.209.211.222:5001/account/achievement/${path}/${achievementId}`
    );
  };

  // }, []);

  // const addComment = () => {
  //     axios.post("http://54.209.211.222:5001/comment",
  //         {commentBody: newComment, ProfileId: id },

  //       )
  //       .then((response) => {
  //         if (response.data.error) {
  //           console.log(response.data.error);
  //         } else {
  //           const commentToAdd = {
  //             commentBody: newComment,
  //             // username: response.data.username,
  //           };
  //           setComments([...comments, commentToAdd]);
  //           setNewComment("");
  //         }
  //       });
  //   };

  return (
    <div>
      <h1
        style={{ fontWeight: "bold", textAlign: "center", marginTop: "10px" }}
      >
        Profile
      </h1>
      <MDBContainer className="py-3">
        {/* <MDBRow>
            <MDBCol>
              <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                <MDBBreadcrumbItem>
                  <a href='#'>Home</a>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <a href="#">User</a>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </MDBCol>
          </MDBRow> */}

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard
              className="mb-4"
              style={{
                backgroundImage: `url(${"https://www.premierleague.com/resources/prod/v6.111.2-4807/i/bg-elements/stats-card-bg.svg"})`,
                background: "linear-gradient(270deg,#963cff,#37003c)",
              }}
            >
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={
                    profileDetails.imgUrl
                      ? profileDetails.imgUrl
                      : "https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png"
                  }
                  alt="avatar"
                  className="mt-4"
                  style={{
                    width: "210px",
                    height: "210px",
                    border: "2px solid white",
                    borderRadius: "10%",
                    backgroundColor: "white",
                  }}
                  fluid
                />
                <MDBRow
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    style={{
                      height: "60px",
                      width: "120px",
                      marginTop: "15px",
                      marginBottom: "6px",
                    }}
                    src={
                      profileDetails.state === "Johor" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Johor.png"
                      ) : profileDetails.state === "Kelantan" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Kelantan.png"
                      ) : profileDetails.state === "Terengganu" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Terengganu.png"
                      ) : profileDetails.state === "Perlis" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Perlis.png"
                      ) : profileDetails.state === "Melaka" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Melaka.png"
                      ) : profileDetails.state === "Pulau Pinang" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Penang.png"
                      ) : profileDetails.state === "Negeri Sembilan" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Negeri-Sembilan.png"
                      ) : profileDetails.state === "WP Kuala Lumpur" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Kuala-Lumpur.png"
                      ) : profileDetails.state === "Perak" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Perak.png"
                      ) : profileDetails.state === "Sabah" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Sabah.png"
                      ) : profileDetails.state === "Sarawak" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Sarawak.png"
                      ) : profileDetails.state === "Pahang" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Pahang.png"
                      ) : profileDetails.state === "Kedah" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Kedah.png"
                      ) : profileDetails.state === "Selangor" ? (
                        "https://www.flagcolorcodes.com/data/Flag-of-Selangor.png"
                      ) : (
                        <></>
                      )
                    }
                  />
                </MDBRow>
                <MDBCardText className="mb-1 mt-3" style={{ color: "white" }}>
                  @{profileDetails.username}
                </MDBCardText>
                <MDBCardText className="mb-4" style={{ color: "white" }}>
                  {profileDetails.role.charAt(0).toUpperCase() +
                    profileDetails.role.slice(1)}
                </MDBCardText>

                <div className="d-flex justify-content-center mb-2">
                  {datatoken && datatoken._id === path ? (
                    <button
                      className="btn btn-primary update_button"
                      onClick={() => {
                        if (datatoken.approved === false) {
                          toast.error(
                            "You are not authorized yet to edit your profile details. Please contact the administrator!",
                            {
                              position: toast.POSITION.TOP_CENTER,
                            }
                          );
                          return;
                        }
                        navigate("/update_profile");
                      }}
                    >
                      {" "}
                      Edit Profile{" "}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{
                      background: "linear-gradient(270deg,#963cff,#37003c)",
                    }}
                  >
                    <MDBCardText style={{ color: "white" }}>
                      Achievements
                    </MDBCardText>
                    {datatoken && datatoken._id === path ? (
                      <button
                        className="btn btn-primary update_button"
                        onClick={() => {
                          if (datatoken.approved === false) {
                            toast.error(
                              "You are not authorized yet to edit your achievements. Please contact the administrator!",
                              {
                                position: toast.POSITION.TOP_CENTER,
                              }
                            );
                            return;
                          }
                          setOpenAchievement(true);
                        }}
                      >
                        {" "}
                        Add Achievements{" "}
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </MDBListGroupItem>
                  {achievements.map((achievement) => {
                    return (
                      // <li key={achievement._id}>
                      //   {achievement.year}: {achievement.achievement}

                      //   <IconButton><EditIcon/></IconButton>
                      //   <IconButton onClick={() => deleteAchievement(achievement._id)}><DeleteIcon/></IconButton>
                      // </li>
                      <MDBListGroupItem
                        key={achievement._id}
                        className="d-flex justify-content-between align-items-center p-3"
                      >
                        <MDBCardText>
                          {achievement.year}: {achievement.achievement}
                        </MDBCardText>
                      </MDBListGroupItem>
                    );
                  })}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBListGroup>
                <MDBListGroupItem
                  style={{
                    background: "linear-gradient(270deg,#963cff,#37003c)",
                  }}
                >
                  <MDBCardText style={{ color: "white", textAlign: "center" }}>
                    Biodata
                  </MDBCardText>
                </MDBListGroupItem>

                <MDBListGroupItem>
                  <MDBRow
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    <MDBCol sm="3">
                      <MDBCardText>Full Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="fw-bold">
                        {profileDetails.name}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <MDBRow
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    <MDBCol sm="3">
                      <MDBCardText>Age</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="fw-bold">
                        {profileDetails.age}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>

                <MDBListGroupItem>
                  <MDBRow
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    <MDBCol sm="3">
                      <MDBCardText>Gender</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="fw-bold">
                        {profileDetails.gender}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>

                <MDBListGroupItem>
                  <MDBRow
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    <MDBCol sm="3">
                      <MDBCardText>Sport</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="fw-bold">
                        {profileDetails.sport}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>

                <MDBListGroupItem>
                  <MDBRow
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    <MDBCol sm="3">
                      <MDBCardText>State</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="fw-bold">
                        {profileDetails.state}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>
                {datatoken && datatoken.role !== "athlete" ? (
                  <></>
                ) : (
                  <>
                    <MDBListGroupItem>
                      <MDBRow
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                        }}
                      >
                        <MDBCol sm="3">
                          <MDBCardText>Height</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="fw-bold">
                            {profileDetails.height}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <MDBRow
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                        }}
                      >
                        <MDBCol sm="3">
                          <MDBCardText>Weight</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="fw-bold">
                            {profileDetails.weight} kg
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBListGroupItem>
                  </>
                )}

                {datatoken &&
                (datatoken.role === "admin" ||
                  (datatoken.role === "coach" &&
                    datatoken.sport === profileDetails.sport) ||
                  (datatoken.role === "manager" &&
                    datatoken.sport === profileDetails.sport) ||
                  (datatoken._id === profileDetails._id &&
                    datatoken.sport === profileDetails.sport)) ? (
                  <MDBListGroupItem>
                    <MDBRow
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                      }}
                    >
                      <MDBCol sm="3">
                        <MDBCardText>Email</MDBCardText>
                      </MDBCol>

                      <MDBCol sm="9">
                        <MDBCardText className="fw-bold">
                          {profileDetails.email}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </MDBListGroupItem>
                ) : (
                  <></>
                )}

                {datatoken &&
                (datatoken.role === "admin" ||
                  (datatoken.role === "coach" &&
                    datatoken.sport === profileDetails.sport) ||
                  (datatoken.role === "manager" &&
                    datatoken.sport === profileDetails.sport) ||
                  (datatoken._id === profileDetails._id &&
                    datatoken.sport === profileDetails.sport)) ? (
                  <MDBListGroupItem>
                    <MDBRow
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                      }}
                    >
                      <MDBCol sm="3">
                        <MDBCardText>Contact</MDBCardText>
                      </MDBCol>

                      <MDBCol sm="9">
                        <MDBCardText className="fw-bold">
                          {profileDetails.contact}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </MDBListGroupItem>
                ) : (
                  <></>
                )}
              </MDBListGroup>
            </MDBCard>

            {datatoken && datatoken.role !== "athlete" ? (
              <></>
            ) : (
              <>
                <MDBRow>
                  <MDBCol md="12">
                    <MDBListGroup>
                      <MDBListGroupItem
                        style={{
                          background: "linear-gradient(270deg,#963cff,#37003c)",
                        }}
                      >
                        <MDBCardText
                          style={{ textAlign: "center", color: "white" }}
                        >
                          Player Videos
                          {datatoken && datatoken._id === path ? (
                            <button
                              className="btn btn-primary upload_button"
                              style={{ marginLeft: "50px" }}
                              onClick={() => {
                                if (datatoken.approved === false) {
                                  toast.error(
                                    "You are not authorized yet to upload videos. Please contact the administrator!",
                                    {
                                      position: toast.POSITION.TOP_CENTER,
                                    }
                                  );
                                  return;
                                }
                                setOpen(true);
                              }}
                            >
                              {" "}
                              Upload{" "}
                            </button>
                          ) : (
                            <></>
                          )}
                        </MDBCardText>
                      </MDBListGroupItem>
                      <MDBListGroupItem>
                        <MDBRow>
                          {videos.map((video) => (
                            <MDBCol
                              xl={6}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Card key={video._id} video={video} />
                            </MDBCol>
                          ))}
                        </MDBRow>
                      </MDBListGroupItem>
                    </MDBListGroup>
                  </MDBCol>
                </MDBRow>
              </>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {open && <Upload setOpen={setOpen} />}
      {openAchievement && (
        <Add_Achievement setOpenAchievement={setOpenAchievement} />
      )}

      {/* <div className='Container'>
      {videos.map((video) => (
        <Card key={video._id} video={video}/>
      ))}
    </div> */}
    </div>
  );
}

export default Spesific_Profile;
