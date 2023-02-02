import React from "react";
import "./Search_Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid } from "@mui/material";

function Search_Result() {
  const [profiles, setProfiles] = useState([]);
  const query = useLocation().search;
  let navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await axios.get(
        `http://54.209.211.222:5001/account/search${query}`
      );
      setProfiles(res.data);
    };
    fetchProfiles();
  }, [query]);

  return (
    <div>
      {profiles.map((value, key) => {
        return (
          <Grid item xs={12} lg={3} key={key}>
            <div className="profile-card-container" key={key}>
              <div className="card">
                <div className="imgBx">
                  <img
                    src={
                      value.imgUrl
                        ? value.imgUrl
                        : "https://flaticons.net/icon.php?slug_category=application&slug_icon=user-profile"
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

                  <button onClick={() => navigate(`/profile/${value._id}`)}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        );
      })}
    </div>
  );
}

export default Search_Result;
