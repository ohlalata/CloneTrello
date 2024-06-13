import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board";
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
import userService from "../../api/Services/user";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { faTableList } from "@fortawesome/free-solid-svg-icons";

const HomePages = () => {
  const [activeKey, setActiveKey] = useState("/home");

  const [openItems, setOpenItems] = useState({});

  const [listBoard, setListBoard] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [boardName, setBoardName] = useState("");

  const handleToggle = (key) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleModal = () => {
    setModalShow(!modalShow);
  };

  const submitCreateBoard = () => {
    handleCreateBoard();
    setModalShow(false);
  };

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

  const handleGetUserById = async (id) => {
    try {
      const response = await userService.getUserById(id);
      if (response.data.code == 200) {
        console.log(response.data.data.name);
      }
    } catch (error) {
      console.error(error);
    }
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
        console.log("create board successfull!");
        handleGetAllBoard();
      }
    } catch (error) {
      console.error(error);
      console.log("create board fail!");
    }
  };

  useEffect(() => {
    handleGetAllBoard();
  }, []);

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
                {listBoard.map((listBoardSide, key) => (
                  <div key={key}>
                    <Button
                      className="d-flex btn__collapse-board justify-content-between"
                      onClick={() => handleToggle(key)}
                      aria-controls={`collapse-list-board-menu-${key}`}
                      aria-expanded={openItems[key] || false}
                    >
                      <span className="fw-semibold">{listBoardSide.name}</span>
                      <span>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </span>
                    </Button>

                    <Collapse in={openItems[key] || false}>
                      <div id={`collapse-list-board-menu-${key}`}>
                        <div className="mt-2 ps-2 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between block__board-action">
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
                    {listBoard.map((listBoards, key) => (
                      <div key={key} className="block__your-board rounded">
                        <Link
                          to={`/board/board-content/${listBoards.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="p-2">
                            <div className="d-flex justify-content-between">
                              <p className="text-white fw-bold mb-0">
                                {listBoards.name}
                              </p>
                              <div>
                                <input type="checkbox"></input>
                              </div>
                            </div>
                          </div>
                        </Link>
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
                    {listBoard.map((listBoards, key) => (
                      <div key={key} className="block__your-board rounded">
                        <Link
                          to={`/board/board-content/${listBoards.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="p-2 ">
                            <div className="d-flex justify-content-between">
                              <p className="text-white fw-bold mb-0">
                                {listBoards.name}
                              </p>
                              <div>
                                <input type="checkbox"></input>
                              </div>
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
    </React.Fragment>
  );
};

export default HomePages;
