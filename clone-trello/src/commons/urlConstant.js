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
    },
    board: {
      getAllBoard: "/board/gets",
      getBoardByFilter: "/Board/get-by-filter",
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
    },
    card: {
      getAllCard: "/card/get-all",
      getCardByFilter: "/card/get-by-filter",
      createCard: "/card/create",
      updateCard: "/card/update/", // noi duoi id
      archiveCard: "/card/change-status/", // noi duoi id
    },
    task: {
      getAllTask: "",
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
    },
    CardMember: {
      createCardMember: "cardMember/create",
      getAllCardMember: "/cardMember/get-all?cardId=${cardId}",
      inactiveCardMember: "/cardMember/change-status/${id}?isActive=${isActive}",
    },
  },
};
