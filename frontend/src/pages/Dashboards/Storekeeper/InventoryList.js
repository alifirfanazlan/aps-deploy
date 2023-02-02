import React from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditItem from "./EditItem";
import { CSVLink } from "react-csv";

function InventoryList() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [storeDropdown, setStoreDropdown] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await axios.get("http://54.209.211.222:5000/inventory");
        setItems(items.data);
        setStoreDropdown(
          Array.from(new Set(items.data.map((item) => item.store)))
        );
      } catch (err) {}
    };
    fetchData();
  }, [itemId]);

  const handleChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const deleteItem = (itemid) => {
    axios
      .delete(`http://54.209.211.222:5000/inventory/${itemid}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.error) {
          console.log(response.data.error);
        }
      });
  };

  return (
    <div>
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

      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          marginTop: "10px",
        }}
      >
        Inventory List
      </h1>

      <Grid container style={{ display: "flex", justifyContent: "center" }}>
        <Grid item xl={6}>
          <label>Select Store : </label>
          <select
            placeholder="Select store"
            value={selectedStore}
            // className='store-select'
            className="auth_input"
            onChange={handleChange}
          >
            {storeDropdown.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
            {/* {storeDropdown.map(store => (
        <option key={store} value={store}>{store}</option>
    ))} */}
          </select>
        </Grid>
      </Grid>

      {/* <CSVLink data={items} className='btn btn-success'>Export Table</CSVLink> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Store</TableCell>
              <TableCell align="center">Cost (per item)</TableCell>
              <TableCell align="center">Actions</TableCell>
              {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter((item) => !selectedStore || item.store === selectedStore)
              .map((item) => (
                <TableRow
                  key={item._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.item_name}
                  </TableCell>
                  <TableCell align="center">{item.item_amount}</TableCell>
                  <TableCell align="center">{item.store}</TableCell>
                  <TableCell align="center">RM{item.item_cost}</TableCell>
                  <TableCell align="center">
                    <button
                      className="btn btn-primary"
                      style={{ marginLeft: "3px", marginTop: "2px" }}
                      onClick={() => {
                        setOpen(true);
                        setSelectedItem(item);
                      }}
                    >
                      Edit
                    </button>
                    {/* {open && selectedItem._id === item._id && <EditItem setOpen={setOpen} item={selectedItem} />} */}

                    <button
                      className="btn btn-danger"
                      style={{ marginLeft: "3px", marginTop: "2px" }}
                      onClick={() => {
                        deleteItem(item._id);
                        setItemId(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </TableCell>

                  {/* <TableCell align="right">{row.protein}</TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {open && (
        <EditItem
          setOpen={setOpen}
          item={selectedItem}
          // itemId={itemId} setItemId={setItemId}
          setItems={setItems}
        />
      )}

      {/* {open && <EditItem setOpen={setOpen} item={item} />} */}
    </div>
  );
}

export default InventoryList;
