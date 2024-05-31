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
    },
    list: {
      getAllList: "/List/get-all?boardId=${boardId}",
      createList: "/List/create",
    },
    card: {
      getAllCard: "/Card/get-all",
    },
    task: {
      getAllTask: "",
    },
  },
};
