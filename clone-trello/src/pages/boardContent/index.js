/* eslint-disable no-undef */
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
        handleGetAllList();
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
        handleGetAllList();
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
        //console.log("archive list successful!");
        toast.success("List archived successfully!");
        handleGetAllList();
      }
    } catch (error) {
      toast.error("List archived failed!");
      console.error(error);
    }
  };

  const handleDropdownClick = (listID) => {
    //console.log("Dropdown clicked for list ID:", listID);
    setDropdownVisible(dropdownVisible === listID ? null : listID);
  };

  useEffect(() => {
    handleGetAllList();
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex block__board-content-container">
        <div className="d-flex w-100">
          <ol className="block__catalog-list d-flex gap-1 flex-column p-1">
            <NavbarBoardContent boardID={id} />
            <div className="d-flex">
              {allList
                .sort((a, b) => a.position - b.position)
                .map((catalogList, key) => (
                  <li
                    key={key}
                    className="block__list-element"
                    data-testid="list-wrapper"
                  >
                    <div className="block__list-element-wraper ">
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
                                onBlur={() =>
                                  handleBlurListTitle(catalogList.id)
                                }
                              ></textarea>
                            </div>
                          ) : (
                            <h6
                              className="mb-0 label-list-title"
                              onClick={() =>
                                handleClickTitleList(catalogList.id)
                              }
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
                              <div className="dropdown-header d-flex justify-content-between align-items-center">
                                <div className="flex-grow-1 text-center">
                                  <span>List actions</span>
                                </div>
                              </div>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  handleArchiveList(catalogList.id)
                                }
                              >
                                Archive this list
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Card
                        listIdProps={catalogList.id}
                        listNameProps={catalogList.name}
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
      </div>
    </React.Fragment>
  );
};

export default BoardContentPages;
