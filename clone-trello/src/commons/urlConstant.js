const SERVICE_URL = "https://localhost:7201/api";

export default {
  base: SERVICE_URL,
  endpoint: {
    auth: {
      login: "/user/login?email=${email}&password=${password}",
      register: "/user/registration",
    },
    board: {
      getAllBoard: "/board/get-all",
      createBoard: "/board/create",
      getBoardByName: "/board/get-all?PageIndex=1&PageSize=50&name=${boardName}",
    },
    list: {
      getAllList: "/list/get-all?boardId=${boardId}",
      createList: "/list/create",
      updateList: "/list/update-name/${id}",
    },
    card: {
      getAllCard: "/card/get-all?listId=${listId}",
      createCard: "/card/create",
      updateCard: "/card/update/${id}",
    },
    task: {
      getAllTask: "",
    },
  },
};
