import React from "react";
import { Outlet } from "react-router-dom";
import "./style.scss";
import NavBar from "../../components/navBar/index";

const BoardPages = () => {
  return (
    <React.Fragment>
      <div>
        <NavBar />
        <Outlet />
      </div>
    </React.Fragment>
  );
};

export default BoardPages;
