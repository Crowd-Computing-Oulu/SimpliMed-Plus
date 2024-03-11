import React, { useContext } from "react";
import "./login.css";
import AppContext from "../App";
export default function Login() {
  const [username, setUsername] = React.useState("");
  const handleLogin = useContext(AppContext).handleLoginChange;
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
