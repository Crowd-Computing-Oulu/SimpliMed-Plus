import React from "react";
import "./login.css";

export default function Login({ handleLogin }) {
  const [username, setUsername] = React.useState("");

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
        {/* Passing the new username to the app component  */}
        <button onClick={() => handleLogin(username)} type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
