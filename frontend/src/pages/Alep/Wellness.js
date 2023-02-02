import axios from "axios";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import HotelIcon from "@mui/icons-material/Hotel";
import HealingIcon from "@mui/icons-material/Healing";
import React, { useState, useEffect } from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
// import { Link } from "react-scroll";
import { Grid, Box, Button } from "@mui/material";
import Slider from "@mui/material/Slider";
import bodyMap from "../../utils/bodymap.png";
import SleepChart from "../../components/Wellness/SleepChart";
import { UserData } from "../../components/Wellness/Data";
import TextField from "@mui/material/TextField";
import { Form, Formik, useFormik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Autocomplete from "@mui/material/Autocomplete";
import TimePickers from "../../components/AddEvent/TimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import wellnesspng from "../../utils/wellness.png";
import wellnessicon from "../../utils/wellnessicon.png";
import injuryicon from "../../utils/injuryicon.png";
import stressicon from "../../utils/stressicon.png";
import sleepicon from "../../utils/sleepicon.png";
import headinjury from "../../utils/BodyMapPictures/headinjury.png";
import leftarm from "../../utils/BodyMapPictures/leftarm.png";
import lefthand from "../../utils/BodyMapPictures/lefthand.png";
import leftLeg from "../../utils/BodyMapPictures/leftLeg.png";
import leftThigh from "../../utils/BodyMapPictures/leftThigh.png";
import neckinjury from "../../utils/BodyMapPictures/neckinjury.png";
import rightarm from "../../utils/BodyMapPictures/rightarm.png";
import righthand from "../../utils/BodyMapPictures/righthand.png";
import rightLeg from "../../utils/BodyMapPictures/rightLeg.png";
import rightThigh from "../../utils/BodyMapPictures/rightThigh.png";
import noinjury from "../../utils/BodyMapPictures/no injury.png";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

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

function Wellness() {
  const [wellnessmood, setwellnessmood] = useState("N/A");

  const validationSchema = Yup.object({
    trainingInput: Yup.number(),
    inBedStart: Yup.string().required("Please Enter Sleep Time"),
    inBedEnd: Yup.string().required("Please Enter Wake Time"),
    stressInput: Yup.number(),
    fatigueInput: Yup.number(),
    injuryInput: Yup.number(),
    injuryPart: Yup.string(),
  });
  //console.log(datatoken._id);
  const formik = useFormik({
    initialValues: {
      userId: `${datatoken._id}`,
      trainingInput: 0,
      inBedStart: "",
      inBedEnd: "",
      stressInput: 0,
      fatigueInput: 0,
      injuryInput: 0,
      injuryPart: "",
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      axios
        .post("http://54.209.211.222:5001/wellness", data)
        .then((response) => {
          alert(JSON.stringify("Input Data Successfull", null, 2));
          postMood();
        });
    },
  });

  const [injuryData, setInjuryData] = useState("");
  const [stressData, setstressData] = useState("");
  const [fatigueInput, setfatigueInput] = useState("");
  const [stressInput, setstressInput] = useState("");
  let fromDBsleepDataStart;
  let fromDBsleepDataEnd;
  useEffect(() => {
    async function getInjury() {
      const request = await axios.get(
        `http://54.209.211.222:5001/wellness/date/${datatoken._id}`
      );
      request.data.map((element) => {
        setInjuryData(element.injuryPart);
        setstressData(element.stressInput);
      });
      calculateMood();
      return request;
    }
    getInjury();
  }, []);
  //console.log(stressData);

  const [getSleepDataStart, setGetSleepDataStart] = useState([]);
  const [getSleepDataEnd, setGetSleepDataEnd] = useState([]);

  useEffect(() => {
    async function getSleep() {
      const request = await axios.get(
        `http://54.209.211.222:5001/wellness/sleep/${datatoken._id}`
      );

      setGetSleepDataStart(
        request.data.map((element) => {
          return element.inBedStart;
        })
      );
      setGetSleepDataEnd(
        request.data.map((element) => {
          return element.inBedEnd;
        })
      );

      return request;
    }

    getSleep();
  }, []);
  const [checkForm, setcheckForm] = useState("");
  var latestFormDate = [];

  useEffect(() => {
    async function checkForm() {
      await axios
        .get(`http://54.209.211.222:5001/wellness/form/${datatoken._id}`)
        .then((res) => {
          setcheckForm(
            res.data.map((element) => {
              return element.createdAt;
            })
          );
        });
    }
    checkForm();
  }, []);

  function checkFormDone(object) {
    let currentDate = new Date();
    let inputDate = new Date(object);
    if (currentDate.toDateString() === inputDate.toDateString()) {
      var index = true;
    } else {
      var index = false;
    }

    return index;
  }
  checkFormDone(checkForm);
  let count = 0;
  const chart = getSleepDataStart.map((item) => {
    let current = new Date(getSleepDataEnd[count]).valueOf(); //end
    let previous = new Date(item).valueOf(); // start
    let diff = current - previous;
    let hours = Math.floor(diff / 3600000);
    let mins = Math.round((diff % 3600000) / 60000);
    if (hours < 0) {
      hours = hours + 24;
    }
    count++;
    return hours;
  });
  var chartlength = chart.length;

  function calculateMood() {
    console.log("Kira");
    if (injuryData > 0) {
      setwellnessmood("Bad");
    } else {
      setwellnessmood("Good");
    }
  }
  postMood();
  function postMood() {
    const PostMood = {
      userId: datatoken._id,
      wellnessmood: wellnessmood,
      injuryInput: injuryData,
    };
    //console.log(PostMood);
    axios
      .patch(
        `http://54.209.211.222:5001/wellness/mood/${datatoken._id}`,
        PostMood
      )
      .then((response) => {
        // Handle the response
        console.log("Successfull Store Mood to DB");
      })
      .catch((error) => {
        // Handle the error
        console.log("ERROR Store Mood to DB");
      });
  }
  function showvalue(injuryInput) {
    let xy = injuryInput;
    if (xy == 1) {
      return "Yes";
    } else {
      return "No";
    }
  }

  const initialValues = {
    trainingInput: 0,
    inBedStart: "",
    inBedEnd: "",
    stressInput: 0,
    fatigueInput: 0,
    injuryInput: 0,
    injuryPart: "",
  };

  const injuryOptions = [
    { label: "Head", id: 1 },
    { label: "Neck and Shoulder", id: 2 },
    { label: "Left Arm", id: 3 },
    { label: "Right Arm", id: 4 },
    { label: "Left Hand", id: 5 },
    { label: "Right Hand", id: 6 },
    { label: "Left Thigh", id: 7 },
    { label: "Right Thigh", id: 8 },
    { label: "Left Leg", id: 9 },
    { label: "Right Leg", id: 10 },
  ];

  var myChart = {
    labels: getSleepDataEnd.map((data) => {
      const day = new Date(data);
      let d = day.toDateString();
      return d;
    }),
    datasets: [
      {
        label: "Time In Bed (hours)",
        data: chart.map((data) => data),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
    option: {
      indexAxis: "y",
    },
  };
  //console.log(injuryData);
  function getBodyMapPict(part) {
    if (part == "1") {
      return headinjury;
    }
    if (part == "2") {
      return neckinjury;
    }
    if (part == "3") {
      return leftarm;
    }
    if (part == "4") {
      return rightarm;
    }
    if (part == "5") {
      return lefthand;
    }
    if (part == "6") {
      return righthand;
    }
    if (part == "7") {
      return leftThigh;
    }
    if (part == "8") {
      return rightThigh;
    }
    if (part == "9") {
      return leftLeg;
    }
    if (part == "10") {
      return rightLeg;
    } else return noinjury;
  }

  return (
    <div class="content-wrapper">
      <div class="container-xxl flex-grow-1 container-p-y mt-5">
        <div class="row">
          <div class="col-lg-8 mb-2 order-0">
            <div class="card">
              <div class="d-flex align-items-end row">
                <div class="col-sm-7">
                  <div class="card-body">
                    <h4 class="card-title text-primary">Athlete Wellness</h4>
                    <p class="mb-4">
                      You have{" "}
                      {checkFormDone(checkForm) ? (
                        <span class="fw-bold">done</span>
                      ) : (
                        <span class="fw-bold">not</span>
                      )}{" "}
                      submit wellness form today. Check your new badge in your
                      profile.
                    </p>
                    <Link
                      to={`/profile/${datatoken._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Badges
                    </Link>
                  </div>
                </div>
                <div class="col-sm-5 text-center text-sm-left">
                  <div class="card-body pb-0 px-0 px-md-4">
                    <img src={wellnesspng} height={150} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 order-1">
            <div class="row">
              <div class="col-lg-6 col-md-12 col-6 mb-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                      <div class="avatar flex-shrink-0">
                        <img
                          src={wellnessicon}
                          height={50}
                          width={50}
                          class="rounded"
                        />
                      </div>
                      <div class="dropdown">
                        <button
                          class="btn p-0"
                          type="button"
                          id="cardOpt3"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div
                          class="dropdown-menu dropdown-menu-end"
                          aria-labelledby="cardOpt3"
                        >
                          <a class="dropdown-item" href="javascript:void(0);">
                            View More
                          </a>
                          <a class="dropdown-item" href="javascript:void(0);">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>

                    <span class="fw-semibold d-block mb-1">Wellness</span>
                    <h3 class="card-title mb-2">{wellnessmood}</h3>
                    <small class="text-success fw-semibold">
                      <i class="bx bx-up-arrow-alt"></i> +72.80%
                    </small>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-12 col-6 mb-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                      <div class="avatar flex-shrink-0">
                        <img
                          src={injuryicon}
                          height={50}
                          width={50}
                          class="rounded"
                        />
                      </div>
                      <div class="dropdown">
                        <button
                          class="btn p-0"
                          type="button"
                          id="cardOpt6"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div
                          class="dropdown-menu dropdown-menu-end"
                          aria-labelledby="cardOpt6"
                        >
                          <a class="dropdown-item" href="javascript:void(0);">
                            View More
                          </a>
                          <a class="dropdown-item" href="javascript:void(0);">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Injury</span>
                    <h3 class="card-title text-nowrap mb-2">
                      {injuryData > 0 ? (
                        <div>Injured</div>
                      ) : (
                        <div> No Injury</div>
                      )}
                    </h3>
                    <small class="text-success fw-semibold">
                      <i class="bx bx-up-arrow-alt"></i> +28.42%
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
            <div class="row">
              <div class="col-xl">
                <div class="card mb-4">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Wellness Form</h5>
                    <small class="text-muted float-end">Today Data</small>
                  </div>
                  <div class="card-body">
                    <Formik
                      initialValues={{ ...initialValues }}
                      //validationSchema={validationSchema}
                      //onSubmit={onSubmit}
                      onSubmit={formik.handleSubmit}
                    >
                      <Form>
                        <div class="mb-3">
                          <label
                            class="form-label"
                            for="basic-default-fullname"
                          >
                            Training
                          </label>

                          <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Slider
                              name="trainingInput"
                              id="trainingInput"
                              valueLabelDisplay="auto"
                              onChange={formik.handleChange}
                              value={formik.values.trainingInput}
                              step={1}
                              min={1}
                              max={5}
                              marks={[
                                {
                                  value: 1,
                                  label: "Not Effective",
                                },
                                {
                                  value: 5,
                                  label: "Very Effective",
                                },
                              ]}
                            />
                          </Box>
                        </div>
                        <label
                          class="form-label mb-3"
                          for="basic-default-fullname"
                        >
                          Sleep Duration
                        </label>
                        <div class="row">
                          <div class="d-flex justify-content-around">
                            <div class="mb-3 ">
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <TimePicker
                                  name="inBedStart"
                                  label="Sleep Time"
                                  variant="outlined"
                                  onChange={(newvalue) => {
                                    formik.setFieldValue(
                                      "inBedStart",
                                      newvalue
                                    );
                                  }}
                                  value={formik.values.inBedStart || null}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                            </div>
                            <div class="mb-3 ">
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <TimePicker
                                  name="inBedEnd"
                                  label="Wake Up Time"
                                  variant="outlined"
                                  value={formik.values.inBedEnd || null}
                                  onChange={(newvalue) => {
                                    formik.setFieldValue("inBedEnd", newvalue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                        <div class="mb-3">
                          <label class="form-label" for="basic-default-email">
                            Stress
                          </label>
                          <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Slider
                              name="stressInput"
                              defaultValue={1}
                              valueLabelDisplay="auto"
                              onChange={formik.handleChange}
                              value={formik.values.stressInput}
                              step={1}
                              min={1}
                              max={5}
                              marks={[
                                {
                                  value: 1,
                                  label: "Low Stress",
                                },
                                {
                                  value: 5,
                                  label: "High Stress",
                                },
                              ]}
                            />
                          </Box>
                          <div class="form-text">
                            Describe your stress level
                          </div>
                        </div>
                        <div class="mb-3">
                          <label class="form-label" for="basic-default-phone">
                            Fatigue
                          </label>

                          <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Slider
                              name="fatigueInput"
                              defaultValue={0}
                              valueLabelDisplay="auto"
                              scale={showvalue}
                              onChange={formik.handleChange}
                              value={formik.values.fatigueInput}
                              step={1}
                              min={0}
                              max={1}
                              marks={[
                                {
                                  value: 0,
                                  label: "No",
                                },
                                {
                                  value: 1,
                                  label: "Yes",
                                },
                              ]}
                            />
                          </Box>
                        </div>
                        <div class="mb-3">
                          <label class="form-label" for="basic-default-message">
                            Injury
                          </label>
                          <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Slider
                              name="injuryInput"
                              defaultValue={0}
                              valueLabelDisplay="auto"
                              scale={showvalue}
                              onChange={formik.handleChange}
                              value={formik.values.injuryInput}
                              step={1}
                              min={0}
                              max={1}
                              marks={[
                                {
                                  value: 0,
                                  label: "No",
                                },
                                {
                                  value: 1,
                                  label: "Yes",
                                },
                              ]}
                            />
                          </Box>
                        </div>
                        <div class="mb-3">
                          {formik.values.injuryInput ? (
                            <Box sx={{ minWidth: 300 }}>
                              <FormControl fullWidth>
                                <InputLabel id="injuryPart">
                                  Body Part
                                </InputLabel>
                                <Select
                                  label="Body Part"
                                  name="injuryPart"
                                  id="injuryPart"
                                  value={formik.values.injuryPart}
                                  onChange={formik.handleChange}
                                >
                                  <MenuItem value={1}>Head</MenuItem>
                                  <MenuItem value={2}>
                                    Neck and Sholder
                                  </MenuItem>
                                  <MenuItem value={3}>Left Arm</MenuItem>
                                  <MenuItem value={4}>Right Arm</MenuItem>
                                  <MenuItem value={5}>Left Hand</MenuItem>
                                  <MenuItem value={6}>Right Hand</MenuItem>
                                  <MenuItem value={7}>Left Thigh</MenuItem>
                                  <MenuItem value={8}>Right Thigh</MenuItem>
                                  <MenuItem value={9}>Left Leg</MenuItem>
                                  <MenuItem value={10}>Right Leg</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          ) : (
                            <div></div>
                          )}
                        </div>
                        {checkFormDone(checkForm) ? (
                          <button
                            type="button"
                            class="btn btn-secondary"
                            disabled
                          >
                            Send
                          </button>
                        ) : (
                          <button type="submit" class="btn btn-primary">
                            Send
                          </button>
                        )}
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-8 col-lg-4 order-3 order-md-2">
            <div class="row">
              <div class="col-6 mb-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                      <div class="avatar flex-shrink-0">
                        <img
                          src={stressicon}
                          height={50}
                          width={50}
                          class="rounded"
                        />
                      </div>
                      <div class="dropdown">
                        <button
                          class="btn p-0"
                          type="button"
                          id="cardOpt4"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div
                          class="dropdown-menu dropdown-menu-end"
                          aria-labelledby="cardOpt4"
                        >
                          <a class="dropdown-item" href="javascript:void(0);">
                            View More
                          </a>
                          <a class="dropdown-item" href="javascript:void(0);">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Stress Level</span>
                    <h3 class="card-title text-nowrap mb-2">
                      {stressData <= 2 && <div>Low</div>}
                      {stressData == 3 && <div>Medium</div>}
                      {stressData >= 5 && <div>High</div>}
                    </h3>
                    <small class="text-danger fw-semibold">
                      <i class="bx bx-down-arrow-alt"></i> -14.82%
                    </small>
                  </div>
                </div>
              </div>
              <div class="col-6 mb-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                      <div class="avatar flex-shrink-0">
                        <img
                          src={sleepicon}
                          height={50}
                          width={50}
                          class="rounded"
                        />
                      </div>
                      <div class="dropdown">
                        <button
                          class="btn p-0"
                          type="button"
                          id="cardOpt1"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="cardOpt1">
                          <a class="dropdown-item" href="javascript:void(0);">
                            View More
                          </a>
                          <a class="dropdown-item" href="javascript:void(0);">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Sleep Time</span>
                    <h3 class="card-title mb-2">{chart[chartlength - 1]} h</h3>
                    <small class="text-success fw-semibold">
                      <i class="bx bx-up-arrow-alt"></i> +28.14%
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between flex-sm-row flex-column">
                    <div class="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                      <div class="card-title">
                        <h5 class="text-nowrap mb-2">Profile</h5>
                      </div>
                      <div class="mt-sm-auto">
                        <small class="text-success text-nowrap fw-semibold">
                          <i class="bx bx-chevron-up"></i>Name
                        </small>
                        <h3 class="mb-0">{datatoken.name}</h3>
                      </div>
                    </div>
                    <div id="profileReportChart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6 col-lg-6 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Body Map</h5>
                <h6 class="card-subtitle text-muted">Latest Injury Update</h6>
              </div>
              <img
                class="img-fluid d-flex mx-auto my-2"
                src={getBodyMapPict(injuryData)}
                alt="Card image cap"
                width={450}
              />

              <div class="card-footer">
                {injuryData > 0 ? (
                  <p class="card-text">Rest to recover from injury</p>
                ) : (
                  <p class="card-text">Your body is in good condition</p>
                )}

                <a href="javascript:void(0);" class="card-link">
                  Card link
                </a>
                <a href="javascript:void(0);" class="card-link">
                  Another link
                </a>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Sleep Chart</h5>
                <h6 class="card-subtitle text-muted">Your Latest Schedule</h6>
              </div>
              <div class="card-body ">
                <div className="sleepChartJS">
                  <SleepChart chartData={myChart} />
                </div>
              </div>
              <div class="card-footer">
                <p class="card-text">
                  The "In Bed" period reflects the time period you are lying in
                  bed
                </p>
                <a href="javascript:void(0);" class="card-link">
                  Card link
                </a>
                <a href="javascript:void(0);" class="card-link">
                  Another link
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wellness;
