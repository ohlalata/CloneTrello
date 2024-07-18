import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import listServices from "../../api/Services/list";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import Card from "../../components/card";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import NavbarBoardContent from "../../components/navBarBoardContent";
import board from "../../api/Services/board";

const BoardContentPages = () => {
  const { id } = useParams();
  const textareaRef = useRef(null);
  const inputAddList = useRef(null);
  const [isEditingTitleList, setIsEditingTitleList] = useState(null);
  const [inputTitleList, setInputTitleList] = useState("");
  const [allList, setAllList] = useState([]);
  const [titleList, setTitleList] = useState("");
  const [isAddListInputVisible, setIsAddListInputVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [isMoveListMode, setIsMoveListMode] = useState(false);
  const [newPosition, setNewPosition] = useState("");

  const handleClickTitleList = (listIdVisible) => {
    setIsEditingTitleList(listIdVisible);
  };

  const handleChangeListTitle = (e) => {
    setInputTitleList(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleBlurListTitle = (listID) => {
    handleUpdateListName(listID);
    setIsEditingTitleList(false);
  };

  const handleClickInputAddListOutside = (e) => {
    if (inputAddList.current && !inputAddList.current.contains(e.target)) {
      setIsAddListInputVisible(false);
    }
  };

  const handleInputAddList = () => {
    setIsAddListInputVisible(true);
  };

  useEffect(() => {
    if (isAddListInputVisible) {
      document.addEventListener("mousedown", handleClickInputAddListOutside);
    } else {
      document.removeEventListener("mousedown", handleClickInputAddListOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickInputAddListOutside);
    };
  }, [isAddListInputVisible]);

  const handleGetAllList = async () => {
    let query = { boardId: id };
    try {
      const response = await listServices.getAllList(query);
      if (response.data.code == 200) {
        setAllList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetListByFilter = async () => {
    let query = { boardId: id, isActive: true };
    try {
      const response = await listServices.getListByFilter(query);
      if (response.data.code == 200) {
        setAllList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateListName = async (listID) => {
    // const formData = new FormData();
    // formData.append("BoardId", id);
    // formData.append("Name", inputTitleList);
    let query = {
      id: listID,
      boardId: id,
      name: inputTitleList,
    };
    try {
      const response = await listServices.updateListName(query);
      if (response.data.code == 200) {
        setInputTitleList("");
        handleGetListByFilter();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateList = async () => {
    let requestBody = {
      boardId: id,
      name: titleList,
    };
    try {
      const response = await listServices.createList(requestBody);
      if (response.data.code == 201) {
        setTitleList("");
        setIsAddListInputVisible(false);
        handleGetListByFilter();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveList = async (listID) => {
    let query = {
      id: listID,
      isActive: false,
    };
    try {
      const response = await listServices.changeStatus(query);
      if (response.data.code == 200) {
        window.location.reload();
        toast.success("List archived successfully!");
        handleGetListByFilter();
      }
    } catch (error) {
      toast.error("List archived failed!");
      console.error(error);
    }
  };

  const handleMoveList = async (listID, newPosition) => {
    let query = {
      id: listID,
      newPosition: newPosition,
    };
    try {
      const response = await listServices.moveList(query);
      if (response.data.code == 200) {
        toast.success("List moved successfully!");
        handleGetListByFilter();
      }
    } catch (error) {
      toast.error("List move failed!");
      console.error(error);
    }
  };

  const handleDropdownClick = (listID) => {
    setDropdownVisible(dropdownVisible === listID ? null : listID);
    setIsMoveListMode(false);
    setNewPosition(""); // Clear the input value when dropdown is toggled
  };

  const handleMoveListClick = () => {
    setIsMoveListMode(true);
  };

  const handleSaveClick = (listID) => {
    handleMoveList(listID, newPosition);
    setDropdownVisible(null); // Hide the dropdown after saving
  };

  useEffect(() => {
    handleGetListByFilter();
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex block__board-content-container">
        <ol className="block__catalog-list d-flex gap-1 flex-column p-1">
          <div className="d-flex w-100 block__navbar-boardContent-wrapper">
            <NavbarBoardContent boardID={id} />
          </div>

          <div className="d-flex">
            {allList
              .sort((a, b) => a.position - b.position)
              .map((catalogList, key) => (
                <li
                  key={key}
                  className="block__list-element"
                  data-testid="list-wrapper"
                >
                  <div className="block__list-element-wraper">
                    <div className="block__list-title-wraper">
                      <div className="block__list-title">
                        {isEditingTitleList == catalogList.id ? (
                          <div>
                            <textarea
                              rows={1}
                              ref={textareaRef}
                              placeholder={catalogList.name}
                              value={inputTitleList}
                              onChange={handleChangeListTitle}
                              autoFocus
                              onBlur={() => handleBlurListTitle(catalogList.id)}
                            ></textarea>
                          </div>
                        ) : (
                          <h6
                            className="mb-0 label-list-title"
                            onClick={() => handleClickTitleList(catalogList.id)}
                          >
                            {catalogList.name}
                          </h6>
                        )}
                      </div>

                      <div className="position-relative">
                        <button
                          className="btn__list-option"
                          onClick={() => handleDropdownClick(catalogList.id)}
                        >
                          <FontAwesomeIcon icon={faEllipsis} />
                        </button>
                        {dropdownVisible === catalogList.id && (
                          <div className="dropdown-menu dropdown-menu-right show">
                            {!isMoveListMode ? (
                              <>
                                <div className="dropdown-header d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1 text-center">
                                    <span>List actions</span>
                                  </div>
                                </div>
                                <button
                                  className="dropdown-item mt-2"
                                  onClick={() =>
                                    handleArchiveList(catalogList.id)
                                  }
                                >
                                  Archive this list
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={handleMoveListClick}
                                >
                                  Move this list
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="dropdown-header d-flex align-items-center">
                                  <div className="flex-grow-1 text-center">
                                    <span>Move List</span>
                                  </div>
                                </div>
                                <div className="dropdown-body p-2 mt-1">
                                  <label className="w-100">Position</label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    value={newPosition}
                                    onChange={(e) =>
                                      setNewPosition(e.target.value)
                                    }
                                  />
                                </div>
                                <button
                                  className="btn btn-primary w-20"
                                  style={{ marginLeft: "5px" }}
                                  onClick={() =>
                                    handleSaveClick(catalogList.id)
                                  }
                                >
                                  Save
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Card
                      listIdProps={catalogList.id}
                      listNameProps={catalogList.name}
                      listBoardIdProps={catalogList.boardId}
                    />
                  </div>
                </li>
              ))}

            <li>
              <div>
                <div className="block__add-list">
                  {isAddListInputVisible ? (
                    <div className="d-flex p-2" ref={inputAddList}>
                      <div className="w-100 d-flex flex-column gap-2 ">
                        <input
                          className="w-100 border border-1 border-primary rounded-1"
                          placeholder="Enter list title..."
                          value={titleList}
                          onChange={(e) => setTitleList(e.target.value)}
                          autoFocus
                        ></input>
                        <div className="d-flex justify-content-start gap-3">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleCreateList()}
                          >
                            Add list
                          </button>
                          <button
                            className="btn__close-input-add-list"
                            onClick={() => setIsAddListInputVisible(false)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-start gap-2 p-2 block__label-add-list">
                      <div>
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                      <div onClick={handleInputAddList} className="w-100">
                        <p className="mb-0 fw-semibold">Add another list</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          </div>
        </ol>
      </div>
    </React.Fragment>
  );
};

export default BoardContentPages;
