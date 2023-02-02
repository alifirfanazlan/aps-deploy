// import { motion } from "framer-motion";
import React, { useState, useContext, useEffect } from "react";
import { Avatar } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import Cookies from "js-cookie";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "./Register.css";
import app from "../../firebase/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { toast } from "react-toastify";

import "./PersonalInfo.css";

const PersonalInfo = ({ formData, setFormData, page, setPage, x, setX }) => {
  let navigate = useNavigate();
  const [image, setImage] = useState(undefined);
  const [avatarLogo, setAvatarLogo] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  // const [imgPerc, setImgPerc] = useState(0);
  // const [imageUrl, setImageUrl] = useState("");

  // const uploadFile = (file, urlType) => {
  //     const storage = getStorage(app);
  //     const fileName = new Date().getTime() + file.name;
  //     const storageRef = ref(storage, fileName);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //             const progress =
  //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //             urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : console.log("Something wrong");
  //             switch (snapshot.state) {
  //                 case "paused":
  //                     console.log("Upload is paused");
  //                     break;
  //                 case "running":
  //                     console.log("Upload is running");
  //                     break;
  //                 default:
  //                     break;
  //             }
  //         },
  //         (error) => { },
  //         () => {
  //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //                 // setImageUrl(downloadURL)
  //                 // setFormData.imageUrl(downloadURL)
  //                 setFormData({ ...formData, imgUrl: downloadURL })

  //             });
  //         }
  //     );
  // };

  const handleChange = (event) => {
    setAvatarLogo(URL.createObjectURL(event.target.files[0]));
  };

  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    // const storageRef = storage.ref(fileName);
    const storageRef = ref(storage, fileName);
    // const uploadTask = storageRef.put(file);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        // async () => {
        //     const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        //     resolve(downloadURL);
        // }
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // setImageUrl(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // useEffect(() => {
  //     image && uploadFile(image, "imgUrl");
  // }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    switch (formData.role) {
      case "coach":
        if (
          image === "" ||
          formData.name === "" ||
          formData.age === "" ||
          formData.gender === "" ||
          formData.state === "" ||
          formData.contact === "" ||
          formData.sport === "" ||
          formData.email === ""
        ) {
          toast.error("Please fill in all the fields!", {
            position: toast.POSITION.TOP_CENTER,
          });
          return;
        }
        break;
      case "athlete":
        if (
          image === "" ||
          formData.name === "" ||
          formData.age === "" ||
          formData.birthday === "" ||
          formData.height === "" ||
          formData.weight === "" ||
          formData.gender === "" ||
          formData.state === "" ||
          formData.contact === "" ||
          formData.sport === "" ||
          formData.email === ""
        ) {
          toast.error("Please fill in all the fields!", {
            position: toast.POSITION.TOP_CENTER,
          });
          return;
        }
        break;
      case "manager":
        if (
          image === "" ||
          formData.name === "" ||
          formData.age === "" ||
          formData.gender === "" ||
          formData.state === "" ||
          formData.contact === "" ||
          formData.sport === "" ||
          formData.email === ""
        ) {
          toast.error("Please fill in all the fields!", {
            position: toast.POSITION.TOP_CENTER,
          });
          return;
        }
        break;
      case "storekeeper":
        if (
          image === "" ||
          formData.name === "" ||
          formData.age === "" ||
          formData.gender === "" ||
          formData.state === "" ||
          formData.contact === "" ||
          formData.email === "" ||
          formData.store === ""
        ) {
          toast.error("Please fill in all the fields!", {
            position: toast.POSITION.TOP_CENTER,
          });
          return;
        }
        break;

      default:
        break;
    }

    const imageUrl = image && (await uploadFile(image, "imgUrl"));

    try {
      const res = await axios.post("http://54.209.211.222:5000/account", {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        age: formData.age,
        birthday: formData.birthday,
        height: formData.height,
        weight: formData.weight,
        sport: formData.sport,
        email: formData.email,
        gender: formData.gender,
        state: formData.state,
        imgUrl: imageUrl,
        role: formData.role,
        contact: formData.contact,
        approved: false,
      });

      const token = JSON.stringify(res.data);
      Cookies.set("access_token", token, { expires: 7 });
      navigate("/home");
    } catch (err) {
      console.log("Unable to register");
    }
  };
  return (
    <div>
      <div class="login-box-container">
        <div class="login-box">
          <h2>Personal Info</h2>

          <div className="signup_form">
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                accept="image/*"
                id="profilePhoto"
                type="file"
                style={{ display: "none" }}
                // onChange={(event) => setImage(event.target.files[0])}
                onChange={(event) => {
                  handleChange(event);
                  setImage(event.target.files[0]);
                }}
              />
              <Avatar
                src={avatarLogo}
                sx={{ width: 100, height: 100, cursor: "pointer" }}
              />
            </label>

            <div class="row" style={{ marginTop: "50px" }}>
              <div class="col-lg-6 col-xs-12">
                <div class="user-box">
                  <input
                    className="signup_input"
                    type="text"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <label>Full Name : </label>
                </div>

                <div class="user-box">
                  <input
                    className="signup_input"
                    type="number"
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                  <label>Age: </label>
                </div>

                {formData.role === "storekeeper" ? (
                  <>
                    <div class="user-box">
                      <select
                        className="signup_input"
                        placeholder="Store"
                        onChange={(e) =>
                          setFormData({ ...formData, store: e.target.value })
                        }
                      >
                        <option
                          value="Pusat Sukan UM"
                          style={{ color: "black" }}
                        >
                          Pusat Sukan UM
                        </option>
                        <option
                          value="Tasik Universiti"
                          style={{ color: "black" }}
                        >
                          Tasik Universiti
                        </option>
                      </select>
                      <label>Store : </label>
                    </div>
                  </>
                ) : (
                  <> </>
                )}

                <div class="user-box">
                  <input
                    className="signup_input"
                    type="number"
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                  />
                  <label>Contact Number: </label>
                </div>

                {formData.role === "athlete" ? (
                  <>
                    <div class="user-box">
                      <input
                        className="signup_input"
                        type="date"
                        onChange={(e) =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                      />
                      <label>Birthday : </label>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {formData.role === "athlete" ? (
                  <>
                    <div class="user-box">
                      <input
                        className="signup_input"
                        type="number"
                        onChange={(e) =>
                          setFormData({ ...formData, height: e.target.value })
                        }
                      />
                      <label>Height : </label>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div class="col-lg-6 col-xs-12">
                <div class="user-box">
                  <select
                    className="signup_input"
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male" style={{ color: "black" }}>
                      Male
                    </option>
                    <option value="Female" style={{ color: "black" }}>
                      Female
                    </option>
                  </select>
                  <label>Gender : </label>
                </div>

                {formData.role !== "storekeeper" ? (
                  <>
                    <div class="user-box">
                      <input
                        className="signup_input"
                        type="text"
                        onChange={(e) =>
                          setFormData({ ...formData, sport: e.target.value })
                        }
                      />
                      <label>Sport : </label>
                    </div>
                  </>
                ) : (
                  <> </>
                )}

                <div class="user-box">
                  <input
                    className="signup_input"
                    type="text"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <label>Email : </label>
                </div>

                <div class="user-box">
                  <select
                    className="signup_input"
                    placeholder="State"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  >
                    <option value="">Select State</option>
                    <option value="Kelantan" style={{ color: "black" }}>
                      Kelantan
                    </option>
                    <option value="Johor" style={{ color: "black" }}>
                      Johor
                    </option>
                    <option value="Melaka" style={{ color: "black" }}>
                      Melaka
                    </option>
                    <option value="Negeri Sembilan" style={{ color: "black" }}>
                      Negeri Sembilan
                    </option>
                    <option value="Selangor" style={{ color: "black" }}>
                      Selangor
                    </option>
                    <option value="WP Kuala Lumpur" style={{ color: "black" }}>
                      WP Kuala Lumpur
                    </option>
                    <option value="Perak" style={{ color: "black" }}>
                      Perak
                    </option>
                    <option value="Pulau Pinang" style={{ color: "black" }}>
                      Pulau Pinang
                    </option>
                    <option value="Kedah" style={{ color: "black" }}>
                      Kedah
                    </option>
                    <option value="Perlis" style={{ color: "black" }}>
                      Perlis
                    </option>
                    <option value="Terengganu" style={{ color: "black" }}>
                      Terengganu
                    </option>
                    <option value="Pahang" style={{ color: "black" }}>
                      Pahang
                    </option>
                    <option value="Sabah" style={{ color: "black" }}>
                      Sabah
                    </option>
                    <option value="Sarawak" style={{ color: "black" }}>
                      Sarawak
                    </option>
                  </select>
                  <label>State : </label>
                </div>

                {formData.role === "athlete" ? (
                  <>
                    <div class="user-box">
                      <input
                        className="signup_input"
                        type="number"
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                      />
                      <label>Weight : </label>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <button
                className="previous_button"
                // style={{width: '50%'}}
                onClick={() => {
                  setPage(0);
                  setX(-1000);
                }}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Previous
              </button>

              <button className="signup_button" onClick={handleSubmit}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
