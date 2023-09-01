import React, { useEffect } from "react";
import { selectUser } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
const Dashboard = () => {
  const dispatch = useDispatch;
  useEffect(() => {});
  const user = useSelector(selectUser);
  console.log(user);
  return (
    <div>
      <h2>Welcome, {user ? user.username : "Guest"}!</h2>
      {/* You can add more dashboard content here */}
    </div>
  );
};

export default Dashboard;
