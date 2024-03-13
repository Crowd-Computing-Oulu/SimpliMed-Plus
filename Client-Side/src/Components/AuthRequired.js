/*global chrome*/

import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthRequired() {
  const accessToken = chrome.storage.local.get("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
