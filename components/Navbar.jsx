import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="row w-100">
          <div className="col-12 col-lg-1 d-flex align-items-center ml-0 p-0 pt-3">
            <a href="/">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/c/c8/Technological_University_of_the_Philippines_Seal.svg"
                alt="logo"
                style={{ width: "80px", height: "auto" }}
              />
            </a>
          </div>
          <div className="col-12 col-lg-11 d-flex align-items-center justify-content-end">
            <p className="m-0" style={{ color: 'cardinalred', fontFamily: 'Arial Black', fontSize: '25px', clear: 'inline-start' }}>
              TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES CAVITE CAMPUS
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
