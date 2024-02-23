import React from "react";
import "./login.css";

export default function Login() {
  return (
    <div className="login-container" id="login-container">
      <h2 className="mt-5">Sign in with your Prolific username</h2>
      <form className="mt-5" id="login-form">
        <input
          type="text"
          id="username"
          placeholder="Your Prolific Username"
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
