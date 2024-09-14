import React from "react";
import "./WhyChooseUs.css";
import image1 from "../../assets/appoinment.png";

const WhyChooseUs = () => {
  return (
    <div id="about" class="about-container container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-6 imgright">
            <img src={image1} alt="" />
          </div>
          <div class="col-md-6 aboutlefft">
            <h2>Why Choose Us</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit sed do ei
              usmod tempor incididunt.enim minim veniam.
            </p>
            <ul>
              <li>
                <i class="fa fa-check"></i> We have experienced doctors.
              </li>
              <li>
                <i class="fa fa-check"></i> Best medical service is our main
                goal.
              </li>
              <li>
                <i class="fa fa-check"></i> We have customer support center.
              </li>
              <li>
                <i class="fa fa-check"></i> Provide world class treatment.
              </li>
              <li>
                <i class="fa fa-check"></i> We have the modern labs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
