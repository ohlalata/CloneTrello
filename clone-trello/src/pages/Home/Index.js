import React from "react";
import { Outlet } from "react-router-dom";

const HomePages = () => {
  return (
    <React.Fragment>
      <div>HEHHEE</div>
      <div>AAAAAAAAAA</div>
      <Outlet />
    </React.Fragment>
  );
};

export default HomePages;
