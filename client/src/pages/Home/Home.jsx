import React, {useEffect}from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import Statistics from "../../components/Statistics/Statistics";
import Benifits from "../../components/Benifits/Benifits";
import Counter from "../../components/Counter/Counter";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import ContactUs from "../../components/ContactUs/ContactUs";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      navigate("/DonorDashboard");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <Statistics />
      <Benifits />
      {/* <Counter /> */}
      <WhyChooseUs />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
