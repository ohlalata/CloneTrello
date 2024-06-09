import React from "react";
//Nav Bar
import NavBar from "../components/navbar";

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
