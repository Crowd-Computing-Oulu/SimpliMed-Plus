/*global chrome*/
import React from "react";
import "./login.css";
import {
  redirect,
  useActionData,
  Form,
  useNavigate,
  json,
} from "react-router-dom";
import { updateState } from "../utils";

// passing down the login prop to the action
export async function action({ request }, setState) {
  const formData = await request.formData();
  const openAIKey = formData.get("openAIKey");
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "loginRequest", openAIKey },
      (response) => {
        if (response.response === "Login Successful") {
          updateState(setState, response.state);
          resolve(redirect("/"));
        } else {
          console.log(
            "login failed on the login page",
            response.errorMessage,
            response.errorStatus
          );
          resolve(
            json({ error: response.errorMessage, status: response.errorStatus })
          );
        }
      }
    );
  });
}

export default function Login() {
  // action data shows the error message and status for the input
  const actionData = useActionData();
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
          type="openAIKey"
          id="username"
          name="openAIKey"
          placeholder="Your open AI Key"
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
      <div className="error-message text-danger">
        {actionData ? (
          <p>
            {actionData.status}: {actionData.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
