import React, { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";
import {googleLogin} from "../api/api"
import "../index.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Registration Successful!");
      navigate("/login"); 
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

 const login = async (e) => {
     e.preventDefault();
     try {
       const { data } = await googleLogin();
       console.log("Login Response:", data);
       localStorage.setItem("token", data.token);
       console.log("Token in localStorage:", localStorage.getItem("token"));
       alert("Sign in With Google Successful");
       navigate("/");
     } catch (err) {
       setError(err.response?.data?.msg || "OAuth has failed");
     }
   };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Register</button>
      <button type="button" onClick={login} className="google-login">
        Sign up with Google
      </button>
    </form>
  );
};

export default Register;