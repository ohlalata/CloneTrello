/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import listServices from "../../api/Services/list.services";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import Card from "../../components/Card";

const BoardContentPages = () => {
  const { id } = useParams();
  const textareaRef = useRef(null);
  const inputAddList = useRef(null);
  const [isEditingTitleList, setIsEditingTitleList] = useState(null);
  const [inputTitleList, setInputTitleList] = useState("");
  const [allList, setAllList] = useState([]);
  const [titleList, setTitleList] = useState("");
  const [isAddListInputVisible, setIsAddListInputVisible] = useState(false);

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
    try {
      const response = await listServices.getAllList(id);
      if (response.data.code == 200) {
        setAllList(response.data.data);
        console.log("get list list successfull!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateListName = async (listID) => {
    const formData = new FormData();
    formData.append("BoardId", id);
    formData.append("Name", inputTitleList);
    try {
      const response = await listServices.updateListName(listID, formData);
      if (response.data.code == 200) {
        console.log("update list name successfull!");
        handleGetAllList();
      }
    } catch (error) {
      console.error(error);
      console.log("handle update list name fail!");
    }
  };

  const handleCreateList = async () => {
    try {
      const response = await listServices.createList(id, titleList);
      if (response.data.code == 201) {
        console.log("create list successfull!");
        setTitleList("");
        handleGetAllList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllList();
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex board-canvas">
        <div className="d-flex w-100">
          <ol className="block__catalog-list-content d-flex gap-1">
            {allList.map((catalogList, key) => (
              <li key={key} className="list-to-list" data-testid="list-wrapper">
                <div className="to-list ">
                  <div className="title-to-list">
                    <div className="to-title">
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
                          className="mb-0 list-content-text"
                          onClick={() => handleClickTitleList(catalogList.id)}
                        >
                          {catalogList.name}
                        </h6>
                      )}
                    </div>

                    <div>
                      <button className="option-to-title">
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>
                    </div>
                  </div>
                  <Card listIdProps={catalogList.id} />
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
          </ol>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BoardContentPages;
