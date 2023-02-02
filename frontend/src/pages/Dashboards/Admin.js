import React from "react";
import "./Admin.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Grid } from "@mui/material";
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

function Admin() {
  let navigate = useNavigate();
  const [listofProfiles, setListofProfiles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [storeDropdown, setStoreDropdown] = useState("");
  const [approval, setApproval] = useState(false);

  useEffect(() => {
    axios.get("http://54.209.211.222:5001/account/find").then((response) => {
      setListofProfiles(response.data);
    });
  }, []);

  const approveUser = async (userid) => {
    await axios.patch(`http://54.209.211.222:5001/account/request/${userid}`);
  };

  const approveManager = async (team, id, name) => {
    try {
      await axios.post(`http://54.209.211.222:5001/team/manager/${team}`, {
        id: id,
        name: name,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const approveCoach = async (team, id, name) => {
    try {
      await axios.post(`http://54.209.211.222:5001/team/coach/${team}`, {
        id: id,
        name: name,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const rejectUser = async (userid) => {
    await axios.delete(`http://54.209.211.222:5001/account/${userid}`);
  };

  const handleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // const filteredProfiles = listofProfiles.filter(profile => profile.role === selectedRole);

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

      <div>
        <h1
          style={{ textAlign: "center", fontWeight: "bold", marginTop: "5px" }}
        >
          New User Requests
        </h1>
        <label>Role :</label>
        <select
          placeholder="Select store"
          // value={selectedStore}

          className="auth_input"
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="athlete">Athlete</option>
          <option value="coach">Coach</option>
          <option value="manager">Manager</option>
          <option value="storekeeper">Storekeeper</option>
        </select>
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {listofProfiles
            .filter((value) => !selectedRole || value.role === selectedRole)
            .map((value) => {
              return (
                <Grid item xl={4}>
                  <MDBCard className="mb-4" key={value._id}>
                    <MDBCardBody>
                      <Avatar
                        style={{
                          height: "70px",
                          width: "70px",
                          marginBottom: "10px",
                        }}
                        src={value.imgUrl}
                      />
                      <MDBCardText>Username : {value.username}</MDBCardText>
                      <MDBCardText>Name : {value.name}</MDBCardText>
                      <MDBCardText>Age : {value.age}</MDBCardText>

                      {value.role !== "athlete" ? (
                        <></>
                      ) : (
                        <>
                          {" "}
                          <MDBCardText>Height : {value.height}</MDBCardText>
                          <MDBCardText>Weight : {value.weight}</MDBCardText>
                          <MDBCardText>Birthday : {value.birthday}</MDBCardText>
                        </>
                      )}

                      <MDBCardText>Email : {value.email}</MDBCardText>
                      <MDBCardText>Contact : {value.contact}</MDBCardText>
                      <MDBCardText>Gender : {value.gender}</MDBCardText>
                      <MDBCardText>State : {value.state}</MDBCardText>
                      <MDBCardText>Role : {value.role}</MDBCardText>
                      <MDBCardText>
                        Team : {value.sport ? value.sport : "None"}
                      </MDBCardText>
                      {/* <MDBCardText>Start Date : <Moment format="DD/MM/YYYY">{booking.startDate}</Moment></MDBCardText>
              <MDBCardText>End Date : <Moment format="DD/MM/YYYY">{booking.endDate}</Moment></MDBCardText> */}
                      <button
                        className="btn btn-primary m-2"
                        onClick={() => {
                          if (value.role === "manager") {
                            approveManager(value.sport, value._id, value.name);
                          } else if (value.role === "coach") {
                            approveCoach(value.sport, value._id, value.name);
                          }
                          approveUser(value._id);
                          window.location.reload();
                        }}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          rejectUser(value._id);
                          window.location.reload();
                        }}
                      >
                        Reject
                      </button>
                    </MDBCardBody>
                  </MDBCard>
                </Grid>
              );
            })}
        </Grid>
      </div>
    </div>
  );
}

export default Admin;
