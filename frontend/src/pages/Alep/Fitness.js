import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRunning } from "@fortawesome/free-solid-svg-icons";
// import wave from "../utils/wave2.png";
import wave from "../../utils/wave2.png";
import kudos2 from "../../utils/kudos.png";
import routeicon from "../../utils/routeicons.png";
import timeicon from "../../utils/timeicons.png";
import runicon from "../../utils/Run.png";
import LineChart from "../../components/Fitness/FitnessChart";
import Cookies from "js-cookie";
import "./Fitness.css";

const jwt = Cookies.get("access_token");
if (jwt) {
  const data = JSON.parse(jwt);
  // console.log(data);
} else {
  console.log("Failed");
}

let datatoken;

if (jwt && typeof jwt !== "undefined") {
  datatoken = JSON.parse(jwt);
  // use datatoken here
}
//console.log(datatoken)
function Fitness() {
  // Authorization Process
  const authLink = "https://www.strava.com/oauth/token";
  const clientID = 97652;
  var authorizationCode;
  var refreshToken;
  var accessToken;
  var expiresAt;
  var authprocess = false;
  var buttonPress = false;
  const [authorizationDone, setauthorizationDone] = useState(false);

  function initalAuth() {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=97652&redirect_uri=http://54.209.211.222:5000/fitness&response_type=code&scope=activity:read_all,profile:read_all`;
    buttonPress = true;
    console.log(buttonPress);
  }

  // setInterval(() => {
  //   console.log("This function is called every 5 seconds!");
  // }, 5000);

  // Get the current URL
  const currentUrl = window.location.href;

  // Parse the query string of the URL
  const urlParams = new URLSearchParams(currentUrl);

  // Get the value of the code parameter
  const code = urlParams.get("code");

  // Store the value of the code parameter in a variable

  authorizationCode = code;

  if (authorizationCode != undefined && authorizationDone == false) {
    console.log("Post Authorize");
    postAuthorize();
  }
  //console.log(authorizationCode);
  function postAuthorize() {
    axios
      .post("https://www.strava.com/api/v3/oauth/token", {
        client_id: "97652",
        client_secret: "70e445a71d44cd5cd8cb8cf55699ee321e44ca21",
        code: `${authorizationCode}`,
        grant_type: "authorization_code",
      })
      .then((response) => {
        // Handle the response
        // Get the refresh_token and access_token values from the response data
        const { refresh_token, access_token, expires_at } = response.data;

        // Store the values in variables
        refreshToken = refresh_token;
        accessToken = access_token;
        expiresAt = expires_at;
        console.log("Successfull POST Authorize");
        postTokenToDB();
      })
      .catch((error) => {
        // Handle the error
        console.log("ERROR to POST Authorize");
      });
  }
  //console.log(datatoken._id)
  function postTokenToDB() {
    const PostToken = {
      userid: datatoken._id,
      refreshToken: `${refreshToken}`,
      accessToken: `${accessToken}`,
      expires_at: `${expiresAt}`,
    };
    //console.log(PostToken);
    axios
      .patch("http://54.209.211.222:5000/fitness/token", PostToken)
      .then((response) => {
        // Handle the response
        console.log("Successfull Store Token to DB");
      })
      .catch((error) => {
        // Handle the error
        console.log("ERROR Store Token to DB");
      });
  }
  var token;

  function getTokenfromDB() {
    axios
      .get(`http://54.209.211.222:5000/fitness/get/${datatoken._id}`)
      .then((response) => {
        // Get the refreshToken, accessToken, and expires_at values from the response data
        //const { refreshToken, accessToken, expires_at } = response.data;
        //console.log(response.data)
        refreshToken = response.data.refreshToken;
        accessToken = response.data.accessToken;
        expiresAt = response.data.expires_at;
        token = accessToken;
        //console.log(refreshToken)
        if (expiresAt < Date.now() / 1000) {
          // Dah expired token
          //console.log(expiresAt - Date.now());
          reAuthorize();
        }

        getLoggedInAthlete();
        getActivities();
      })
      .catch((error) => {
        //Handle the error
        console.log(error, "ERROR to Get Token From DB");
      });
  }
  useEffect(() => {
    getTokenfromDB();
  }, [accessToken]);
  const reAuthorize = () => {
    console.log("Reauthorize being made");
    fetch(authLink, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        client_id: "97652",
        client_secret: "70e445a71d44cd5cd8cb8cf55699ee321e44ca21",
        refresh_token: `${refreshToken}`,
        grant_type: "refresh_token",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // setToken(res.access_token);
        accessToken = res.access_token;
        expiresAt = res.expires_at;
        //console.log(accessToken);
        postTokenToDB();
        // getActivities(res);
        // getLoggedInAthlete(res);
        // getAthleteStats();
      })
      .catch((error) => {
        console.log("ERROR REAUTHORIZE", error);
      });
  };

  const [athleteActivity, setathleteActivity] = useState([]);
  const [athleteFirstname, setathleteFirstname] = useState("");
  const [athleteLastName, setathleteLastName] = useState("");
  const [athleteFollowers, setathleteFollowers] = useState(0);
  var friend = 0;
  //const [athleteId, setathleteId] = useState("");
  var athleteId;
  //console.log(token);

  // useEffect(() => {
  //   getLoggedInAthlete();
  //   getActivities();
  // }, []);

  async function getLoggedInAthlete() {
    const getLoggedInAthlete = `https://www.strava.com/api/v3/athlete?access_token=${token}`;
    await axios
      .get(getLoggedInAthlete)
      .then((res) => {
        //console.log(res.data);
        athleteId = res.data.id;
        setathleteFirstname(res.data.firstname);
        setathleteLastName(res.data.lastname);
        setathleteFollowers(res.data.follower_count);
        friend = res.data.friend_count;
        setauthorizationDone(true);
      })
      .catch((error) => {
        console.log("ERROR TO GET LOGIN", error);
        setauthorizationDone(false);
      });
    getAthleteStats();
  }

  async function getActivities() {
    const getActivityLink = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
    await axios
      .get(getActivityLink)
      .then((res) => {
        //console.log(res.data);
        setathleteActivity(
          res.data.map((element) => {
            return {
              id: element.id,
              name: element.name,
              max_speed: element.max_speed,
              moving_time: element.moving_time,
              distance: element.distance,
              kudos: element.kudos_count,
            };
          })
        );
      })
      .catch((error) => {
        console.log("ERROR TO GET ATHLETE ACTIVITIES", error);
      });
  }

  const [athleteAllRunStats, setathleteAllRunStats] = useState({});
  const [athleteAllCycleStats, setathleteAllCycleStats] = useState({});
  const [athleteRecentRunStats, setathleteRecentRunStats] = useState({});
  const [athleteRecentCycleStats, setathleteRecentCycleStats] = useState({});
  //recent_ride_totals

  async function getAthleteStats() {
    //console.log(athleteId)
    await axios
      .get(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return (
          setathleteAllRunStats(res.data.all_run_totals),
          setathleteAllCycleStats(res.data.all_ride_totals),
          setathleteRecentRunStats(res.data.recent_run_totals),
          setathleteRecentCycleStats(res.data.recent_ride_totals)
        );
        authorizationDone = true;
      })
      .catch((error) => {
        console.log("ERROR TO GET ATHLETE STATS", error);
      });
  }
  //getAthleteStats();parseInt(athleteRecentCycleStats)
  //athleteRecentRunStats.count+athleteRecentCycleStats.count
  //setweeklyactivity(parseInt(athleteRecentRunStats.count) + parseInt(athleteRecentCycleStats.count))
  // console.log(athleteFirstname)
  // console.log(weeklyactivity)
  var weekActivityCount =
    Number(athleteRecentRunStats.count) + Number(athleteRecentCycleStats.count);
  //console.log(datatoken._id)
  async function postActivities() {
    const fitnessData = {
      id: datatoken._id,
      athleteName: athleteFirstname,
      weeklyactivities: weekActivityCount,
      distance: Math.round(totalDistance / 10) / 100,
      time: `${totalExcerciseTime}h ${minutes}m`,
    };
    console.log(fitnessData);
    try {
      const response = await axios.patch(
        `http://54.209.211.222:5000/fitness/patchdata/${datatoken._id}`,
        fitnessData
      );
      console.log("Success postActivity", response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function deAuthorize() {
    try {
      const response = axios.post(
        `https://www.strava.com/oauth/deauthorize?access_token=${token}`
      );
      console.log(response);
      setauthorizationDone(false);
    } catch (error) {
      console.error(error);
    }
  }

  //postActivities();

  var activityCount = athleteActivity.length;
  var Distance = athleteActivity.map((value) => {
    return value.distance;
  });

  let totalDistance = 0;
  for (let index = 0; index < Distance.length; index++) {
    totalDistance += Distance[index];
  }

  var excerciseTime = athleteActivity.map((value) => {
    return value.moving_time;
  });
  let totalExcerciseTime = 0;
  for (let index = 0; index < excerciseTime.length; index++) {
    totalExcerciseTime += excerciseTime[index];
  }
  var minutes = Math.round((totalExcerciseTime % 3600) / 60);
  totalExcerciseTime = Math.round(totalExcerciseTime / 3600);

  function getHours(time) {
    var hours = Math.round(time / 3600);
    return hours;
  }

  function getMin(time) {
    var minutes = Math.round((time % 3600) / 60);
    return minutes;
  }
  var kudos = athleteActivity.map((value) => {
    return value.kudos;
  });

  //console.log(minutes);
  let totalKudos = 0;
  for (let index = 0; index < kudos.length; index++) {
    totalKudos += kudos[index];
  }
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function getWeekOfMonth(date) {
    let adjustedDate = date.getDate() + date.getDay();
    let prefixes = ["0", "1", "2", "3", "4", "5"];
    return parseInt(prefixes[0 | (adjustedDate / 7)]) + 1;
  }

  const date0 = new Date();
  date0.setDate(date0.getDate() - 6);
  let day0 = weekday[date0.getDay()];
  let time0 = date0.getTime();

  const date1 = new Date();
  date1.setDate(date1.getDate() - 5);
  let day1 = weekday[date1.getDay()];
  let time1 = date0.getTime();

  const date2 = new Date();
  date2.setDate(date2.getDate() - 4);
  let day2 = weekday[date2.getDay()];
  let time2 = date0.getTime();

  const date3 = new Date();
  date3.setDate(date3.getDate() - 3);
  let day3 = weekday[date3.getDay()];
  let time3 = date0.getTime();

  const date4 = new Date();
  date4.setDate(date4.getDate() - 2);
  let day4 = weekday[date4.getDay()];
  let time4 = date0.getTime();

  const date5 = new Date();
  date5.setDate(date5.getDate() - 1);
  let day5 = weekday[date5.getDay()];
  let time5 = date0.getTime();

  const date6 = new Date();
  // date6.setDate(date6.getDate());
  let time6 = date6.getTime();
  let day6 = "Today";

  async function getActivitiesChart() {
    await axios
      .get("https://www.strava.com/api/v3/athlete/activities", {
        params: {
          before: "1671374929025",
          after: "1671374929372",
          per_page: "30",
        },
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // let arr = [res.data];
        console.log(res.data);
        // return (activityPerDay[i] = arr.length);
      });
  }

  let epooch = [time0, time1, time2, time3, time4, time5, time6];
  let activityPerDay = [];
  for (let i = 0; i < epooch.length; i++) {
    //getActivitiesChart(i);
  }

  const data = {
    options: {
      scales: {
        y: { beginAtZero: true, min: 0, max: 10, ticks: { stepSize: 1 } },
      },
    },
    labels: [
      "Last 5 weeks",
      "Last 4 weeks",
      "Last 3 weeks",
      "Last 2 weeks",
      "Last weeks",
      "This week",
    ],
    datasets: [
      {
        label: "Activities",
        data: [2, 1, 0, 1, 2, 3, 4],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  var year = new Date().getFullYear();

  return (
    <div>
      <div class="content-wrapper">
        {authorizationDone ? (
          <div className="row">
            <div className="col-md-2">
              <h5>Connected to Strava</h5>
            </div>
            <div className="col-md-2">
              <a href="" onClick={deAuthorize}>
                Unlink from Strava
              </a>
            </div>
          </div>
        ) : (
          <div className="container-xxl flex-grow-1 container-p-y mt-3">
            <div className="col-md-4">
              <h5>You are not connected to Strava</h5>
            </div>
            <div className="col-md-2">
              <a href="#" onClick={initalAuth}>
                Click to link to Strava
              </a>
            </div>
          </div>
        )}
        <div className={`${!authorizationDone ? "blur" : ""}`}>
          <div class="container-xxl flex-grow-1 container-p-y mt-2">
            <div class="row">
              <div class="col-lg-8 mb-4 order-0">
                <div class="card">
                  <div class="d-flex align-items-end row">
                    <div class="col-sm-7">
                      <div class="card-body">
                        <h5 class="card-title text-primary">
                          Welcome {athleteFirstname}! 🎉
                        </h5>
                        <p class="mb-4">
                          You have done{" "}
                          <span class="fw-bold">{weekActivityCount}</span>{" "}
                          activities this week. Check your new badge in your
                          profile.
                        </p>
                        <div className="row">
                          <div className="col-md-4">
                            <button
                              href={`/profile/${datatoken._id}`}
                              class="btn btn-sm btn-outline-primary"
                            >
                              View Profile
                            </button>
                          </div>
                          <div className="col-md-3">
                            <button
                              onClick={postActivities}
                              class="btn btn-sm btn-outline-primary"
                            >
                              Sync Data
                            </button>
                          </div>
                        </div>
                        <div class="d-flex flex-row align-items-center"></div>
                      </div>
                    </div>
                    <div class="col-sm-5 text-center text-sm-left">
                      <div class="card-body pb-0 px-0 px-md-4">
                        <img src={runicon} height={140} />
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
                              src={wave}
                              height={40}
                              width={40}
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
                              <a class="dropdown-item" href="">
                                View More
                              </a>
                              <a class="dropdown-item" href="">
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>

                        <span class="fw-semibold d-block mb-1">Activities</span>
                        <h3 class="card-title mb-2">{activityCount}</h3>
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
                              src={kudos2}
                              height={40}
                              width={40}
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
                              <a class="dropdown-item" href="">
                                View More
                              </a>
                              <a class="dropdown-item" href="">
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                        <span class="fw-semibold d-block mb-1">Kudos</span>
                        <h3 class="card-title text-nowrap mb-1">
                          {totalKudos}
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
                <div class="card h-100">
                  <div class="row row-bordered g-0">
                    <h5 class="card-header m-0 me-2 pb-3 pt-3">
                      <FontAwesomeIcon icon={faRunning} /> This Month
                    </h5>
                    <div>
                      <div className="fitnessChartJS">
                        <LineChart chartData={data} />
                      </div>
                    </div>
                    <div></div>
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
                              src={routeicon}
                              height={40}
                              width={40}
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
                              <a class="dropdown-item" href="">
                                View More
                              </a>
                              <a class="dropdown-item" href="">
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                        <span class="fw-semibold d-block mb-1">Distance</span>
                        <h3 class="card-title text-nowrap mb-2">
                          {Math.round(totalDistance / 10) / 100} km
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
                              src={timeicon}
                              height={40}
                              width={40}
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
                            <div
                              class="dropdown-menu"
                              aria-labelledby="cardOpt1"
                            >
                              <a class="dropdown-item" href="">
                                View More
                              </a>
                              <a class="dropdown-item" href="">
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                        <span class="fw-semibold d-block mb-1">
                          Exercise Time
                        </span>
                        <h3 class="card-title mb-2">
                          {totalExcerciseTime}h {minutes}m
                        </h3>
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
                      <div class="card-title">
                        <h5 class="text-nowrap mb-3">Profile</h5>

                        <div class="card-group mb-2">
                          <div class="card text-center">
                            <div class="card-body py-1">
                              <p class="card-title">Followers</p>
                              <h3 class="card-text">{athleteFollowers}</h3>
                            </div>
                          </div>
                          <div class="card text-center">
                            <div class="card-body py-1">
                              <p class="card-title">Friends</p>
                              <h3 class="card-text">{friend}</h3>
                            </div>
                          </div>
                          <div class="card text-center">
                            <div class="card-body py-1">
                              <p class="card-title">Activities</p>
                              <h3 class="card-text">{activityCount}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-sm-auto">
                        <small class="text-success text-nowrap fw-semibold">
                          <i class="bx bx-chevron-up"></i>Name
                        </small>
                        <h3 class="mb-0">
                          {athleteFirstname} {athleteLastName}
                        </h3>

                        <div id="profileReportChart"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
                <div class="card h-100">
                  <div class="card-header d-flex align-items-center justify-content-between pb-0">
                    <div class="card-title mb-2">
                      <h5 class="m-0 me-2">Clubs</h5>
                      <small class="text-muted">UM Runners</small>
                    </div>
                    <div class="dropdown">
                      <button
                        class="btn p-0"
                        type="button"
                        id="orederStatistics"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div
                        class="dropdown-menu dropdown-menu-end"
                        aria-labelledby="orederStatistics"
                      >
                        <a class="dropdown-item" href="">
                          Select All
                        </a>
                        <a class="dropdown-item" href="">
                          Refresh
                        </a>
                        <a class="dropdown-item" href="">
                          Share
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="d-flex flex-column align-items-center gap-1">
                        <h5 class="mb-2">Club Activities</h5>
                      </div>
                      <div id="orderStatisticsChart"></div>
                    </div>

                    <div class="table-responsive text-nowrap">
                      <table class="table card-table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Athlete</th>
                            <th>Distance</th>
                          </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                          <tr>
                            <td>
                              <i class="fab fa-angular fa-lg text-danger me-3"></i>{" "}
                              <strong>1</strong>
                            </td>
                            <td>Albert Cook</td>
                            <td>188.9 km</td>
                          </tr>
                          <tr>
                            <td>
                              <i class="fab fa-react fa-lg text-info me-3"></i>{" "}
                              <strong>2</strong>
                            </td>
                            <td>Barry Hunter</td>
                            <td>182.1 km</td>
                          </tr>
                          <tr>
                            <td>
                              <i class="fab fa-vuejs fa-lg text-success me-3"></i>{" "}
                              <strong>3</strong>
                            </td>
                            <td>Trevor Baker</td>
                            <td>172.9 km</td>
                          </tr>
                          <tr>
                            <td>
                              <i class="fab fa-bootstrap fa-lg text-primary me-3"></i>{" "}
                              <strong>4</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>157.8 km</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-4 order-1 mb-4">
                <div class="card h-100">
                  <div class="card-header">
                    <div class="card-title mb-0">
                      <h5 class="m-0 me-2">Running </h5>
                      <small class="text-muted">Run Stats</small>
                    </div>
                  </div>

                  <div class="card-body">
                    <div class="table-responsive text-nowrap">
                      <table class="table card-table">
                        <thead class="table-active">
                          <tr>
                            <th>This Week</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                          <tr>
                            <td>
                              <h6>Avg Runs/Week</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {athleteRecentRunStats.count}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Avg Time/Week</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {getHours(athleteRecentRunStats.moving_time)}h{" "}
                              {getMin(athleteRecentRunStats.moving_time)}m
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Avg Distance/Week</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {athleteRecentRunStats.distance / 1000} km
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="table card-table">
                        <thead class="table-active">
                          <tr>
                            <th>All-Time</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                          <tr>
                            <td>
                              <h6>Runs</h6>
                            </td>
                            <td></td>

                            <td class="text-end">{athleteAllRunStats.count}</td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Time</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {getHours(athleteAllRunStats.moving_time)}h{" "}
                              {getMin(athleteAllRunStats.moving_time)}m
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Distance</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {Math.round(athleteAllRunStats.distance / 10) /
                                100}{" "}
                              km
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Elevation Gain</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {athleteAllRunStats.elevation_gain}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-4 order-2 mb-4">
                <div class="card h-100">
                  <div class="card-header d-flex align-items-center justify-content-between">
                    <div class="card-title mb-0">
                      <h5 class="m-0 me-2">Cycling</h5>
                      <small class="text-muted">Stats</small>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive text-nowrap">
                      <table class="table card-table">
                        <thead class="table-active">
                          <tr>
                            <th>This Week</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                          <tr>
                            <td>
                              <h6>Avg Rides/Week</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {athleteRecentCycleStats.count}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Avg Time/Week</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {getHours(athleteRecentCycleStats.moving_time)}h{" "}
                              {getMin(athleteRecentCycleStats.moving_time)}m
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Avg Distance/Week</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {Math.round(
                                athleteRecentCycleStats.distance / 10
                              ) / 100}{" "}
                              km
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="table card-table">
                        <thead class="table-active">
                          <tr>
                            <th>All-Time</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                          <tr>
                            <td>
                              <h6>Rides</h6>
                            </td>
                            <td></td>

                            <td class="text-end">
                              {athleteAllCycleStats.count}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Time</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {getHours(athleteAllCycleStats.moving_time)}h{" "}
                              {getMin(athleteAllCycleStats.moving_time)}m
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Distance</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {Math.round(athleteAllCycleStats.distance / 10) /
                                100}{" "}
                              km
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6>Elevation Gain</h6>
                            </td>
                            <td></td>
                            <td class="text-end">
                              {athleteAllCycleStats.elevation_gain} m
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="content-footer footer bg-footer-theme">
        <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
          <div class="mb-2 mb-md-0">
            {year}, made with ❤️
            {/* <a
              href="https://themeselection.com"
              target="_blank"
              class="footer-link fw-bolder"
            >
              ThemeSelection
            </a> */}
          </div>
          <div>
            <a
              href="https://themeselection.com/license/"
              class="footer-link me-4"
              target="_blank"
            >
              License
            </a>
            <a
              href="https://themeselection.com/"
              target="_blank"
              class="footer-link me-4"
            >
              More
            </a>
            <a
              href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
              target="_blank"
              class="footer-link me-4"
            >
              Documentation
            </a>
            <a
              href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
              target="_blank"
              class="footer-link me-4"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
      <div class="content-backdrop fade"></div>
    </div>
  );
}

export default Fitness;
