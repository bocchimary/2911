import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();

    // Send a POST request to your Express.js server for authentication
    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Redirect to the protected page upon successful login
      router.push("/dashboard/admin");
    } else {
      // Handle login failure, e.g., show an error message
      console.error("Login failed");
    }
  };
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Personnel Key Access</div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="password">Key ID</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-danger mt-3 mx-auto"
                  values="Login"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
