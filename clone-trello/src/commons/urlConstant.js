// const SERVICE_URL = "https://localhost:7201/api";

export default {
  base: `https://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api`,
  endpoint: {
    auth: {
      login: "/user/login",
      register: "/user/registration",
    },
    user: {
      getUserById: "/user/get/${id}",
      getAllUser:
        "/user/get-all?PageIndex=1&PageSize=50&email=${email}&name=${name}",
    },
    board: {
      getAllBoard: "/board/get-all",
      createBoard: "/board/create",
      getBoardByName:
        "/board/get-all?PageIndex=1&PageSize=50&name=${boardName}",
      updateBoardStatus: "/board/change-status/${id}?isActive=${isActive}",
      updateBoardName: "/board/update/${id}",
      updateBoardVisibility:
        "/board/change-visibility/${id}?isPublic=${isPublic}",
    },
    list: {
      getAllList: "/list/get-all?boardId=${boardId}",
      createList: "/list/create",
      updateList: "/list/update-name/${id}",
      archiveList: "/list/change-status/${id}?isActive=${isActive}",
    },
    card: {
      getAllCard: "/card/get-all?listId=${listId}",
      createCard: "/card/create",
      updateCard: "/card/update/${id}",
      archiveCard: "/card/change-status/${id}?isActive=${isActive}",
    },
    task: {
      getAllTask: "",
    },
    boardMember: {
      createBoardMember: "boardMember/create",
      getAllBoardMember: "/boardMember/get-all?boardId=${boardId}",
    },
    role: {
      getAllRole: "/role/get-all?PageIndex=1&PageSize=50&Id=${Id}&name=${name}",
    },
    comment: {
      getAllComment: "/comment/get-all?cardId=${cardId}",
    },
  },
};
