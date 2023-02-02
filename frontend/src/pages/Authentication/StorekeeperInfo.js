import React, { useState, useContext, useEffect } from "react";
import { Avatar } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import Cookies from "js-cookie";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "./Register.css";
import app from "../../firebase/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Register.css";

const StorekeeperInfo = ({ formData, setFormData, page, setPage, x, setX }) => {
  let navigate = useNavigate();
  const [image, setImage] = useState(undefined);
  // const [imageUrl, setImageUrl] = useState("");
  const [imgPerc, setImgPerc] = useState(0);

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : console.log("Something wrong");
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
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // setImageUrl(downloadURL)
          // setFormData.imageUrl(downloadURL)
          setFormData({ ...formData, imgUrl: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    image && uploadFile(image, "imgUrl");
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://54.209.211.222:5001/account", {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        age: formData.age,
        store: formData.store,
        sport: formData.sport,
        email: formData.email,
        imgUrl: formData.imageUrl,
        role: formData.role,
        approved: false,
      });

      // const token = JSON.stringify(res.data)
      // Cookies.set('access_token', token, { expires: 7 });
      alert(
        "Your profile has been successfully created. Please check your email regularly for approval notification"
      );
      navigate("/");
    } catch (err) {
      console.log("Unable to register");
    }
  };
  return (
    // <motion.div
    //   initial={{ x: x }}
    //   transition={{ duration: 1 }}
    //   animate={{ x: 0 }}
    //   className="card"
    // >
    <div className="register_container">
      <h1 style={{ textAlign: "center" }}>Personal Info</h1>

      <label>
        <input
          accept="image/*"
          id="profilePhoto"
          type="file"
          style={{ display: "none" }}
          // onChange={handleImage}
          onChange={(event) => setImage(event.target.files[0])}
        />
        <Avatar
          //   src={currentUser.imgURL}
          className="avatar"
          sx={{ width: 75, height: 75, cursor: "pointer" }}
        />
      </label>

      <Row>
        <Col>
          <h5>Name : </h5>
          <input
            className="register_input"
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required={true}
          />
        </Col>

        <Col>
          <h5>Age : </h5>
          <input
            className="register_input"
            type="text"
            placeholder="Age"
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <h5>Email : </h5>
          <input
            className="register_input"
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Col>

        <Col>
          <h5>Store : </h5>
          <input
            className="register_input"
            type="text"
            placeholder="Store"
            onChange={(e) =>
              setFormData({ ...formData, store: e.target.value })
            }
          />
        </Col>
      </Row>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Sign Up
      </button>

      <br />
      <button
        className="btn btn-danger"
        onClick={() => {
          setPage(0);
          setX(-1000);
        }}
      >
        Previous
      </button>
    </div>
    // </motion.div>
  );
};

export default StorekeeperInfo;
