/*global chrome*/
import React from "react";
import "./login.css";
import { redirect, useActionData, Form, useNavigate } from "react-router-dom";
import { updateState } from "../utils";

// passing down the login prop to the action
export async function action({ request }, setState) {
  const formData = await request.formData();
  const username = formData.get("username");
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "loginRequest", username },
      (response) => {
        if (response.response === "Login Successful") {
          updateState(setState, response.state);
          resolve(redirect("/"));
        } else {
          reject("unsuccessful login");
        }
      }
    );
  });
}

export default function Login() {
  const errorMessage = useActionData();
  console.log("error message is", errorMessage);
  const navigation = useNavigate();

  const btnSubmitting = {
    backgroundColor: "grey",
  };
  return (
    <div className="login-container" id="login-container">
      <h2 className="mt-5">Sign in with your username</h2>
      <Form
        method="post"
        className="mt-5 form"
        id="login-form"
        // onSubmit={handleSubmit}
      >
        <input
          type="username"
          id="username"
          name="username"
          placeholder="Your Username"
          required
        />
        {/* Passing the new username to the app component  */}
        <button
          className="mt-2 p-2"
          style={navigation.state === "submitting" ? btnSubmitting : null}
        >
          {navigation.state === "submitting" ? "Logging In..." : "Log in"}
        </button>
      </Form>
    </div>
  );
}
