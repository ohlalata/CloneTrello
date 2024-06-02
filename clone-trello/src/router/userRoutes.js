import React from "react";
//Nav Bar
import NavBar from "../components/Navbar";

//Home section
import HomePages from "../pages/Home";

//Board section
import BoardPages from "../pages/Board";
import BoardContentPages from "../pages/BoardContent";

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
