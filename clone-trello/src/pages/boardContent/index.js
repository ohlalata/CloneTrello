import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import listServices from "../../api/Services/list";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import Card from "../../components/card";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import NavbarBoardContent from "../../components/navBarBoardContent";
import { motion } from "framer-motion";
import * as constants from "../../shared/constants";

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
  const [childKey, setChildKey] = useState(0);

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
        setChildKey(childKey + 1);
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

  //convert UUID to num
  const hashCode = (str) => {
    return str?.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
  };

  // id item to image
  const getImageForItem = (itemId) => {
    const hash = hashCode(itemId);
    const index = Math.abs(hash) % boardTheme.length;
    return boardTheme[index];
  };

  return (
    <React.Fragment>
      <div className="d-flex block__board-content-container">
        <ol
          className="block__catalog-list d-flex gap-1 flex-column p-1"
          style={{ backgroundImage: `url(${getImageForItem(id)})` }}
        >
          <div className="d-flex w-100 block__navbar-boardContent-wrapper">
            <NavbarBoardContent boardID={id} />
          </div>

          <div className="d-flex">
            {allList
              .sort((a, b) => a.position - b.position)
              .map((catalogList, key) => (
                <motion.li
                  key={key}
                  className="block__list-element"
                  data-testid="list-wrapper"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: key * 0.1 }}
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
                              //value={titleList}
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
                                    type="number"
                                    className="form-control mt-1"
                                    value={newPosition}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Only allow integer values
                                      if (
                                        (Number.isInteger(Number(value)) &&
                                          Number(value) >= 0) ||
                                        value === ""
                                      ) {
                                        setNewPosition(value);
                                      }
                                    }}
                                    step="1"
                                    min="1"
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
                      data={allList}
                      key={childKey}
                    />
                  </div>
                </motion.li>
              ))}

            <motion.li
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: allList.length * 0.1 }}
            >
              <div>
                <div className="block__add-list">
                  {isAddListInputVisible ? (
                    <motion.div
                      className="d-flex p-2"
                      ref={inputAddList}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
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
                    </motion.div>
                  ) : (
                    <motion.div
                      className="d-flex justify-content-start gap-2 p-2 block__label-add-list"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                      <div onClick={handleInputAddList} className="w-100">
                        <p className="mb-0 fw-semibold">Add another list</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.li>
          </div>
        </ol>
      </div>
    </React.Fragment>
  );
};

export default BoardContentPages;
