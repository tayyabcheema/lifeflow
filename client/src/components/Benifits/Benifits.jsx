import React from "react";
import heart from "../../assets/heart.png";
import redBloodCells from "../../assets/redBloodCells.png";
import calariesBurn from "../../assets/calariesBurn.png";
import bloodDonation from "../../assets/bloodDonation.png";
import "./Benifits.css";

const benefitsData = [
  {
    id: 1,
    title: "Improves Heart Health",
    description: "Regular blood donation helps in reducing the risk of heart diseases.",
    date: "June 30, 2024",
    url: "https://www.heart.org/en/healthy-living/healthy-lifestyle/mental-health-and-wellbeing/5-surprising-health-benefits-of-donating-blood",
    image: heart,
  },
  {
    id: 2,
    title: "Enhances Red Blood Cells",
    description: "Blood donation stimulates the production of new red blood cells.",
    date: "June 30, 2024",
    url: "https://www.redcrossblood.org/donate-blood/blood-donation-process/why-donate-blood/blood-donation-benefits.html",
    image: redBloodCells,
  },
  {
    id: 3,
    title: "Burns Calories",
    description: "Donating blood can burn up to 650 calories per donation.",
    date: "June 30, 2024",
    url: "https://www.healthline.com/health/benefits-of-donating-blood",
    image: calariesBurn,
  },
  {
    id: 4,
    title: "Helps Save Lives",
    description: "Each blood donation can save up to three lives.",
    date: "June 30, 2024",
    url: "https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability",
    image: bloodDonation,
  },
];

const Benefits = () => {
  return (
    <div className="benefit-main" id="benefits">
      <h1>Benefits</h1>
      <section className="bg-04">
        <div className="benefit-container">
          {benefitsData.map((benefit) => (
            <div className="card" key={benefit.id}>
              <a href={benefit.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                <div className="image-blog">
                  <img src={benefit.image} alt={benefit.title} />
                  <div className="date">
                    {benefit.date.split(' ')[1]} <span>{benefit.date.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="content">
                  <span>Health</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                  <a href={benefit.url} target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Benefits;
