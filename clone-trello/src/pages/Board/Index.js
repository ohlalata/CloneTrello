import React from "react";
import { Outlet } from "react-router-dom";

const BoardPages = () => {
  return (
    <React.Fragment>
      <div>THIS IS BOARD PAGE</div>
      <Outlet />
    </React.Fragment>
  );
};

export default BoardPages;
