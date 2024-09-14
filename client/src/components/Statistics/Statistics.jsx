import React from "react";
import "./Statistic.css";
import totalBloodDonations from "../../assets/totalBloodDonations.jpg";
import totalBloodBanks from "../../assets/totalBloodBanks.jpg";
import bloodStock from "../../assets/bloodStock.jpg";

const statisticsData = [
  {
    id: 1,
    title: "Total Blood Donations",
    description: "Number of blood donations collected across Pakistan.",
    value: 12000,
    date: "June 30, 2024",
    url: "https://www.redcross.org.pk",
    image: totalBloodDonations,
  },
  {
    id: 2,
    title: "Total Blood Banks",
    description: "Number of blood banks operating in Pakistan.",
    value: 150,
    date: "June 30, 2024",
    url: "https://www.sbp.org.pk",
    image: totalBloodBanks,
  },
  {
    id: 3,
    title: "Blood Stock Available",
    description: "Current available blood stock across all blood banks.",
    value: "3000 units",
    date: "June 30, 2024",
    url: "https://www.pbs.gov.pk",
    image: bloodStock,
  },
];

const Statistics = () => {
  return (
    <div className="statistic" id="stats">
      <section id="blog" className="bg-06">
        <div className="container">
          <div className="section-title row">
            <h2>Statistics</h2>
          </div>
          <div className="row">
            {statisticsData.map((stat) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={stat.id}>
                <a href={stat.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <article className="blog-sub">
                    <div className="blog-content">
                      <img src={stat.image} alt={stat.title} />
                    </div>
                    <div className="blog-content-section">
                      <div className="blog-content-title">
                        <h4>{stat.title}</h4>
                        <p>{stat.description}</p>
                        <h5>{stat.value}</h5>
                      </div>
                      <div className="blog-admin">
                        <ol>
                          <li>
                            <i className="far fa-user"></i> By Admin
                          </li>
                          <li>
                            <i className="far fa-calendar-alt"></i> {stat.date}
                          </li>
                        </ol>
                      </div>
                    </div>
                  </article>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
