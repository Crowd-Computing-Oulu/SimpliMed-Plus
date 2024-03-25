/*global chrome*/
import React from "react";
import "./login.css";
import { AppContext } from "../App";
import {
  redirect,
  useLoaderData,
  useActionData,
  Form,
  useNavigate,
} from "react-router-dom";
import { updateState } from "../utils";

// export function loader({ request }) {
//   return new URL(request.url).searchParams.get("message");
// }
// passing down the login prop to the action
export async function action({ request }, setState) {
  console.log("rqu in action is", request);

  const formData = await request.formData();
  const username = formData.get("username");
  // console.log("tets is", test);
  chrome.runtime.sendMessage(
    { action: "loginRequest", username },
    (response) => {
      console.log("response is", response);
      if (response.response === "Login Successful") {
        console.log("token exist");
        updateState(setState, response.state);
        return redirect("/");
      }
    }
  );

  // const password = formData.get("password");
  // const prevPathname =
  //   new URL(request.url).searchParams.get("redirectTo") || "/host";
  // try {
  //   // const data = await loginUser({ email, password });
  //   localStorage.setItem("isLoggedIn", true);
  //   setIsLoggedIn(true);
  //   return Object.defineProperty(redirect(prevPathname), "body", {
  //     value: true,
  //   });
  // } catch (err) {
  //   return err.message;
  // }
  return null;
}

export default function Login() {
  const errorMessage = useActionData();
  console.log("error message is", errorMessage);
  const navigation = useNavigate();
  // This message is for redirection to login page when need authentication
  // const message = useLoaderData();
  // const [username, setUsername] = React.useState("");
  const { handleLoginChange } = React.useContext(AppContext);
  function handleSubmit(e) {
    e.preventDefault();
    // handleLoginChange(username);
    // redirect("/main");
  }
  const btnSubmitting = {
    backgroundColor: "grey",
  };
  return (
    <div className="login-container" id="login-container">
      <h2 className="mt-5">Sign in with your Prolific username</h2>
      <Form
        method="post"
        className="mt-5 form"
        id="login-form"
        // onSubmit={handleSubmit}
      >
        <input
          type="username"
          id="username"
          // value={username}
          name="username"
          // onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Prolific Username"
          required
        />
        {/* Passing the new username to the app component  */}
        <button
          className="mt-4 p-2"
          style={navigation.state === "submitting" ? btnSubmitting : null}
          // disbaled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Logging In..." : "Log in"}
        </button>
      </Form>
    </div>
  );
}
