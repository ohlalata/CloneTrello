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

const HomePages = () => {
  const [activeKey, setActiveKey] = useState("/home");

  const [openItems, setOpenItems] = useState({});

  const [listBoard, setListBoard] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [boardName, setBoardName] = useState("");

  const [createUser, setCreateUser] = useState("");

  const [yourBoard, setYourBoard] = useState([]);

  const [result, setResult] = useState([]);

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
  };

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

  const deCrypAccessToken = () => {
    const toKen = localStorage.getItem("accessToken");
    const deCrypAccessToken = jwtDecode(toKen);
    setCreateUser(deCrypAccessToken.sub);
  };

  const filterBoardMember = async () => {
    let yourBoardJoined = [];
    for (let boardElement of listBoard) {
      const members = await boardMemberService.getAllBoardMember(
        boardElement.id
      );

      const hasMyId = members.data.data.some(
        (member) => member.userId == createUser
      );
      if (hasMyId) {
        yourBoardJoined.push(boardElement);
      }
    }
    setResult(yourBoardJoined);

    console.log("concat", yourBoardJoined);
  };

  const handleGetAllBoard = async () => {
    try {
      const response = await boardService.getAllBoard();
      if (response.data.code == 200) {
        const result = response.data.data;
        setListBoard(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBoardStatus = async (id) => {
    try {
      const response = await boardService.changeBoardStatus(id, false);
      if (response.data.code == 200) {
        setModalShowDelete(false);
        toast.success("delete board successful");
        handleGetAllBoard();
      }
    } catch (error) {
      console.error(error);
      toast.success("delete board  fail!");
    }
  };

  const handleCreateBoard = async () => {
    try {
      const response = await boardService.createBoard(boardName);
      if (response.data.code == 201) {
        console.log("create board successful!");
        handleGetAllBoard();
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
    try {
      const response = await userService.searchUsers(keyword);
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
    try {
      const boardId = result[selectedBoardIndex].id;
      const response = await boardMemberService.getAllBoardMember(boardId);
      if (response.data.code === 200) {
        const members = response.data.data;
        const isMember = members.some((member) => member.userId === user.id);
        if (isMember) {
          setError("User is already a member of this board!");
          return;
        }
      }

      const inviteResponse = await boardMemberService.createBoardMember(
        user.id,
        boardId
      );
      if (inviteResponse.data.code === 201) {
        toast.success("Board member invited successfully!");
        setInviteModalShow(false);
        setError("");
      }
    } catch (error) {
      toast.error("Board member invited failed!");
      setError("Invite board member failed!");
      console.error(error);
    }
  };

  const navigateToBoardMembers = (boardId) => {
    navigate(`/board/board-member/${boardId}`);
  };

  useEffect(() => {
    deCrypAccessToken();
    handleGetAllBoard();
  }, []);

  useEffect(() => {
    if (!inviteModalShow) {
      setSearchResults([]);
      setError("");
      setSearchKeyword("");
      setSelectedBoardIndex(null);
    }
  }, [inviteModalShow]);

  useEffect(() => {
    // if (createUser) {
    //   setYourBoard(
    //     listBoard.filter((board) => board.createdUser === createUser)
    //   );
    // }
    filterBoardMember();
  }, [createUser, listBoard]);

  return (
    <React.Fragment>
      <NavBar />
      <div style={{ display: "block" }}>
        <div className="d-flex align-items-start flex-row justify-content-center">
          <nav className="block__nav-list-board">
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
              className="border boder-1 my-3"
            ></div>

            <div>
              <p className="mb-1 ps-1 fw-semibold fs-5">Workspaces</p>
              <div className="d-flex flex-column gap-2">
                {result
                  .sort(
                    (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
                  )
                  .map((listBoardSide, index) => (
                    <div key={index}>
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
                    </div>
                  ))}
              </div>
            </div>
          </nav>
          <div className="block__list-board d-flex flex-column gap-3">
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
                    {result
                      .sort(
                        (a, b) =>
                          new Date(a.createdDate) - new Date(b.createdDate)
                      )
                      .map((yourBoards, index) => (
                        <div
                          key={index}
                          className="block__your-board rounded d-flex flex-column justify-content-between"
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
                                handleDeleteModal(
                                  yourBoards.id,
                                  yourBoards.name
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </span>
                          </div>
                        </div>
                      ))}

                    <Modal
                      show={modalShowDelete}
                      centered
                      onHide={() => setModalShowDelete(false)}
                    >
                      <ModalHeader closeButton>
                        <ModalTitle>Confirm</ModalTitle>
                      </ModalHeader>
                      <ModalBody className="d-flex justify-content-center">
                        <span className="fs-5 fw-bold">
                          Are you sure delete {deleteBoardName} board?{" "}
                        </span>
                      </ModalBody>
                      <ModalFooter>
                        <div className="d-flex justify-content-around gap-3 w-100">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setModalShowDelete(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              handleUpdateBoardStatus(deleteBoardId)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </ModalFooter>
                    </Modal>

                    <div>
                      <div
                        onClick={handleModal}
                        className="block__create-new-board p-2 bg-body-secondary d-flex justify-content-center align-items-center border-opacity-10 rounded"
                      >
                        <p className="mb-0 ">Create new board</p>
                      </div>
                      <Modal show={modalShow} onHide={handleModal} centered>
                        <ModalHeader closeButton>
                          <ModalTitle>Create Board</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                          <div>
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="board-name"
                              value={boardName}
                              onChange={(e) => setBoardName(e.target.value)}
                            />
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <button
                            className="btn btn-primary"
                            onClick={submitCreateBoard}
                          >
                            Create
                          </button>
                        </ModalFooter>
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
                    <h6 className="fw-bold my-1 fs-5">Public Boards</h6>
                  </div>
                </div>
                <div>
                  <div className="d-flex gap-3 flex-wrap">
                    {listBoard
                      .filter((board) => board.isPublic == true)
                      .map((listBoards, index) => (
                        <div
                          key={index}
                          className="block__your-board rounded d-flex flex-column justify-content-between"
                        >
                          <Link
                            to={`/board/board-content/${listBoards.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <div className="p-2 ">
                              <div className="d-flex">
                                <p className="text-white fw-bold mb-0">
                                  {listBoards.name}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
