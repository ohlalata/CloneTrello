// const SERVICE_URL = "https://localhost:7201/api";

export default {
  base: `https://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api`,
  endpoint: {
    auth: {
      login: "/user/login",
      register: "/user/registration",
    },
    user: {
      getUserById: "/user/get/", // noi duoi id
      getAllUser: "/user/get-all",
      getUserByFilter: "/user/get-by-filter",
      getUserProfileByToken: "/user/get-user-profile",
      getUserByTodoId: "/user/get-by-todo-id",
    },
    board: {
      getAllBoard: "/board/get-all",
      getBoardByFilter: "/Board/get-by-filter",
      getBoardByMember: "/board/get-by-membership",
      createBoard: "/board/create",
      getBoardByName:
        "/board/get-all?PageIndex=1&PageSize=50&name=${boardName}",
      updateBoardStatus: "/board/change-status/",
      updateBoardName: "/board/update/", // noi duoi id
      updateBoardVisibility: "/board/change-visibility/", // noi duoi id
    },
    list: {
      getAllList: "/list/get-all",
      getListByFilter: "/List/get-by-filter",
      createList: "/list/create",
      updateList: "/list/update-name/", // noi duoi id
      archiveList: "/list/change-status/", // noi duoi id
      moveList: "/list/move-position/",
      swapList: "/list/swap-position/",
    },
    card: {
      getAllCard: "/card/get-all",
      getCardByFilter: "/card/get-by-filter",
      createCard: "/card/create",
      updateCard: "/card/update/", // noi duoi id
      archiveCard: "/card/change-status/", // noi duoi id
      moveCard: "/card/move-card/",
    },
    task: {
      createTask: "/task/create",
      getAllTask: "/task/get-all",
      getTaskByFilter: "/task/get-by-filter",
      updateTask: "/task/update/",
      checkTask: "/task/check/",
      inactiveTask: "/task/change-status/",
    },
    boardMember: {
      createBoardMember: "boardMember/create",
      getAllBoardMember: "/boardMember/get-all",
      getBoardMemberByFilter: "/boardMember/get-by-filter",
      inactiveBoardMember: "/boardMember/change-status/", // noi duoi id
      getCurrentBoardMemberRole: "/boardMember/get-current-role",
      updateBoardMember: "/boardMember/update/", // noi duoi id
    },
    role: {
      getAllRole: "/role/get-all",
      getAllRoleByFilter: "/role/get-by-filter",
    },
    comment: {
      getAllComment: "/comment/get-all",
      createComment: "/comment/create",
      deleteComment: "/comment/change-status/", // noi duoi id
      updateComment: "/comment/update/", // noi duoi id
    },
    CardMember: {
      createCardMember: "cardMember/create",
      getAllCardMember: "/cardMember/get-all?cardId=",
      inactiveCardMember: "/cardMember/change-status/",
    },
    toDo: {
      createTodo: "/toDo/create",
      getAllTodo: "/toDo/get-all",
      getTodoByFilter: "/toDo/get-by-filter",
      updateTodo: "/toDo/update/",
      inactiveTodo: "/toDo/change-status/",
    },
    label: {
      createLabel: "/label/create",
      getAllLabel: "/label/get-all",
      updateLabel: "/label/update/",
      deleteLabel: "/label/change-status/", // noi duoi id
    },
    cardLabel: {
      createCardLabel: "/cardLabel/create",
      getAllCardLabel: "/cardLabel/get-all",
      getCardLabelByFilter: "/cardLabel/get-by-filter",
      deleteCardLabel: "/cardLabel/change-status/", // noi duoi id
      updateCardLabel: "/cardLabel/update/", // noi duoi id
    },
    userFcmToken: {
      createUserFcmToken: "/userFcmToken/create",
      getAllUserFcmToken: "/userFcmToken/get-all",
      updateUserFcmToken: "/userFcmToken/update/",
      inactiveUserFcmToken: "/userFcmToken/change-status",
    },
    notification: {
      createNotification: "/notification/create",
      getAllNotification: "/notification/get-all",
      getNotificationByFilter: "/notification/get-by-filter",
      countNotification: "/notification/get-notification-count",
      readNotification: "/notification/change-status/",
    },
    cardActivity: {
      getAllCardActivity: "/cardActivity/get-all",
      createCardActivity: "/cardActivity/create",
    },
  },
};
