import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import "./Update_Profile.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import { update_user, update_profile } from "../../redux/userSlice";
import app from "../../firebase/firebase";
import Textfield from "../../components/AddEvent/Textfield";
import { Formik, Form } from "formik";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import DateTimePicker from "../../components/AddEvent/DateTimePicker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Cookies from "js-cookie";

const Update_Profile = () => {
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

  const initialValues = {
    name: datatoken.name,
    birthday: datatoken.birthday,
    height: datatoken.height,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    birthday: Yup.date().required("Required"),
    email: Yup.string().required("Required"),
  });
  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountRes = await axios.get(
          `http://54.209.211.222:5001/account/find/${datatoken._id}`
        );

        setProfileDetails(accountRes.data);
      } catch (err) {}
    };
    fetchData();
  });

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
          setImageUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    image && uploadFile(image, "imgUrl");
  }, [image]);

  const onSubmit = async (data) => {
    await axios
      .patch(`http://54.209.211.222:5001/account/${datatoken._id}`, {
        name: data.name,
        birthday: data.birthday,
        height: data.height,
      })
      .then((response) => {
        alert("Data Input");
        navigate("/");
      });
  };

  return (
    <div>
      <Grid container>
        <Grid item md={12}>
          <Container maxWidth="md">
            <div className="Form">
              <Box width="100%" my={2}>
                <Typography variant="h5" style={{ textAlign: "center" }}>
                  Update Profile
                </Typography>
              </Box>

              <Formik
                initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <Form>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <Typography>Name</Typography>
                    </Grid>
                  </Grid>

                  <Grid item my={2}>
                    <Textfield
                      name="name"
                      label="Enter full name"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Birthday</Typography>
                    </Grid>
                  </Grid>

                  <Grid item my={2}>
                    <DateTimePicker
                      name="birthday"
                      label="Birthday"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid container spacing={9}>
                    <Grid item xs={12}>
                      <Typography>Height</Typography>
                    </Grid>
                  </Grid>

                  <Grid item my={2}>
                    <Textfield
                      name="height"
                      label="Height"
                      variant="outlined"
                      rows={4}
                    />
                  </Grid>

                  <Box width="100%" my={2}>
                    <Button type="submit" variant="contained" color="primary">
                      save
                    </Button>
                  </Box>
                </Form>
              </Formik>
            </div>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default Update_Profile;
