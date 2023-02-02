import React from "react";
import "./Team_Sheet.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Team_Navbar from "./Team_Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Player_Selection from "./Player_Selection";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";

function Team_Sheet() {
  // const [listofProfiles, setListofProfiles] = useState([]);
  const path = useLocation().pathname.split("/")[2];
  const [players, setPlayers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [openSelection, setOpenSelection] = useState(false);

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

  //   const handleSubmit = async () => {
  //     const playerIds = selectedProfiles.map(profile => profile._id);
  //     try {
  //         const response = await axios.post(`http://54.209.211.222:5001/team/sheet/${path}`, { players: playerIds });
  //         console.log(response);
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  const handleSubmit = async () => {
    const playerIds = selectedProfiles.map((profile) => ({
      userId: profile._id,
    }));
    try {
      const response = await axios.patch(
        `http://54.209.211.222:5001/team/sheet/${path}`,
        { players: playerIds }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  let navigate = useNavigate();

  const token = Cookies.get("access_token");
  const datatoken = JSON.parse(token);

  const toggleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <Team_Navbar />

      <MDBContainer>
        <MDBRow>
          <MDBCol lg={6}>
            <button className="btn btn-primary" onClick={toggleOpen}>
              Select players
            </button>
            {isOpen && (
              <Player_Selection
                players={players}
                setSelectedProfiles={setSelectedProfiles}
                setOpenSelection={setOpenSelection}
                setPlayers={setPlayers}
                selectedProfiles={selectedProfiles}
                setIsOpen={setIsOpen}
              />
            )}
          </MDBCol>

          <MDBCol lg={6}>
            <TableContainer
              component={Paper}
              sx={{ maxWidth: 650, minWidth: 400 }}
            >
              <Table
                sx={{ maxWidth: 650, minWidth: 400 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Position</TableCell>
                    <TableCell align="right">Age</TableCell>
                    <TableCell align="right">Username</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {players.map((player) => ( */}
                  {selectedProfiles.map((profile) => (
                    <TableRow
                      key={profile.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {profile.name}
                      </TableCell>
                      <TableCell align="right">{profile.position}</TableCell>
                      <TableCell align="right">{profile.age}</TableCell>
                      <TableCell align="right">{profile.username}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <button className="btn btn-success" onClick={handleSubmit}>
              {" "}
              Submit Sheet{" "}
            </button>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Team_Sheet;
