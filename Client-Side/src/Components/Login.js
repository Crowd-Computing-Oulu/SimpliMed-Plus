/*global chrome*/

import React from "react";
import "./login.css";

export default function Login({ onStateChange }) {
  const [username, setUsername] = React.useState("");
  function submitUsername() {
    // the callback function provided by the parent
    // chrome.runtime.sendMessage({ action: "login", username });
    onStateChange(username);
  }
  return (
    <div className="login-container" id="login-container">
      <h2 className="mt-5">Sign in with your Prolific username</h2>
      <form
        className="mt-5"
        id="login-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Prolific Username"
          required
        />
        <button onClick={submitUsername} type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
