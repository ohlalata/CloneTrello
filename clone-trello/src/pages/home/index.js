import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board";
import userService from "../../api/Services/user"; // Import userService
import * as constants from "../../shared/constants";
import {
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

import { Nav, Button, Collapse } from "react-bootstrap";
import NavBar from "../../components/navBar";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { faTableList } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const HomePages = () => {
  const [activeKey, setActiveKey] = useState("/home");

  const [openItems, setOpenItems] = useState({});

  const [listBoard, setListBoard] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [boardName, setBoardName] = useState("");

  const [createUser, setCreateUser] = useState("");

  const [yourBoard, setYourBoard] = useState([]);

  const [inviteModalShow, setInviteModalShow] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const submitCreateBoard = () => {
    handleCreateBoard();
    setModalShow(false);
  };

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

  const handleUpdateBoardStatus = async (id) => {
    try {
      const response = await boardService.changeBoardStatus(id, false);
      if (response.data.code == 200) {
        console.log("delete board successful");
        handleGetAllBoard();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deCrypAccessToken = () => {
    const toKen = localStorage.getItem("accessToken");
    const deCrypAccessToken = jwtDecode(toKen);
    setCreateUser(deCrypAccessToken.sub);
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

  useEffect(() => {
    deCrypAccessToken();
    handleGetAllBoard();
  }, []);

  useEffect(() => {
    if (createUser) {
      setYourBoard(
        listBoard.filter((board) => board.createdUser === createUser)
      );
    }
  }, [createUser, listBoard]);

  const handleMemberClick = (key) => {
    handleToggle(key);
    handleInviteModal();
  };

  const handleSearchChange = async (e) => {
    setSearchKeyword(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await userService.searchUsers(e.target.value);
        if (response.data.code === 200) {
          setSearchResults(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInviteUser = async (user, boardIndex) => {
    try {
      const response = await boardService.createBoardMember(user.id, yourBoard[boardIndex].id);
      if (response.data.code === 201) {
        console.log("User added to the board successfully!");
        setInviteModalShow(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
              <p className="mb-1 ps-1 fw-semibold fs-5">workspaces</p>
              <div className="d-flex flex-column gap-2">
                {yourBoard.map((listBoardSide, index) => (
                  <div key={index}>
                    <Button
                      className="d-flex btn__collapse-board justify-content-between"
                      onClick={() => handleToggle(index)}
                      aria-controls={`collapse-list-board-menu-${index}`}
                      aria-expanded={openItems[index] || false}
                    >
                      <span className="fw-semibold">{listBoardSide.name}</span>
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
                          >
                            <div className="d-flex gap-2 align-items-center">
                              <FontAwesomeIcon icon={faUserGroup} size="sm" />
                              <span className="fw-semibold">Member</span>
                            </div>
                            <div className="block__add-member">
                              <FontAwesomeIcon icon={faPlus} />
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
                    <h6 className="fw-bold my-1 fs-5">YOUR BOARDS</h6>
                  </div>

                  <div className="d-flex gap-2">
                    <div>
                      <button type="button" class="btn btn__action-board">
                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex gap-3 flex-wrap">
                    {yourBoard.map((listBoards, index) => (
                      <div
                        key={index}
                        className="block__your-board rounded d-flex flex-column justify-content-between"
                      >
                        <Link
                          to={`/board/board-content/${listBoards.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="p-2">
                            <div className="d-flex justify-content-between">
                              <p className="text-white fw-bold mb-0">
                                {listBoards.name}
                              </p>
                            </div>
                          </div>
                        </Link>

                        <div className="d-flex justify-content-end pe-2 pb-1">
                          <span
                            style={{ color: "#ffffff" }}
                            onClick={() =>
                              handleUpdateBoardStatus(listBoards.id)
                            }
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </span>
                        </div>
                      </div>
                    ))}
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
                <div className="mt-3">
                  <button className="btn btn__action-board">
                    View all your board
                  </button>
                </div>
              </div>
            </div>

            <div className="block__your-workspaces">
              <div className="block__board-content d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2 align-items-center">
                    <FontAwesomeIcon icon={faTableList} size="xl" />
                    <h6 className="fw-bold my-1 fs-5">PUBLIC BOARDS</h6>
                  </div>

                  <div className="d-flex gap-2">
                    <div>
                      <button type="button" class="btn btn__action-board">
                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex gap-3 flex-wrap">
                    {listBoard.map((listBoards, index) => (
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
                <div className="mt-3">
                  <button className="btn btn__action-board">
                    View all closed board
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={inviteModalShow} onHide={handleInviteModal} centered>
        <ModalHeader closeButton>
          <ModalTitle>Invite to Board</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form.Control
            type="text"
            placeholder="Email address or name"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <div className="mt-3">
            {searchResults.map((user, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between border rounded p-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleInviteUser(user, index)}
              >
                <span>{user.name}</span>
                <span>{user.email}</span>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleInviteModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default HomePages;
