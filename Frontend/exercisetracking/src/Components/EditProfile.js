import React from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  //   const tokenStr = localStorage.getItem("token");
  //   const [email, setEmail] = useState("");
  const [newfname, setNewfname] = useState("");
  const [newlname, setNewlname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const email = localStorage.getItem("id");
  const update = (e) => {
    e.preventDefault();
    const validateEmail = (newEmail) => {
      return String(newEmail)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!newfname || !newlname || !newEmail) {
      return toast.error("Please fill all fields");
    }
    if (!validateEmail(newEmail)) {
      return toast.error("Please enter valid email");
    }
    axios
      .post("http://localhost:8081/EditProfile", {
        email,
        newfname,
        newlname,
        newEmail,
      })
      .then(function (response) {
        const data = response.data;
        console.log(data);
        if (data.success) {
          toast.success(data.message);
          localStorage.setItem("token", data.token);
          navigate("/Profile");
        } else {
          toast.error("There has been some issue");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="container for-border">
      <div className="row my-5">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <center>
            {" "}
            <h1>Edit Profile</h1>
          </center>
          <form onSubmit={update} id="signup">
            <div className="form-group">
              <label>New First Name</label>
              <input
                type="text"
                className="form-control mt-2"
                value={newfname}
                onChange={(e) => setNewfname(e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div className="form-group mt-2">
              <label>New Last Name</label>
              <input
                type="text"
                className="form-control mt-2"
                value={newlname}
                onChange={(e) => setNewlname(e.target.value)}
                placeholder="Last Name"
              />
            </div>
            <div className="form-group mt-2">
              <label>New Email</label>
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="form-control mt-2"
                placeholder="Enter email"
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Update
            </button>
          </form>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default EditProfile;
