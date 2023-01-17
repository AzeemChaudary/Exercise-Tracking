import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Addtask = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("id");
  const [Date, setDate] = useState("");
  const [Type, setType] = useState("");
  const [Duration, setDuration] = useState("");
  const [Comments, setComments] = useState("");

  const addtask = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/workout", {
        email,
        Date,
        Type,
        Duration,
        Comments,
      })
      .then(function (response) {
        const data = response.data;
        console.log(data);
        if (data.success) {
          toast.success("Workout Added successfully");
          localStorage.setItem("token", data.token);
          navigate("/Profile");
        } else {
          toast.error("There has been some issue");
        }
      })
      .catch(function (error) {
        toast.error("There has been some issue");

        console.log(error);
      });
  };
  const navprof = () => {
    navigate("/Profile");
  };

  return (
    <div>
      <div className="container for-border">
        <div className="row my-5">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <center>
              {" "}
              <h1>Add Exercise</h1>
            </center>
            <form onSubmit={addtask} id="signup">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={Date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Enter date"
                />
              </div>
              <div className="form-group mt-2">
                <label>Type</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={Type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Enter Type"
                />
              </div>
              <div className="form-group mt-2">
                <label>Duration</label>
                <input
                  type="text"
                  value={Duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-control mt-2"
                  placeholder="Enter Duration"
                />
              </div>
              <div className="form-group mt-2">
                <label>Comments</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={Comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter Comments"
                />
              </div>
              <div className="row">
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary mt-2">
                    Add
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary mt-2" onClick={navprof}>
                    Back
                  </button>
                </div>
              </div>
            </form>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Addtask;
