import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board";
import userService from "../../api/Services/user";
import boardMemberService from "../../api/Services/boardMember";
import * as constants from "../../shared/constants";
import {
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Alert,
} from "react-bootstrap";

import { Nav, Button, Collapse } from "react-bootstrap";
import NavBar from "../../components/navBar";
import { faUserGroup, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { faTableList } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { debounce } from "lodash";
// import Connection from "../../components/signalrConnection";
import { motion } from "framer-motion";

const HomePages = () => {
  const [activeKey, setActiveKey] = useState("/home");

  const [openItems, setOpenItems] = useState({});

  const [listBoard, setListBoard] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [boardName, setBoardName] = useState("");

  const [createUser, setCreateUser] = useState("");

  const [yourBoard, setYourBoard] = useState([]);

  const [deleteBoardId, setDeleteBoardId] = useState("");

  const [deleteBoardName, setDeleteBoardName] = useState("");

  const [inviteModalShow, setInviteModalShow] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);

  const [modalShowDelete, setModalShowDelete] = useState(false);
  const navigate = useNavigate();

  const handleToggle = (key) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleModal = () => {
    setModalShow(!modalShow);
    setBoardName("");
  };

  const handleInviteModal = () => {
    setInviteModalShow(!inviteModalShow);
  };

  const handleDeleteModal = (id, name) => {
    setModalShowDelete(true);
    setDeleteBoardId(id);
    setDeleteBoardName(name);
  };

  const submitCreateBoard = () => {
    handleCreateBoard();
    setModalShow(false);
    handleGetAllBoard();
    handleGetBoardByMember();
  };

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

  const decryptAccessToken = () => {
    const userProfile = localStorage.getItem("userProfile");
    const userId = userProfile?.userId;
    setCreateUser(userId);
  };

  const handleGetAllBoard = async () => {
    try {
      const response = await boardService.getAllBoard();
      if (response.data.code == 200) {
        const result = response.data.data.filter(
          (board) => board.isActive == true
        );
        setListBoard(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetBoardByMember = async () => {
    try {
      const response = await boardService.getBoardByMember();
      if (response.data.code == 200) {
        setYourBoard(
          response.data.data.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBoardStatus = async (id) => {
    let query = {
      id: id,
      isActive: false,
    };
    try {
      const response = await boardService.changeBoardStatus(query);
      if (response.data.code == 200) {
        setModalShowDelete(false);
        toast.success("delete board successful");
        handleGetAllBoard();
        handleGetBoardByMember();
      }
    } catch (error) {
      console.error(error);
      setModalShowDelete(false);
      toast.error("delete board  fail!");
    }
  };

  const handleCreateBoard = async () => {
    let requestBody = {
      name: boardName,
    };
    try {
      const response = await boardService.createBoard(requestBody);
      if (response.data.code == 201) {
        console.log("create board successful!");
        handleGetAllBoard();
        handleGetBoardByMember();
        setBoardName("");
      }
    } catch (error) {
      console.error(error);
      console.log("create board fail!");
    }
  };

  const handleMemberClick = (index) => {
    handleToggle(index);
    setSelectedBoardIndex(index);
    setInviteModalShow(true);
  };

  const handleSearchChange = async (e) => {
    setSearchKeyword(e.target.value);
    if (e.target.value.length > 2) {
      fetchSearchResultsDebounced(e.target.value);
    } else {
      setSearchResults([]);
    }
  };

  const fetchSearchResults = async (keyword) => {
    let query = {
      keyword: keyword,
    };
    try {
      const response = await userService.searchUsers(query);
      if (response.data.code === 200) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSearchResultsDebounced = useCallback(
    debounce(fetchSearchResults, 500),
    []
  );

  const handleInviteUser = async (user) => {
    let query, requestBody;
    try {
      const boardId = yourBoard[selectedBoardIndex].id;
      query = { boardId: boardId };
      const response = await boardMemberService.getAllBoardMember(query);
      if (response.data.code === 200) {
        const members = response.data.data;
        const isMember = members.some((member) => member.userId === user.id);
        if (isMember) {
          setError("User is already a member of this board!");
          return;
        }
      }
      requestBody = {
        userId: user.id,
        boardId: boardId,
      };
      const inviteResponse = await boardMemberService.createBoardMember(
        requestBody
      );
      if (inviteResponse.data.code === 201) {
        toast.success("Board member invited successfully!");
        // Connection.invoke(
        //   "ReceiveTotalNotification",
        //   requestBody.userId
        // );
        setInviteModalShow(false);
        setError("");
      }
    } catch (error) {
      toast.error("Board member invitation failed!");
      setError("Invite board member failed!");
      console.error(error);
    }
  };

  const navigateToBoardMembers = (boardId) => {
    navigate(`/board/board-member/${boardId}`);
  };

  useEffect(() => {
    decryptAccessToken();
    handleGetAllBoard();
    handleGetBoardByMember();
  }, []);

  useEffect(() => {
    if (!inviteModalShow) {
      setSearchResults([]);
      setError("");
      setSearchKeyword("");
      setSelectedBoardIndex(null);
    }
  }, [inviteModalShow]);

  const boardTheme = [
    constants.BOARD_THEME_01,
    constants.BOARD_THEME_02,
    constants.BOARD_THEME_03,
    constants.BOARD_THEME_04,
    constants.BOARD_THEME_05,
    constants.BOARD_THEME_06,
    constants.BOARD_THEME_07,
    constants.BOARD_THEME_08,
    constants.BOARD_THEME_09,
    constants.BOARD_THEME_10,
    constants.BOARD_THEME_11,
    constants.BOARD_THEME_12,
    constants.BOARD_THEME_13,
    constants.BOARD_THEME_14,
    constants.BOARD_THEME_15,
  ];

  const boardThemePublic = [
    constants.BOARD_THEME_16,
    constants.BOARD_THEME_17,
    constants.BOARD_THEME_18,
    constants.BOARD_THEME_19,
    constants.BOARD_THEME_20,
    constants.BOARD_THEME_21,
    constants.BOARD_THEME_22,
    constants.BOARD_THEME_23,
    constants.BOARD_THEME_24,
    constants.BOARD_THEME_25,
    constants.BOARD_THEME_26,
    constants.BOARD_THEME_27,
    constants.BOARD_THEME_28,
    constants.BOARD_THEME_29,
    constants.BOARD_THEME_30,
  ];

  return (
    <React.Fragment>
      <NavBar />
      <div style={{ display: "block" }}>
        <div className="d-flex align-items-start flex-row justify-content-center">
          <motion.nav
            className="block__nav-list-board"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div>
              <Nav
                variant="pills"
                defaultActiveKey="/home"
                className="flex-column"
                activeKey={activeKey}
                onSelect={handleSelect}
              >
                <Nav.Link href="/home" className="menu__nav-board fw-semibold">
                  {" "}
                  Boards
                </Nav.Link>
              </Nav>
            </div>
            <div
              style={{ width: "100%" }}
              className="border border-1 my-3"
            ></div>

            <div>
              <p className="mb-1 ps-1 fw-semibold fs-5">Workspaces</p>
              <div className="d-flex flex-column gap-2">
                {yourBoard
                  .sort(
                    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                  )
                  .map((listBoardSide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        className="d-flex btn__collapse-board justify-content-between"
                        onClick={() => handleToggle(index)}
                        aria-controls={`collapse-list-board-menu-${index}`}
                        aria-expanded={openItems[index] || false}
                      >
                        <span className="fw-semibold">
                          {listBoardSide.name}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                      </Button>
                      <Collapse in={openItems[index] || false}>
                        <div id={`collapse-list-board-menu-${index}`}>
                          <div className="mt-2 ps-2 d-flex flex-column gap-2">
                            <div
                              className="d-flex justify-content-between block__board-action"
                              onClick={() => handleMemberClick(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex gap-2 align-items-center">
                                <FontAwesomeIcon icon={faUserPlus} size="sm" />
                                <span className="fw-semibold">
                                  Invite Member
                                </span>
                              </div>
                              <div className="block__add-member">
                                <FontAwesomeIcon icon={faPlus} />
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 ps-2 d-flex flex-column gap-2">
                            <div
                              className="d-flex justify-content-between block__board-action"
                              onClick={() =>
                                navigateToBoardMembers(listBoardSide.id)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex gap-2 align-items-center">
                                <FontAwesomeIcon icon={faUserGroup} size="sm" />
                                <span className="fw-semibold">Members</span>
                              </div>
                              <div className="block__add-member">
                                <FontAwesomeIcon icon={faAngleRight} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.nav>
          <motion.div
            className="block__list-board d-flex flex-column gap-3"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="block__your-workspaces">
              <div className="block__board-content d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2 align-items-center">
                    <FontAwesomeIcon icon={faTable} size="xl" />
                    <h6 className="fw-bold my-1 fs-5">Your Boards</h6>
                  </div>
                </div>
                <div>
                  <div className="d-flex gap-3 flex-wrap">
                    {yourBoard.map((yourBoards, index) => (
                      <motion.div
                        key={index}
                        className="block__your-board rounded d-flex flex-column justify-content-between"
                        style={{
                          backgroundImage: `url(${
                            boardTheme[index % boardTheme.length]
                          })`,
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        <Link
                          to={`/board/board-content/${yourBoards.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="p-2">
                            <div className="d-flex justify-content-between">
                              <p className="text-white fw-bold mb-0">
                                {yourBoards.name}
                              </p>
                            </div>
                          </div>
                        </Link>

                        <div className="d-flex justify-content-end pe-2 pb-1">
                          <span
                            style={{ color: "#ffffff" }}
                            onClick={() =>
                              handleDeleteModal(yourBoards.id, yourBoards.name)
                            }
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    <Modal
                      show={modalShowDelete}
                      centered
                      onHide={() => setModalShowDelete(false)}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirm</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="d-flex justify-content-start">
                        <span className="fs-5 fw-bold">
                          Are you sure delete {deleteBoardName} board?{" "}
                        </span>
                      </Modal.Body>
                      <Modal.Footer>
                        <div className="d-flex justify-content-end gap-3 w-100">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setModalShowDelete(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleUpdateBoardStatus(deleteBoardId)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </Modal.Footer>
                    </Modal>

                    <div>
                      <motion.div
                        onClick={handleModal}
                        className="block__create-new-board p-2 bg-body-secondary d-flex justify-content-center align-items-center border-opacity-10 rounded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        <p className="mb-0 ">Create new board</p>
                      </motion.div>
                      <Modal show={modalShow} onHide={handleModal} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Create Board</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="board-name"
                              value={boardName}
                              onChange={(e) => setBoardName(e.target.value)}
                            />
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <button
                            className="btn btn-primary"
                            onClick={submitCreateBoard}
                          >
                            Create
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="block__your-workspaces">
              <div className="block__board-content d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2 align-items-center">
                    <FontAwesomeIcon icon={faTableList} size="xl" />
                    <h6 className="fw-bold my-1 fs-5">Workspace</h6>
                  </div>
                </div>
                <div>
                  <div className="d-flex gap-3 flex-wrap">
                    {listBoard.map((board, index) => (
                      <motion.div
                        key={index}
                        className="block__your-board rounded d-flex flex-column justify-content-between"
                        style={{
                          backgroundImage: `url(${
                            boardTheme[index % boardTheme.length]
                          })`,
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      >
                        <Link
                          to={`/board/board-content/${board.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="p-2">
                            <div className="d-flex justify-content-between">
                              <p className="text-white fw-bold mb-0">
                                {board.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {selectedBoardIndex !== null && (
          <Modal show={inviteModalShow} onHide={handleInviteModal} centered>
            <ModalHeader closeButton>
              <ModalTitle>Invite User to Board</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSearchChange}>
                <Form.Control
                  type="text"
                  placeholder="Email address or name"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                />
              </Form>
              {error && (
                <Alert variant="danger" className="small-alert">
                  {error}
                </Alert>
              )}
              <div className="mt-3 scrollable-container">
                {searchResults.map((user, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center justify-content-between border rounded p-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleInviteUser(user)}
                  >
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={handleInviteModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </div>
    </React.Fragment>
  );
};

export default HomePages;
