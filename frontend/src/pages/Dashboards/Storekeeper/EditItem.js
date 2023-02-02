import React from "react";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import axios from "axios";
import { Grid } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";

function EditItem({ setOpen, item, setItems }) {
  const [formData, setFormData] = useState({
    item_name: item.item_name,
    item_amount: item.item_amount,
    item_cost: item.item_cost,
    store: item.store,
    // ...
  });

  const [selectedStore, setSelectedStore] = useState("Pusat Sukan UM");

  const handleChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const fetchData = async () => {
    try {
      const items = await axios.get("http://54.209.211.222:5000/inventory");
      setItems(items.data);
    } catch (err) {}
  };

  const addItem = (itemid) => {
    axios
      .patch(`http://54.209.211.222:5000/inventory/${itemid}`, {
        item_name: formData.item_name,
        item_cost: formData.item_cost,
        item_amount: formData.item_amount,
        store: formData.store,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.error) {
          console.log(response.data.error);
        }
        fetchData();
      });
  };

  return (
    <div className="Inventory">
      <div className="NewItemInformation1">
        <label>Item :</label>
        <input
          className="inventory_input"
          type={"text"}
          value={formData.item_name}
          onChange={(event) => {
            setFormData({ ...formData, item_name: event.target.value });
          }}
        />
        <label>Amount :</label>
        <input
          className="inventory_input"
          type={"number"}
          value={formData.item_amount}
          onChange={(event) => {
            setFormData({ ...formData, item_amount: event.target.value });
          }}
        />
        <label>Item cost :</label>
        <input
          className="inventory_input"
          type={"number"}
          value={formData.item_cost}
          onChange={(event) => {
            setFormData({ ...formData, item_cost: event.target.value });
          }}
        />

        <label htmlFor="color-select">Select a store:</label>
        <select
          id="color-select"
          value={formData.store}
          // onChange={handleChange}
          onChange={(event) => {
            setFormData({ ...formData, store: event.target.value });
          }}
        >
          <option value="Pusat Sukan UM">Pusat Sukan UM</option>
          <option value="Stadium UM">Stadium UM</option>
          <option value="Tepi tasik">Tepi tasik</option>
        </select>

        <button
          className="in_button btn btn-primary"
          onClick={
            () => {
              addItem(item._id);
              setOpen(false);
            }
            // addItem
          }
        >
          {" "}
          Submit{" "}
        </button>
        <button className="btn btn-danger" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

export default EditItem;
