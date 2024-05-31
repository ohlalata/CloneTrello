/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import listServices from "../../api/Services/list.services";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import cardServices from "../../api/Services/card.services";
import { useParams } from "react-router-dom";

const BoardContentPages = () => {
  const { id } = useParams();

  const textareaRef = useRef(null);
  const textareaRefCardTitle = useRef(null);
  const inputAddList = useRef(null);

  const [isEditingTitleList, setIsEditingTitleList] = useState(false);
  const [inputTitleList, setInputTitleList] = useState("");
  const [isEditingCardTitle, setIsEditingCardTitle] = useState(false);
  const [inputCard, setInputCard] = useState("");
  const [allList, setAllList] = useState([]);
  const [isAddListInputVisible, setIsAddListInputVisible] = useState(false);
  const [titleList, setTitleList] = useState("");
  const [boardId, setBoardId] = useState();

  const [listCard, setListCard] = useState([]);

  const handleClickTitleList = () => {
    setIsEditingTitleList(true);
  };

  useEffect(() => {
    console.log("id", id);
  }, [id]);

  const handleChangeListTitle = (e) => {
    setInputTitleList(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleEditClickCardTitle = () => {
    setIsEditingCardTitle(true);
  };

  const handleChangeCardTitle = (e) => {
    setInputCard(e.target.value);
    const textareaCardTitle = textareaRefCardTitle.current;
    textareaCardTitle.style.height = "auto";
    textareaCardTitle.style.height = `${textareaCardTitle.scrollHeight}px`;
  };

  // const handleBlurCardTitle = () => {
  //   setIsEditingCardTitle(false);
  // };

  // const handleBlurListTitle = () => {
  //   setIsEditingTitleList(false);
  // };

  const handleInputAddList = () => {
    setIsAddListInputVisible(true);
  };

  const handleClickInputAddListOutside = (e) => {
    if (inputAddList.current && !inputAddList.current.contains(e.target)) {
      setIsAddListInputVisible(false);
    }
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
      const response = await listServices.getAllList();
      if (response.data.code == 200) {
        setAllList(response.data.data);
        console.log("get list list successfull!");
        console.log(response.data.data);
        setBoardId(response.data.data[0].boardId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateList = async () => {
    try {
      const response = await listServices.createList(boardId, titleList);
      if (response.data.code == 201) {
        console.log("create list successfull!");
        handleGetAllList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAllCard = async () => {
    try {
      const response = await cardServices.getAllCard();
      if (response.data.code == 200) {
        setListCard(response.data.data);
        console.log("get all card successfully!");
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllList();
    handleGetAllCard();
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex board-canvas">
        <div className="d-flex w-100">
          <ol className="block__catalog-list-content d-flex gap-2">
            {allList.map((catalogList, key) => (
              <li key={key} className="list-to-list" data-testid="list-wrapper">
                <div className="to-list">
                  <div className="title-to-list">
                    <div className="to-title">
                      {isEditingTitleList ? (
                        <textarea
                          ref={textareaRef}
                          placeholder={inputTitleList}
                          type="text"
                          value={inputTitleList}
                          onChange={handleChangeListTitle}
                        ></textarea>
                      ) : (
                        <h6
                          className="mb-0 list-content-text"
                          onClick={handleClickTitleList}
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
                  <ol className="list-card">
                    {listCard.map((catalogCard, key) => (
                      <li key={key}>
                        <div className="list-content">
                          <div className="list-content-cover">
                            <div className="list-content-proress"></div>
                            {isEditingCardTitle ? (
                              <textarea
                                className="list-content-text-input"
                                placeholder="Enter a title..."
                                type="text"
                                value={inputCard}
                                onChange={handleChangeCardTitle}
                                ref={textareaRefCardTitle}
                              ></textarea>
                            ) : (
                              <p className="list-content-text">
                                {catalogCard.title}
                              </p>
                            )}
                          </div>
                          <button
                            className="btn-edit-card-title"
                            onClick={handleEditClickCardTitle}
                          >
                            <span>
                              <FontAwesomeIcon icon={faPen} size="xs" />
                            </span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="add-a-list">
                    <span>
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                    <button>Add a card</button>
                  </div>
                </div>
              </li>
            ))}

            <li>
              <div>
                <h2>this is content id: {id}</h2>
              </div>
              <div>
                <div className="block__add-list">
                  {isAddListInputVisible ? (
                    <div className="d-flex p-2" ref={inputAddList}>
                      <div className="w-100 d-flex flex-column gap-2 ">
                        <input
                          className="w-100 border border-1 border-primary rounded-1"
                          placeholder="Enter list title..."
                          type="text"
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
