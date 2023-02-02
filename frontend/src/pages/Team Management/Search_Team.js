import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search_Team.css";
import useFetch from "../../hooks/useFetch";
import { Grid } from "@mui/material";
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
  MDBCardLink,
} from "mdb-react-ui-kit";
import badge from "../../images/gold-shield-icon-vector-18193912 (3).png";
import Team_Navbar from "./Team_Navbar";

function Search_Team() {
  const [listofTeams, setListofTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState("");
  // const [q, setQ] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    axios.get("http://54.209.211.222:5000/team/random").then((response) => {
      setListofTeams(response.data);
    });
  }, []);

  return (
    <div>
      <div className="search_bar">
        {/* <label>Name :</label> */}
        <input
          className="profile_searchbar"
          // className='search_bbar'
          placeholder="Enter team name / sport"
          type="text"
          // onChange={handleSearchInput}
          onChange={(e) => setFilteredTeams(e.target.value)}
          // onChange={(e) => setQ(e.target.value)}
        />

        {/* <button className='btn btn-primary' onClick={() => navigate(`/search?q=${q}`)}>Search</button> */}
      </div>

      <Grid container spacing={3}>
        {listofTeams.length > 0 &&
          listofTeams
            .filter(
              (team) =>
                !filteredTeams ||
                (team.name &&
                  team.name.toLowerCase().includes(filteredTeams.toLowerCase()))
            )
            .map((team, key) => (
              <Grid item xl={3} sm={6} xs={12} key={key}>
                <MDBCard className="mt-4 card-hover">
                  <MDBCardBody className="text-center">
                    <MDBCardImage
                      src={team.logoUrl ? team.logoUrl : badge}
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

export default Search_Team;
