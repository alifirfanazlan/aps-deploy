import React from "react";
import { Grid } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Team_Navbar from "./Team_Navbar";
import { Avatar, IconButton } from "@mui/material";

function Player_DB() {
  const path = useLocation().pathname.split("/")[2];
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const players = await axios.get(
          `http://54.209.211.222:5001/account/sport/${path}`
        );
        setPlayers(players.data);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const athletes = players.filter(
    (player) => player.role === "athlete" && player.approved === true
  );

  let navigate = useNavigate();

  const token = Cookies.get("access_token");
  const datatoken = JSON.parse(token);
  return (
    <div>
      <Team_Navbar />

      <h1
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          fontWeight: "bold",
        }}
      >
        Player Database
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#37003c" }}>
              <TableCell style={{ color: "white" }}></TableCell>
              <TableCell style={{ color: "white" }} align="left">
                Name
              </TableCell>
              <TableCell align="left" style={{ color: "white" }}>
                Position
              </TableCell>
              <TableCell align="left" style={{ color: "white" }}>
                Age
              </TableCell>
              <TableCell align="left" style={{ color: "white" }}>
                Username
              </TableCell>
              <TableCell align="left" style={{ color: "white" }}>
                Wellness
              </TableCell>
              <TableCell align="left" style={{ color: "white" }}>
                Fitness
              </TableCell>
              {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {athletes.map((player) => (
              <TableRow
                key={player.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() => navigate(`/profile/${player._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    src={player.imgUrl}
                    style={{ height: "100px", width: "100px" }}
                  />
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                  {player.name}
                </TableCell>
                <TableCell align="left">{player.position}</TableCell>
                <TableCell align="left">{player.age}</TableCell>
                <TableCell align="left">{player.username}</TableCell>
                <TableCell align="left">Wellness</TableCell>
                <TableCell align="left">Fitness</TableCell>
                {/* <TableCell align="right">{row.protein}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Player_DB;
