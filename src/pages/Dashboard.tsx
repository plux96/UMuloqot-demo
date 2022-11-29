import React from "react";
import { useAppSelector } from "../app/hook";
import useAuth from "../hooks/useAuth";

function Dashboard() {
  useAuth();
  return <div>Dashboard</div>;
}

export default Dashboard;
