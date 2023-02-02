import React from "react";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import {
  faBed,
  faCalendarDays,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./Inventory.css";
import { Grid } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Inventory() {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);

  const [selectedStore, setSelectedStore] = useState("Pusat Sukan UM");

  const handleChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const addItem = () => {
    axios
      .post("http://54.209.211.222:5001/inventory", {
        item_name: item,
        item_cost: cost,
        item_amount: amount,
        store: selectedStore,
      })
      .then((response) => {
        console.log("Item addition successful");
        if (response.data.error) {
          console.log(response.data.error);
          // } else {
          //   res.json("error")
          // const commentToAdd = {
          //   commentBody: newComment,
          //   // username: response.data.username,
          // };
          // setComments([...comments, commentToAdd]);
          // setNewComment("");
        }
      });
    toast.success("Item added successfully!", {
      position: toast.POSITION.TOP_CENTER,
    });
    window.location.reload();
  };

  return (
    <div className="Inventory">
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <header className="header">
            <Link to="/inventory">
              <button className="header_button">
                <span className="text">Inventory</span>
              </button>
            </Link>
            <Link to="/managebooking">
              <button className="header_button">
                <span className="text">Bookings</span>
              </button>
            </Link>
            <Link to="/inventorylist">
              <button className="header_button">
                <span className="text">Inventory List</span>
              </button>
            </Link>
          </header>
        </Grid>
      </Grid>

      <div className="NewItemInformation1">
        <label>Item :</label>
        <input
          className="inventory_input"
          type={"text"}
          onChange={(event) => {
            setItem(event.target.value);
          }}
        />
        <label>Amount :</label>
        <input
          className="inventory_input"
          type={"text"}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
        />
        <label>Item cost (RM):</label>
        <input
          className="inventory_input"
          type={"text"}
          onChange={(event) => {
            setCost(event.target.value);
          }}
        />

        <label>Store name:</label>
        {/* <select id="color-select" value={selectedStore} onChange={handleChange}>
        <option value="Pusat Sukan UM">Pusat Sukan UM</option>
          <option value="Stadium UM">Stadium UM</option>
          <option value="Tepi tasik">Tepi tasik</option>
        </select> */}

        <input
          className="inventory_input"
          onChange={(event) => {
            setSelectedStore(event.target.value);
          }}
        ></input>

        <button
          className="in_button btn btn-primary"
          onClick={() => {
            if (!item || !amount || !cost || !selectedStore) {
              toast.error("Please fill all fields", {
                position: toast.POSITION.TOP_CENTER,
              });
              return;
            }
            addItem();
          }}
        >
          {" "}
          Add to inventory{" "}
        </button>
      </div>
    </div>
  );
}

export default Inventory;
