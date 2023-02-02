import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { convertTime } from "../../utils/convertTime";
import Button from "@mui/material/Button";
import "./Schedule.css";

function Schedule() {
  const [listofEvent, setlistofEvent] = useState([]);
  const addEvent = useNavigate();

  useEffect(() => {
    axios.get("http://54.209.211.222:5000/event").then((response) => {
      setlistofEvent(response.data);
    });
  }, []);

  return (
    <div className="App">
      <Button
        className="addEventButton"
        variant="contained"
        onClick={() => {
          addEvent("addevent");
        }}
      >
        + Add Event
      </Button>

      {listofEvent.map((value, key) => {
        return (
          <div className="Event" key={key}>
            <div className="Date">{convertTime(value.date)} </div>
            <div className="Title">{value.title} </div>
            <div className="Location">{value.location} </div>
          </div>
        );
      })}
    </div>
  );
}

export default Schedule;
