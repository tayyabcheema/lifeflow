import React, { useState } from "react";
import emailjs from 'emailjs-com';
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_6jz87fh',  // replace 'your_service_id' with your actual EmailJS service ID
      'template_nfzckml',  // replace 'your_template_id' with your actual EmailJS template ID
      e.target,
      'G5RudhMn4vB2raSba'  // replace 'your_user_id' with your actual EmailJS user ID
    ).then((result) => {
      console.log(result.text);
      alert('Message successfully sent!');
      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    }, (error) => {
      console.log(error.text);
      alert('Failed to send the message, please try again.');
    });
  };

  return (
    <section className="contact" id="contactus">
      <div className="content">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need assistance, please reach out to us. We are here to help you make the most of your efforts to save lives through blood donation.
        </p>
      </div>
      <div className="container">
        <div className="contactInfo">
          <div className="box">
            <div className="icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
            </div>
            <div className="text">
              <h3>Address</h3>
              <p>123 Donation Ave, Saving Lives City, ST 12345</p>
            </div>
          </div>
          <div className="box">
            <div className="icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 1 .76-.09c1.688.842 3.304 2.21 4.902 4.4C10.35 7.49 11.79 9.91 13.08 11.37a.678.678 0 0 1-.106 1.005l-2.24 1.825a1.745 1.745 0 0 1-.934.3c-.136 0-.489-.05-.936-.228a18.552 18.552 0 0 1-2.692-1.25 18.678 18.678 0 0 1-2.25-1.516c-.492-.474-.961-.928-1.414-1.362S3.767 9.6 3.35 9.126a18.466 18.466 0 0 1-1.6-2.713 4.108 4.108 0 0 1-.234-.935c0-.078.003-.153.009-.23a1.71 1.71 0 0 1 .36-.899l1.76-1.902a.678.678 0 0 1 .97-.023c.297.316.572.651.918 1.073.219.27.438.547.657.834.363-.514.706-.999 1.03-1.462.42-.603.733-1.1.978-1.48.243-.376.368-.632.315-.802z" />
              </svg>
            </div>
            <div className="text">
              <h3>Phone</h3>
              <p>+1 234 567 8900</p>
            </div>
          </div>
          <div className="box">
            <div className="icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2 0v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z" />
              </svg>
            </div>
            <div className="text">
              <h3>Email</h3>
              <p>support@bloodbank.org</p>
            </div>
          </div>
        </div>
        <div className="contactForm">
          <form onSubmit={sendEmail}>
            <h2>Send Message</h2>
            <div className="inputBox">
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <span>Full Name</span>
            </div>
            <div className="inputBox">
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              <span>Email</span>
            </div>
            <div className="inputBox">
              <textarea name="message" value={formData.message} onChange={handleChange} required></textarea>
              <span>Type Your Message...</span>
            </div>
            <div className="inputBox">
              <input type="submit" value="Send" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
