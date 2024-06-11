// const SERVICE_URL = "https://localhost:7201/api";

export default {
  base: `https://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api`,
  endpoint: {
    auth: {
      login: "/user/login?email=${email}&password=${password}",
      register: "/user/registration",
    },
    user: {
      getUserById: "/user/get/${id}",
    },
    board: {
      getAllBoard: "/board/get-all",
      createBoard: "/board/create",
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
