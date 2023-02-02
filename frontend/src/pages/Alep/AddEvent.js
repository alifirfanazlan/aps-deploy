import React from "react";
import { Formik, Form } from "formik";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import * as Yup from "yup";
import Textfield from "../../components/AddEvent/Textfield";
import DateTimePicker from "../../components/AddEvent/DateTimePicker";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  let navigate = useNavigate();
  const initialValues = {
    date: "",
    title: "",
    location: "",
  };

  const validationSchema = Yup.object().shape({
    date: Yup.date().required("Required"),
    title: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
  });

  const onSubmit = (data) => {
    axios.post("http://54.209.211.222:5000/event", data).then((response) => {
      alert("Data Input");
      navigate("/schedule");
    });
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Container maxWidth="md">
          <div className="Form">
            <Box width="100%" my={2}>
              <Typography variant="h5">Create Event </Typography>
            </Box>

            <Formik
              initialValues={{ ...initialValues }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>Date</Typography>
                  </Grid>
                </Grid>

                <Grid item my={2}>
                  <DateTimePicker name="date" label="Date" variant="outlined" />
                </Grid>

                <Grid container spacing={9}>
                  <Grid item xs={12}>
                    <Typography>Event Details</Typography>
                  </Grid>
                </Grid>

                <Grid item my={2}>
                  <Textfield
                    name="title"
                    label="Event Title"
                    variant="outlined"
                    multiline={true}
                    rows={4}
                  />
                </Grid>

                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Typography>Location</Typography>
                  </Grid>
                </Grid>

                <Grid item my={2}>
                  <Textfield
                    name="location"
                    label="Enter Location"
                    variant="outlined"
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
  );
};

export default App;
