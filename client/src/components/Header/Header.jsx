import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <video className="header-video" autoPlay muted loop>
        <source src="/home-header-background.mp4" type="video/mp4" />
        hader video
      </video>
      <div className="header-overlay"></div>
      <div className="header-contents">
        <h1>LifeFlow Smart Blood Bank</h1>
        <button onClick={() => navigate("/LoginPage")}>Register Now</button>
      </div>
    </div>
  );
};

export default Header;
