import React from "react";
import { Footer, Navbar } from "../components";

const AboutPage = () => {
  const participants = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Brown",
  ];

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="text-center mb-5">About Our E-Commerce Project</h1>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">
                  UC E-Commerce Technology Course ITE403
                </h2>
                <p className="lead text-center mb-4">
                  Welcome to our e-commerce platform, developed as part of the
                  UC E-Commerce Technology course ITE403. This project showcases
                  our understanding of modern web development techniques and
                  e-commerce principles.
                </p>
                <p>
                  Our goal is to create a functional and user-friendly online
                  shopping experience, applying the concepts and technologies
                  we've learned throughout the course. We've focused on
                  implementing best practices in web design, user experience,
                  and e-commerce functionality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-center my-5">Meet Our Team</h2>
        <div className="row justify-content-center">
          {participants.map((participant, index) => (
            <div key={index} className="col-md-3 col-sm-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title text-center">{participant}</h5>
                  <p className="card-text text-center text-muted">
                    Project Participant
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col">
            <div className="card bg-light">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">
                  Project Highlights
                </h3>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    ✅ Responsive design for optimal viewing on all devices
                  </li>
                  <li className="mb-3">
                    ✅ Implementation of modern React and Bootstrap technologies
                  </li>
                  <li className="mb-3">
                    ✅ Focus on user experience and intuitive navigation
                  </li>
                  <li className="mb-3">
                    ✅ Integration of e-commerce best practices
                  </li>
                  <li>✅ Emphasis on performance and scalability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
