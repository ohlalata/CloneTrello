import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Popover, Overlay, Button, ButtonGroup } from "react-bootstrap";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEarthAsia } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
    if (e.target.value == "") {
      toast.error("Board name is required!");
    }
    setInputBoardNameTemp(e.target.value);
  };

  const adjustInputWidth = () => {
    if (spanReff.current && inputReff.current) {
      const spanWidth = spanReff.current.offsetWidth;
      inputReff.current.style.width = `${spanWidth}px`;
    }
  };

  const handleUpdateBoardVisibility = async (id, isPublic) => {
    try {
      const response = await boardService.updateBoardVisibility(id, isPublic);
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
    const formData = new FormData();
    if (inputBoardNameTemp == "") {
      window.location.reload();
    } else {
      formData.append("Name", inputBoardNameTemp);
    }

    try {
      const response = await boardService.updateBoardName(id, formData);
      if (response.data.code == 200) {
        setIsBoardNameVisible(false);
        setInputBoardNameTemp("");
        handleGetAllBoard();
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
            {/* <div className="block__option-wrapper d-flex align-items-center">
              <span className="d-flex align-items-center justify-content-center block__option-board-content ">
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
              </span>
            </div> */}
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavbarBoardContent;
