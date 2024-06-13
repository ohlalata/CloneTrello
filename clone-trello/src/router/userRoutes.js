import React from "react";
//Nav Bar
import NavBar from "../components/navBar";
import NavbarBoardContent from "../components/navBarBoardContent";

//Home section
import HomePages from "../pages/home";

//Board section
import BoardPages from "../pages/board";
import BoardContentPages from "../pages/boardContent";

const UserRoutes = [
  {
    path: "/home",
    index: true,
    component: <HomePages />,
  },

  {
    path: "/navbar",
    component: <NavBar />,
  },
  {
    path: "/navbar-board-content",
    component: <NavbarBoardContent />,
  },
  {
    path: "/board",
    component: <BoardPages />,
    children: [
      {
        path: "board-content/:id",
        component: <BoardContentPages />,
      },
    ],
  },
];

export default UserRoutes;
