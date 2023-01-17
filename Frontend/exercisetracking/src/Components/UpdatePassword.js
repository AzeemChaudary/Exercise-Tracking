import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("id");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const rstpswd = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/Resetpswd", {
        email,
        password,
        newPassword,
      })
      .then(function (response) {
        const data = response.data;
        if (data.success) {
          toast.success(data.message);
          navigate("/LogIn");
        }
        if (!data.success) {
          toast.error(data.message);
        }
      })
      .catch(function (error) {
        toast.error("There has been some issue");

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
            <h1>Reset Password</h1>
          </center>
          <form onSubmit={rstpswd} id="signup">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="text"
                className="form-control mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="text"
                className="form-control mt-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="row">
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary mt-2">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
