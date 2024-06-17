import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import boardService from "../../api/Services/board";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

const NavbarBoardContent = (boardID) => {
  const [isBoardNameVisible, setIsBoardNameVisible] = useState(false);

  const [boardName, setBoardName] = useState("");
  const [inputBoardNameTemp, setInputBoardNameTemp] = useState(boardName);

  const inputReff = useRef(null);
  const spanReff = useRef(null);

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

        console.log(boardID.boardID);
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
                  style={{ color: "#455570" }}
                  onClick={handleBoardName}
                >
                  {boardName}
                </span>
              )}
              <span ref={spanReff} className="hidden-span px-2 fs-5">
                {inputBoardNameTemp}
              </span>
            </div>
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
          </div>
          <div className="d-flex gap-3">
            <div>
              <button className="btn btn-secondary btn-sm d-flex gap-1">
                <span>
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
                <span className="fw-semibold fs-6">Share</span>
              </button>
            </div>
            <div className="block__option-wrapper d-flex align-items-center">
              <span className="d-flex align-items-center justify-content-center block__option-board-content ">
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
              </span>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavbarBoardContent;
