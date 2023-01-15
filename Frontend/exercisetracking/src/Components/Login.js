import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginfun=(e)=>{
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill all fields");
      
    }
    if (password.length < 8) {
      return toast.error("Enter Password more than 8 charachters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter valid email");
    }
    console.log(email,password,"emailpswd here");
    axios.post('http://localhost:8081/login', {
       email, password
    })
    .then(function (response) {
      
      const data = response.data;
      console.log(data)
      if(data.success) {
          toast.success("Logged in Successfully")
      }
      else {
          toast.error("There has been some issue")
      }
    })
    .catch(function (error) {
      console.log(error);
    });
navigate("/Profile");
}
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
  return (
    
      <section class="vh-100">
  <div className="container-fluid">
    <div className="row">
      <div className="col-sm-6 text-black">

        <div className="px-5 ms-xl-4">
          <i className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style={{color:" #709085"}}></i>
          <span className="h1 fw-bold mb-0">Logo</span>
        </div>

        <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

          <form style={{width: "23rem"}} method='post'  onSubmit={loginfun}>

            <h3 className="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Log in</h3>

            <div className="form-outline mb-4">
              <input type="email" id="form2Example18" className="form-control form-control-lg"  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
              <label className="form-label" htmlFor="form2Example18">Email address</label>
            </div>

            <div className="form-outline mb-4">
              <input type="password" id="form2Example28" className="form-control form-control-lg" value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
              <label className="form-label" htmlFor="form2Example28">Password</label>
            </div>

            <div className="pt-1 mb-4">
              <button className="btn btn-info btn-lg btn-block" type="submit">Login</button>
            </div>

            <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
            <p>Don't have an account? <a href="#!" className="link-info">Register here</a></p>

          </form>

        </div>

      </div>
      <div className="col-sm-6 px-0 d-none d-sm-block">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
          alt="Login image" className="w-100 vh-100" style={{objectFit: "cover" , objectPosition: "left"}} />
      </div>
    </div>
  </div>
</section>
    
  )
}

export default Login
