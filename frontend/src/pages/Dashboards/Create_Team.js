import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Avatar, Grid } from "@mui/material";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../firebase/firebase";
import { toast } from "react-toastify";

function Create_Team({ setOpenAchievement }) {
  const path = useLocation().pathname.split("/")[2];
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [avatarLogo, setAvatarLogo] = useState("");

  // const handleChange = (event) => {
  //     setSelectedYear(event.target.value);
  // };
  const handleChange = (event) => {
    setAvatarLogo(URL.createObjectURL(event.target.files[0]));
  };

  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    // const storageRef = storage.ref(fileName);
    const storageRef = ref(storage, fileName);
    // const uploadTask = storageRef.put(file);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        // async () => {
        //     const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        //     resolve(downloadURL);
        // }
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // setImageUrl(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleUpload = async () => {
    const logoUrlUpload = await uploadFile(logo, "logoUrl");

    await axios.post("http://54.209.211.222:5001/team/", {
      logoUrl: logoUrlUpload,
      name: name,
    });

    toast.success("Team added successfully!", {
      position: toast.POSITION.TOP_CENTER,
    });
    window.location.reload();
  };

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

      <div
        class="register-box"
        style={{ background: "linear-gradient(#80FFDB, #5390D9)" }}
      >
        <h2 style={{ color: "black" }}>Create Team</h2>
        <div className="signup_form">
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              accept="image/*"
              id="profilePhoto"
              type="file"
              style={{ display: "none" }}
              //  value={profileDetails.imgUrl}
              onChange={(event) => {
                setLogo(event.target.files[0]);
                handleChange(event);
              }}
            />
            <Avatar
              // src={imageUrl}
              src={avatarLogo}
              sx={{ width: 100, height: 100, cursor: "pointer" }}
            />
          </label>
          <div class="form-box">
            <input
              style={{ color: "black" }}
              className="signup_input"
              // value={formData.username}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label style={{ color: "black" }}>Team Name</label>
          </div>

          <button
            className="btn"
            style={{ background: "black", color: "white" }}
            onClick={() => {
              if (!name || !logo) {
                toast.error("Please fill all fields", {
                  position: toast.POSITION.TOP_CENTER,
                });
                return;
              }
              handleUpload();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create_Team;
