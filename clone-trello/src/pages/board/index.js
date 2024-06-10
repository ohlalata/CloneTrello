import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navBar/index";

const BoardPages = () => {
  return (
    <React.Fragment>
      <NavBar />
      <Outlet />
    </React.Fragment>
  );
};

export default BoardPages;
