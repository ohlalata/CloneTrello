import React, { Children } from "react";

//Nav Bar
import NavBar from "../commons/navbar/Index";

//Home section
import HomePages from "../pages/Home/Index";

//Board section
import BoardPages from "../pages/Board/Index";

//AuthPages
import LoginPages from "../pages/Login/Index";
import SignupPages from "../pages/Signup/Index";

const UserRoutes = [
  {
    path: "home",
    component: <HomePages />,
    children: [
      {
        path: "listboard",
        component: <SignupPages />, // example
      },
      {
        path: "about",
        component: <p>2222</p>,
      },
      {
        path: "navbar",
        component: <NavBar />,
      },
    ],
  },
  {
    path: "board",
    component: <BoardPages />, //list children: list board in screen board, member, table, calender, setting (...)
    children: [
      {
        path: "dashboard",
        component: <LoginPages />,
      },
      {
        path: "aboutttt",
        component: <p>2222</p>,
      },
    ],
  },
];

const AuthRoutes = [
  { path: "/login", component: <LoginPages /> },
  { path: "/signup", component: <SignupPages /> },
];

export { UserRoutes, AuthRoutes };
