/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board.services";
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
import NavBar from "../../components/navbar";

const HomePages = () => {
  const [activeKey, setActiveKey] = useState("/home");
  const [open, setOpen] = useState(false);
  const [listBoard, setListBoard] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [boardName, setBoardName] = useState("");

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

  const handleGetAllBoard = async () => {
    try {
      const response = await boardService.getAllBoard();
      if (response.data.code == 200) {
        setListBoard(response.data.data);

        console.log("get list successfull!");
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
      {/* <Outlet /> */}
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
                <Nav.Link href="/home" className="menu__nav-board">
                  {" "}
                  Boards
                </Nav.Link>
                <Nav.Link eventKey="link-1" className="menu__nav-board">
                  Activity 1
                </Nav.Link>
                <Nav.Link eventKey="link-2" className="menu__nav-board">
                  Activity 2
                </Nav.Link>
                <Nav.Link eventKey="link-3" className="menu__nav-board">
                  Activity 3
                </Nav.Link>
              </Nav>
            </div>
            <div
              style={{ width: "100%" }}
              className="border boder-1 my-3"
            ></div>

            <div>
              <p className="mb-1 ps-1 fw-semibold">workspaces</p>
              <div className="d-flex flex-column gap-2">
                <div>
                  <Button
                    className="d-flex btn__collapse-board justify-content-between"
                    onClick={() => setOpen(!open)}
                    aria-controls="collapse-list-board-menu"
                    aria-expanded={open}
                  >
                    <span>Board 1</span>
                    <span>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                  </Button>

                  <Collapse in={open}>
                    <div id="collapse-list-board-menu">
                      <div className="mt-2 ps-2 d-flex flex-column gap-2">
                        <div>Board 2</div>
                        <div>Board 3</div>
                        <div>Board 4</div>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>
          </nav>
          <div className="block__list-board">
            <div>
              <div className="d-flex gap-2">
                <div>
                  <FontAwesomeIcon icon={faClock} size="lg" />
                </div>
                <h6 className="mb-0">Recently viewed</h6>
              </div>
              <div className="d-flex gap-3 mt-2 flex-wrap">
                <div>
                  <div className="block__recenly-board rounded">
                    <div className="p-2">
                      <p className="text-white fw-bold">Hello</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="block__your-workspaces">
              <h5 className="fw-bold my-3">YOUR BOARDS</h5>
              <div className="block__board-content d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="block__image-user-board">
                      <img src={constants.USER_UNDEFINE} alt="" />
                    </div>
                    <h6 className="mb-0">user's boards</h6>
                  </div>

                  <div className="d-flex gap-2">
                    <div>
                      <button type="button" class="btn btn__action-board">
                        <FontAwesomeIcon icon={faEye} /> Views
                      </button>
                    </div>
                    <div>
                      <button type="button" class="btn btn__action-board">
                        <FontAwesomeIcon icon={faUser} /> Member
                      </button>
                    </div>
                    <div>
                      <button type="button" class="btn btn__action-board">
                        <FontAwesomeIcon icon={faBarsStaggered} /> All
                      </button>
                    </div>
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
                        <Link to={`/board/board-content/${listBoards.id}`}>
                          <div className="p-2">
                            <p className="text-white fw-bold">
                              {listBoards.name}
                            </p>
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
