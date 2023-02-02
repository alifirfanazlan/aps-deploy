import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { dislike, fetchSuccess, like } from "../../redux/videoSlice";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import "./Video.css";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { display } from "@mui/system";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

function Video() {
  let navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);

  // const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];
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

  const [user, setUser] = useState({});
  const [video, setVideo] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          `http://54.209.211.222:5000/videos/find/${path}`
        );
        const channelRes = await axios.get(
          `http://54.209.211.222:5000/account/find/${videoRes.data.userId}`
        );
        const addViews = await axios.put(
          `http://54.209.211.222:5000/videos/view/${path}`
        );

        setUser(channelRes.data);
        setVideo(videoRes.data);

        console.log(addViews);
      } catch (err) {}
    };
    fetchData();
  }, [path]); // Note the empty array here

  const deleteFileFromStorage = async (url) => {
    const storage = getStorage();
    // const fileName = url.split('/').pop();
    // console.log(fileName)

    // Create a reference to the file to delete
    const desertRef = ref(storage, url);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  const [title, setTitle] = useState(video.title);
  const [desc, setDesc] = useState(video.desc);

  const handleEdit = async () => {
    await axios.put(`http://54.209.211.222:5000/videos/${path}`, {
      title: title,
      desc: desc,
    });
    setOpenEdit(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    const previousVideoUrl = video.videoUrl;
    // let videoUrl = previousVideoUrl;
    await deleteFileFromStorage(previousVideoUrl);
    await axios.delete(`http://54.209.211.222:5000/videos/${path}`);
    navigate(`/profile/${datatoken._id}`);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px",
            width: 400,
            background: "white",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Delete
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this video?
          </Typography>
          <div>
            <button className="btn btn-primary m-2" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn btn-danger m-2" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px",
            width: 400,
            background: "white",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Video
          </Typography>
          <label>Title</label>
          <input
            defaultValue={video.title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label>Description</label>
          <textarea
            rows={3}
            defaultValue={video.desc}
            onChange={(event) => setDesc(event.target.value)}
          />
          <div>
            <button className="btn btn-primary m-2" onClick={handleEdit}>
              Submit
            </button>
            <button className="btn btn-danger m-2" onClick={handleCloseEdit}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>

      <div className="video_container">
        <div className="video_content">
          <div className="video_wrapper">
            <video className="video_videoFrame" src={video.videoUrl} controls />
          </div>

          <div className="video_details">
            {/* <span className='video_info'>
              {video.views} views • {format(video.createdAt)}
            </span> */}
          </div>
          <h1 className="video_title">{video.title}</h1>
          <span className="video_info" style={{ marginLeft: "12%" }}>
            {format(video.createdAt)}
          </span>

          <button
            className="video_buttons btn btn-success"
            onClick={handleOpenEdit}
          >
            <EditIcon />
            Edit
          </button>
          <button className="video_buttons btn btn-danger" onClick={handleOpen}>
            <DeleteIcon />
            Delete
          </button>
          <hr className="hr" />
          <div className="video_channel">
            <div className="video_channelInfo">
              <img className="video_image" src={user.imgUrl} />
              <div>
                <span className="video_channelName">{user.name}</span>
                <p className="video_description">{video.desc}</p>
              </div>
            </div>
          </div>
          {/* <Hr /> */}
          {/* <Comments videoId={currentVideo._id} /> */}
        </div>
      </div>
    </div>
  );
}

export default Video;
