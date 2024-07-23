import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import {
  faUserGroup,
  faEllipsis,
  faBarsStaggered,
  faBoxArchive,
  faArrowRightFromBracket,
  faTags,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Popover, Overlay, Button, ButtonGroup } from "react-bootstrap";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEarthAsia } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "react-bootstrap";
import { constructFrom } from "date-fns";
import * as constants from "../../shared/constants";
import labelService from "../../api/Services/label";

const NavbarBoardContent = (boardID) => {
  const [isBoardNameVisible, setIsBoardNameVisible] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardIsPublic, setBoardIsPublic] = useState("");

  const [inputBoardNameTemp, setInputBoardNameTemp] = useState(boardName);
  const inputReff = useRef(null);
  const spanReff = useRef(null);

  const [showPopover, setShowPopover] = useState(false);
  const [target, setTarget] = useState(null);
  const PopoverRef = useRef(null);

  const [isOffcanvasOpen, setIsOffanvasOpen] = useState(false);
  const [isLabelOffcanvas, setIsLabelOffcanvas] = useState(false);

  const boardLabelReff = useRef(null);
  const [boardLabelTarget, setBoardLabelTarget] = useState(null);
  const [isShowBoardTarget, setIsShowBoardTarget] = useState(false);

  const [colorSelected, setColorSelected] = useState("#579dff");

  const [selectBoardLabel, setSelectBoardLabel] = useState(20);
  const [isDisableCreate, setIsDisableCreate] = useState(false);
  const [isCreateBoardLabel, setIsCreateBoardLabel] = useState(false);
  const [isUpdateBoardLabel, setIsUpdateBoardLabel] = useState(false);

  const [boardLabel, setBoardLabel] = useState([]);

  const handleCreateBoardLabel = () => {
    setIsCreateBoardLabel(true);
  };

  const handleUpdateBoardLabel = (event) => {
    setIsUpdateBoardLabel(true);
    setIsShowBoardTarget(true);
    setBoardLabelTarget(event.target);
  };

  const handleSelectBoardLabel = (color, index) => {
    setSelectBoardLabel(index);
    setColorSelected(color);
    setIsDisableCreate(false);
  };

  const handleRemoveColor = () => {
    setColorSelected("#e9ebee");
    setSelectBoardLabel("99");
    setIsDisableCreate(true);
  };

  const handlePopoverBoardLabel = (event) => {
    if (isShowBoardTarget) return;
    setIsShowBoardTarget(true);
    setBoardLabelTarget(event.target);
  };

  const handleHideBoardLabel = () => {
    setIsShowBoardTarget(false);
    setIsCreateBoardLabel(false);
    setIsUpdateBoardLabel(false);
  };

  const showLabelOffcanvas = () => {
    setIsOffanvasOpen(false);
    setIsLabelOffcanvas(true);
  };

  const closeLabelOffcanvas = () => {
    setIsOffanvasOpen(false);
    setIsLabelOffcanvas(false);
  };

  const backToMainOffcanvas = () => {
    setIsOffanvasOpen(true);
    setIsLabelOffcanvas(false);
  };

  const showOffcanvas = () => {
    setIsOffanvasOpen(true);
  };

  const closeOffcanvas = () => {
    setIsOffanvasOpen(false);
  };

  const handlePopoverClick = (event) => {
    setShowPopover(!showPopover);
    setTarget(event.target);
  };

  const handleHide = () => {
    setShowPopover(false);
  };

  const handleBoardName = () => {
    setIsBoardNameVisible(true);
    setInputBoardNameTemp(boardName);
  };

  const handleChangeBoardName = (e) => {
    if (!e.target.value) {
      toast.warn("Board name is required!");
      setInputBoardNameTemp(boardName);
    }
    setInputBoardNameTemp(e.target.value);
  };

  const adjustInputWidth = () => {
    if (spanReff.current && inputReff.current) {
      const spanWidth = spanReff.current.offsetWidth;
      inputReff.current.style.width = `${spanWidth}px`;
    }
  };

  const handleGetAllLabel = async () => {
    let query = { boardId: boardID.boardID };
    try {
      const response = await labelService.getAllLabel(query);
      if (response.data.code == 200) {
        console.log(response.data.data);
        setBoardLabel(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBoardVisibility = async (id, isPublic) => {
    let query = { id: id, isPublic: isPublic };

    try {
      const response = await boardService.updateBoardVisibility(query);
      if (response.data.code == 200) {
        handleGetAllBoard();
        toast.success("Change board visibility successful");
      }
    } catch (error) {
      console.error(error);
      toast.error("Change board visibility fail!");
    }
  };

  const handleUpdateBoardName = async (id) => {
    // const formData = new FormData();
    // formData.append("Name", inputBoardNameTemp);
    let query = {
      id: id,
      name: inputBoardNameTemp,
    };
    try {
      const response = await boardService.updateBoardName(query);
      if (response.data.code == 200) {
        setIsBoardNameVisible(false);
        setInputBoardNameTemp("");
        handleGetAllBoard();
        console.log("update board name ok");
      }
    } catch (error) {
      console.error(error);
      setIsBoardNameVisible(false);
    }
  };

  const handleGetAllBoard = async () => {
    try {
      const response = await boardService.getAllBoard();
      if (response.data.code == 200) {
        const result = response.data.data;
        setBoardName(
          result.filter((board) => board.id == boardID.boardID)[0].name
        );
        setBoardIsPublic(
          result.filter((board) => board.id == boardID.boardID)[0].isPublic
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllBoard();
  }, []);

  useEffect(() => {
    if (isBoardNameVisible && inputReff.current) {
      inputReff.current.focus();
      adjustInputWidth();
    }
  }, [isBoardNameVisible]);

  useEffect(() => {
    adjustInputWidth();
  }, [inputBoardNameTemp]);

  useEffect(() => {
    handleGetAllLabel();
  }, [isLabelOffcanvas]);

  return (
    <React.Fragment>
      <nav className="navbar navbar__board-content">
        <div className="container-fluid d-flex justify-content-between">
          <div className="d-flex gap-3">
            <div className="">
              {isBoardNameVisible ? (
                <input
                  ref={inputReff}
                  type="text"
                  className="input__board-name fw-bold fs-5"
                  value={inputBoardNameTemp}
                  onChange={handleChangeBoardName}
                  style={{ transition: "width 0.2s" }}
                  onBlur={() => handleUpdateBoardName(boardID.boardID)}
                ></input>
              ) : (
                <span
                  className="fs-5 fw-bold"
                  style={{ color: "#455570", cursor: "pointer" }}
                  onClick={handleBoardName}
                >
                  {boardName}
                </span>
              )}
              <span ref={spanReff} className="hidden-span px-2 fs-5">
                {inputBoardNameTemp}
              </span>
            </div>

            <div ref={PopoverRef} onClick={handlePopoverClick}>
              <div className="d-flex gap-2 block__change-visibility p-1 align-items-center">
                <span>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    size="xs"
                    className="fw-semibold"
                  />
                </span>
                <span className="fw-semibold fs-6">Workspace visible</span>
              </div>

              <Overlay
                show={showPopover}
                target={target}
                placement="bottom"
                container={PopoverRef.current}
                containerPadding={20}
                rootClose={true}
                onHide={handleHide}
              >
                <Popover
                  id="popover-contained"
                  className="block__popover-visibility"
                >
                  <Popover.Header
                    className="d-flex justify-content-between"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div></div>
                    <span
                      className="fw-bold label__change-visible"
                      style={{ color: "#455570" }}
                    >
                      Change visibility
                    </span>
                    <div>
                      <Button
                        variant="close"
                        aria-label="Close"
                        onClick={handleHide}
                      />
                    </div>
                  </Popover.Header>
                  <Popover.Body>
                    <ButtonGroup vertical className="gap-3">
                      <div>
                        <div className="d-flex gap-1 align-items-center ms-1">
                          <FontAwesomeIcon icon={faEarthAsia} color="#455570" />
                          <span
                            className="fw-semibold"
                            style={{ color: "#455570", cursor: "pointer" }}
                            onClick={() =>
                              handleUpdateBoardVisibility(boardID.boardID, true)
                            }
                          >
                            Public
                          </span>
                          {boardIsPublic == true && (
                            <FontAwesomeIcon icon={faCheck} />
                          )}
                        </div>
                        <span style={{ color: "#455570", fontSize: "11px" }}>
                          Anyone on the Trellone can see this board. Only board
                          members can edit.
                        </span>
                      </div>

                      <div>
                        <div className="d-flex gap-1 align-items-center ms-1">
                          <FontAwesomeIcon icon={faLock} color="#455570" />
                          <span
                            className="fw-semibold"
                            style={{ color: "#455570", cursor: "pointer" }}
                            onClick={() =>
                              handleUpdateBoardVisibility(
                                boardID.boardID,
                                false
                              )
                            }
                          >
                            Private
                          </span>
                          {boardIsPublic == false && (
                            <FontAwesomeIcon icon={faCheck} />
                          )}
                        </div>
                        <span style={{ color: "#455570", fontSize: "11px" }}>
                          Only board members can see this board. Board admins
                          can close the board or remove members.
                        </span>
                      </div>
                    </ButtonGroup>
                  </Popover.Body>
                </Popover>
              </Overlay>
            </div>
          </div>
          <div className="d-flex gap-3">
            {/* <div>
              <button className="btn btn-secondary btn-sm d-flex gap-1">
                <span>
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
                <span className="fw-semibold fs-6">Share</span>
              </button>
            </div> */}

            <div
              className="block__option-wrapper d-flex align-items-center"
              onClick={showOffcanvas}
            >
              <span className="d-flex align-items-center justify-content-center block__option-board-content">
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
              </span>
            </div>

            <Offcanvas
              show={isOffcanvasOpen}
              onHide={closeOffcanvas}
              placement="end"
              name="menu-setting"
              scroll={true}
              backdrop={false}
            >
              <Offcanvas.Header closeButton>
                <div className="d-flex justify-content-center w-100 ">
                  <span className="fw-semibold  title__menu-setting">Menu</span>
                </div>
              </Offcanvas.Header>

              <Offcanvas.Body className="pt-0">
                <div className="w-100 border border-1 mb-3"></div>
                <div
                  className="d-flex flex-column gap-2"
                  style={{ color: "#455570" }}
                >
                  <div className="option__menu-setting">
                    <div className="d-flex gap-3 align-items-center ms-2">
                      <FontAwesomeIcon icon={faBarsStaggered} />
                      <span>Avtivity</span>
                    </div>
                  </div>
                  <div className="option__menu-setting">
                    <div className="d-flex gap-3 align-items-center ms-2">
                      <FontAwesomeIcon icon={faBoxArchive} />
                      <span>Archived items</span>
                    </div>
                  </div>
                  <div className="w-100 border border-1 my-2"></div>
                  <div
                    className="option__menu-setting"
                    onClick={showLabelOffcanvas}
                  >
                    <div className="d-flex gap-3 align-items-center ms-2">
                      <FontAwesomeIcon icon={faTags} />
                      <span>Label</span>
                    </div>
                  </div>
                  <div className="w-100 border border-1 my-2"></div>
                  <div className="option__menu-setting">
                    <div className="d-flex gap-3 align-items-center ms-2">
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      <span>Leave board</span>
                    </div>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas
              show={isLabelOffcanvas}
              onHide={closeLabelOffcanvas}
              placement="end"
              scroll={true}
              backdrop={false}
            >
              <Offcanvas.Header closeButton>
                <div className="d-flex align-items-center w-100">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={backToMainOffcanvas}
                    style={{ cursor: "pointer" }}
                    color="#455570"
                  />
                  <div className="d-flex justify-content-center w-100 ms-2">
                    <span className="fw-semibold title__menu-setting">
                      Labels
                    </span>
                  </div>
                </div>
              </Offcanvas.Header>
              <Offcanvas.Body className="pt-0">
                <div className="w-100 border border-1 mb-3"></div>

                <div className="d-flex flex-column gap-2">
                  <div>
                    <input
                      className="w-100 border border-2 p-1 rounded-1 "
                      name="search-board-label"
                      type="text"
                      placeholder="Search labels..."
                      //value={}
                      //onChange={}
                    ></input>
                  </div>
                  <div>
                    <span className="fw-semibold title__board-label">
                      Labels
                    </span>
                    <div className="mt-2 d-flex flex-column gap-1">
                      {boardLabel.map((boardLabels, key) => (
                        <div
                          className="d-flex justify-content-between"
                          key={key}
                        >
                          <div
                            ref={boardLabelReff}
                            className="col-10 d-flex justify-content-start align-items-center block__board-label-sample"
                            style={
                              {
                                //backgroundColor: `${boardLabels.color}`,
                              }
                            }
                            onClick={(e) => handleUpdateBoardLabel(e)}
                          >
                            <span className="ms-3 fw-semibold">
                              {boardLabels.name}
                            </span>
                          </div>
                          <div
                            ref={boardLabelReff}
                            className="col-2 d-flex justify-content-center align-items-center"
                            onClick={(e) => handleUpdateBoardLabel(e)}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      ref={boardLabelReff}
                      onClick={(e) => handlePopoverBoardLabel(e)}
                      className="block__popover-board-label-wrapper"
                    >
                      <div
                        className="block__create_board-label d-flex justify-content-center mt-2"
                        onClick={handleCreateBoardLabel}
                      >
                        <span className="fw-semibold">Create a new label</span>
                      </div>

                      <Overlay
                        show={isShowBoardTarget}
                        target={boardLabelTarget}
                        placement="bottom"
                        container={boardLabelReff.current}
                        rootClose={true}
                        onHide={handleHideBoardLabel}
                      >
                        <Popover
                          id="popover-board-label"
                          className="block__popover-board-label"
                        >
                          <Popover.Header
                            className="d-flex justify-content-between"
                            style={{ backgroundColor: "#ffffff" }}
                          >
                            <div></div>
                            <span className="fw-semibold">Labels</span>

                            <Button
                              size="sm"
                              variant="close"
                              aria-label="Close"
                              onClick={handleHideBoardLabel}
                            />
                          </Popover.Header>
                          <Popover.Body>
                            <div className="d-flex flex-column gap-3">
                              <div className="block__sample-color-wrapper d-flex justify-content-center align-items-center ">
                                <div
                                  className="block__sample-color"
                                  style={{ backgroundColor: colorSelected }}
                                ></div>
                              </div>

                              <div>
                                <span className="fw-semibold title__caption">
                                  Title
                                </span>
                                <input
                                  type="text"
                                  name="title-board-label"
                                  className="w-100 border border-2 p-1 rounded-1 mt-1"
                                  //value={}
                                  //onChange={}
                                ></input>
                              </div>

                              <div>
                                <span className="fw-semibold title__caption">
                                  Select a color
                                </span>
                                <div className="block__grid-container mt-2">
                                  {constants.LABEL_COLOR.map((color, index) => (
                                    <div
                                      key={index}
                                      className={`block__color-box ${
                                        selectBoardLabel == index
                                          ? "block__selected-color"
                                          : ""
                                      }`}
                                      style={{ backgroundColor: color }}
                                      onClick={() =>
                                        handleSelectBoardLabel(color, index)
                                      }
                                    ></div>
                                  ))}
                                </div>
                              </div>

                              <div
                                className="d-flex justify-content-center block__remove-color"
                                onClick={handleRemoveColor}
                              >
                                <span className="fw-semibold">
                                  <FontAwesomeIcon icon={faXmark} /> Remove
                                  color
                                </span>
                              </div>

                              <div className="w-100 border border-1"></div>

                              <div className="d-flex justify-content-between">
                                {isCreateBoardLabel && (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    disabled={isDisableCreate}
                                  >
                                    Create
                                  </button>
                                )}
                                {isUpdateBoardLabel && (
                                  <button className="btn btn-primary btn-sm">
                                    Save
                                  </button>
                                )}

                                {isUpdateBoardLabel && (
                                  <button className="btn btn-danger btn-sm">
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          </Popover.Body>
                        </Popover>
                      </Overlay>
                    </div>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavbarBoardContent;
