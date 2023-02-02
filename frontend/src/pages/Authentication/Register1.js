import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "./Register.css";
import app from "../../firebase/firebase";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBIcon,
  MDBInputGroup,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import imageReg from "../../images/lcw (1).png";

function RegisterOthers() {
  const { currentUser } = useSelector((state) => state.user);
  const [profile, setProfile] = useState({});
  const [profileDetails, setProfileDetails] = useState({});
  const [inputs, setInputs] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imgPerc, setImgPerc] = useState(0);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [birthday, setBirthday] = useState("");
  const [height, setHeight] = useState("");
  const [sport, setSport] = useState("");
  const [contact, setContact] = useState("");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(profileDetails.imgUrl);
  const FILE_SIZE = 2000000; // 2MB in bytes
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

  // const initialValues = {
  //   name: '',
  //   date: '',
  //   gender: '',
  //   className: '',
  //   registrationCode: '',
  // }

  // const validationSchema = Yup.object({
  //   name: Yup.string().required("Name is required"),
  //   date: Yup.date().required("Date is required"),
  //   gender: Yup.string().required("Gender is required"),
  //   className: Yup.string().required("className is required"),
  //   registrationCode: Yup.string().required("Registration code is required"),
  // })

  const onSubmit = (values) => {
    console.log("Form data", values);
    // Perform submit action here
  };

  const [selectedRole, setSelectedRole] = useState("Manager");

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : console.log("Something wrong");
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
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    image && uploadFile(image, "imgUrl");
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://54.209.211.222:5001/account", {
        username: username,
        password: password,
        name: name,
        age: age,
        birthday: birthday,
        height: height,
        weight: weight,
        sport: sport,
        contact: contact,
        imgUrl: imageUrl,
        role: selectedRole,
      });

      navigate("/home");
    } catch (err) {
      console.log("Unable to register");
    }
  };

  return (
    <div>
      {/* <div classNameName="form-container">
        <form classNameName='loginForm'
        //</div>action="#"
        >
          <label>
            <input
              accept="image/*"
              id="profilePhoto"
              type="file"
              style={{ display: 'none' }}
              // onChange={handleImage}
              onChange={(event) => setImage(event.target.files[0])}

            />
            <Avatar
              //   src={currentUser.imgURL}
              sx={{ width: 75, height: 75, cursor: 'pointer' }}
            />
          </label>

          <h3>Name : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your full name..."

            onChange={(event) => setName(event.target.value)}
          />

          <h3>Age : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your age..."

            onChange={(event) => setAge(event.target.value)}
          />

          <h3>Birthday : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your birthday..."

            onChange={(event) => setBirthday(event.target.value)}
          />

          <h3>Height : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your height..."

            onChange={(event) => setHeight(event.target.value)}
          />

          <h3>Weight : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your weight..."

            onChange={(event) => setWeight(event.target.value)}
          />

          <h3>Sport : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your sport..."

            onChange={(event) => setSport(event.target.value)}
          />

          <h3>Contact : </h3>
          <input classNameName='auth_input'
            type="text"
            placeholder="Enter your contact..."

            onChange={(event) => setContact(event.target.value)}
          />

          <label htmlFor="select_role">Select a role:</label>
          <select classNameName='auth_role' id="select_role" value={selectedRole} onChange={handleChange}>
            <option value="Manager">Manager</option>
            <option value="Coach">Coach</option>
            <option value="Storekeeper">Storekeeper</option>
          </select>

          <button classNameName='btn btn-primary' onClick={handleSubmit}>Sign Up</button>
         
        </form>
      </div> */}

      {/* <MDBCard classNameName='text-black m-5' style={{borderRadius: '25px'}}>
  
    <MDBRow>
      <MDBCol md='10' lg='6' classNameName='order-2 order-lg-1 d-flex flex-column align-items-center'
      style={{backgroundColor: 'purple'}}>

        <h1 classNameName="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{color: 'white'}}>Sign up</h1>

        <div classNameName="d-flex flex-row align-items-center mb-4 ">
          <MDBIcon fas icon="user me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Username'>
          <input
            type='username'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your username'
            
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="envelope me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Password'>
          <input
            type='password'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your password'
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="lock me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Name'>
          <input
            type='username'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your full name'
            onChange={(event) => setName(event.target.value)}
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="key me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Age'>
          <input
            type='number'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your age'
            onChange={(event) => setAge(event.target.value)}
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="key me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Height'>
          <input
            type='number'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your height (cm)'
            onChange={(event) => setHeight(event.target.value)}
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="key me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Weight'>
          <input
            type='number'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your weight (kg)'
            onChange={(event) => setWeight(event.target.value)}
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="key me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Email'>
          <input
            type='email'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your email'
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        <div classNameName="d-flex flex-row align-items-center mb-4">
          <MDBIcon fas icon="key me-3" size='lg'/>
          <MDBValidationItem feedback='Please choose a username.' invalid 
          // classNameName='col-md-4'
          >
        <MDBInputGroup textBefore='Sport'>
          <input
            type='text'
            classNameName='form-control'
            id='validationCustomUsername'
            placeholder='Enter your sport'
            onChange={(event) => setSport(event.target.value)}
            required
          />
        </MDBInputGroup>
      </MDBValidationItem>
        </div>

        

        <MDBBtn classNameName='mb-4' size='lg'>Register</MDBBtn>

      </MDBCol>

      <MDBCol md='10' lg='6' xs='12' classNameName='order-1 order-lg-2 d-flex align-items-center'>
        <MDBCardImage src={imageReg} fluid style={{height:'600px',width:'600px'}}/>
      

      </MDBCol>

    </MDBRow>
  
</MDBCard> */}

      <div className="center">
        <div className="container">
          <label
            htmlFor="show"
            className="close-btn fas fa-times"
            title="close"
          />
          <div className="text">Register Form</div>
          <form action="#">
            <div className="data">
              <label>Email or Phone</label>
              <input type="text" required="" />
            </div>
            <div className="data">
              <label>Password</label>
              <input type="password" required="" />
            </div>
            <div className="forgot-pass">
              <a href="#">Forgot Password?</a>
            </div>
            <div className="btn">
              <div className="inner" />
              <button type="submit">login</button>
            </div>
            <div className="signup-link">
              Not a member? <a href="#">Signup now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterOthers;
