import React from 'react'
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [Track, setTrack] = useState([]);
  const tokenStr = localStorage.getItem("token");
  // console.log(tokenStr);
  const navedit = () => {
    navigate("/EditProfile");
  };
  const navtask = () => {
    navigate("/Addtask");
  };
  const navrst = () => {
    navigate("/ResetPassword");
  };
  axios
    .get("http://localhost:8081/Profile", {
      headers: { Authorization: `Bearer ${tokenStr}` },
    })
    .then(function (response) {
      const data = response.data;
      if (data.success) {
        setFname(data.data.fname);
        setLname(data.data.lname);
        setEmail(data.data.email);
        setTrack(data.data.track);
        localStorage.setItem("id", email);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  return (
    <div className="container for-border">
      <div className="row mt-5">
        <center>
          <h3>Dashboard</h3>
        </center>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-md-12">
          <h3>Profile</h3>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-md-4">
          <h5>
            {fname} {lname}
          </h5>
        </div>
        <div className="col-md-8">
          <h5>{email}</h5>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={navedit}>
            Edit Profile
          </button>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={navrst}>
            Reset Password
          </button>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-md-12">
          <h3>Tasks</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <h6>Date</h6>
        </div>
        <div className="col-md-3">
          <h6>Type</h6>
        </div>
        <div className="col-md-3">
          <h6>Duration</h6>
        </div>
        <div className="col-md-3">
          <h6> Comments</h6>
        </div>
      </div>
      {Track.map((inbox, index) => {
        return (
          <div>
            <div className="row" key={index}>
              <div className="col-md-3">{inbox.Date}</div>
              <div className="col-md-3">{inbox.Type}</div>
              <div className="col-md-3">{inbox.Duration}</div>
              <div className="col-md-3">{inbox.Comments}</div>
            </div>
          </div>
        );
      })}
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary mt-3 mb-3" onClick={navtask}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile
