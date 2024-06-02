const SERVICE_URL = "https://localhost:7201/api";

export default {
  base: SERVICE_URL,
  endpoint: {
    auth: {
      login: "/User/login",
      register: "/User/registration",
    },
    board: {
      getAllBoard: "/Board/get-all",
      createBoard: "/Board/create",
    },
    list: {
      getAllList: "/List/get-all?boardId=${boardId}",
      createList: "/List/create",
      updateListName: "/List/update-name/${id}",
    },
    card: {
      getAllCard: "/Card/get-all?listId=${listId}",
      createCard: "/Card/create",
    },
    task: {
      getAllTask: "",
    },
  },
};
