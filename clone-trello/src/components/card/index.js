import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import cardServices from "../../api/Services/card";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import * as constants from "../../shared/constants";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const Card = (listIdProps) => {
  const textareaRefCardTitle = useRef(null);
  const textAreaRefCreateCardTitle = useRef(null);

  const [EditingCardTitle, setEditingCardTitle] = useState(null);
  const [inputTitleCard, setInputTitleCard] = useState("");
  const [listCard, setListCard] = useState([]);

  const [addCardTitleVisible, setAddCardTitleVisible] = useState(false);

  const [titleCard, setTitleCard] = useState("");

  const [isModalCardShow, setIsModalCardShow] = useState(false);
  const [modalCardDetail, setModalCardDetail] = useState({});

  const handleModalCard = (objCardDetail) => {
    setModalCardDetail(objCardDetail);
    setIsModalCardShow(!isModalCardShow);
  };

  const handleAddCardTitle = () => {
    setAddCardTitleVisible(true);
  };

  const handleEditClickCardTitle = (cardIdVisible, e) => {
    e.stopPropagation();
    setEditingCardTitle(cardIdVisible);
  };

  const handleChangeCardTitle = (e) => {
    setInputTitleCard(e.target.value);
    const textareaCardTitle = textareaRefCardTitle.current;
    textareaCardTitle.style.height = "auto";
    textareaCardTitle.style.height = `${textareaCardTitle.scrollHeight}px`;
  };

  const handleChangeCreateCardTitle = (e) => {
    setTitleCard(e.target.value);
    const textareaCreateCardTitle = textAreaRefCreateCardTitle.current;
    textareaCreateCardTitle.style.height = "auto";
    textareaCreateCardTitle.style.height = `${textareaCreateCardTitle.scrollHeight}px`;
  };

  const handleGetAllCard = async () => {
    try {
      const response = await cardServices.getAllCard(listIdProps.listIdProps);
      if (response.data.code == 200) {
        setListCard(response.data.data);
        console.log("get all card successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCardTitle = async (cardID) => {
    console.log("cardID", cardID);
    console.log("text", inputTitleCard);

    const formData = new FormData();
    formData.append("Title", inputTitleCard);
    try {
      const response = await cardServices.updateCardTitle(cardID, formData);
      if (response.data.code == 200) {
        console.log("update card title successfull");
        setEditingCardTitle("false");
        handleGetAllCard();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCard = async () => {
    try {
      const response = await cardServices.createCard(
        listIdProps.listIdProps,
        titleCard
      );
      if (response.data.code == 201) {
        console.log("create card successfull!");
        setTitleCard("");
        setAddCardTitleVisible(false);
        handleGetAllCard();
      }
    } catch (error) {
      console.error(error);
      console.log("create card fail!");
    }
  };

  useEffect(() => {
    handleGetAllCard();
  }, []);

  return (
    <React.Fragment>
      <ol className="block__list-card">
        {listCard.map((catalogCard, key) => (
          <li key={key}>
            <div
              className="block__card-wraper"
              onClick={() => handleModalCard(catalogCard)}
            >
              <div className="block__card-content">
                <div className="block__card-proress"></div>
                {EditingCardTitle == catalogCard.id ? (
                  <div>
                    <textarea
                      className="textarea__input-card-tite"
                      placeholder="Enter a title..."
                      value={inputTitleCard}
                      onChange={handleChangeCardTitle}
                      ref={textareaRefCardTitle}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    ></textarea>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="d-flex justify-content-around"
                    >
                      <button
                        className="btn btn-primary btn-sm col-5"
                        onClick={() => handleUpdateCardTitle(catalogCard.id)}
                      >
                        <span className="fw-semibold">Save</span>
                      </button>
                      <button
                        className="btn btn-secondary btn-sm col-5"
                        onClick={() => setEditingCardTitle(false)}
                      >
                        <span className="fw-semibold">Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <p className="label-card-title">{catalogCard.title}</p>
                    <button
                      className="btn__edit-card-title"
                      onClick={(e) =>
                        handleEditClickCardTitle(catalogCard.id, e)
                      }
                    >
                      <span>
                        <FontAwesomeIcon icon={faPen} size="sm" />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {isModalCardShow && modalCardDetail && (
        <Modal
          show={isModalCardShow}
          onHide={handleModalCard}
          centered
          size="lg"
        >
          <ModalHeader closeButton className="block__modal-header ">
            <div className="d-flex flex-column">
              <div className="d-flex gap-2 justify-content-start align-items-center ">
                <FontAwesomeIcon icon={faTable} size="lg" />
                <span className="fs-4 fw-semibold">
                  {modalCardDetail.title}
                </span>
              </div>
              <span>in list {listIdProps.listNameProps}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="d-flex ">
              <div className="col-9 px-2">
                <div>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 align-items-center">
                      <div>
                        <FontAwesomeIcon icon={faAlignLeft} />
                      </div>
                      <div>
                        <span className="label__modal-description fw-semibold">
                          Description
                        </span>
                      </div>
                    </div>

                    <div>
                      <button className="btn btn-secondary btn-sm">
                        <span className="fw-semibold">Edit</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    {modalCardDetail.description == null ? (
                      <div className="block__input-description p-2 mt-3">
                        <span
                          className="fw-semibold ps-1"
                          style={{ fontSize: "15px" }}
                        >
                          Add a more detailed description...{" "}
                        </span>
                      </div>
                    ) : (
                      <div>{modalCardDetail.description}</div>
                    )}
                  </div>
                  <div>Rich Text</div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div className="d-flex gap-2 align-items-center">
                    <div>
                      <FontAwesomeIcon icon={faListUl} />
                    </div>
                    <div>
                      <span className="label__modal-activity fw-semibold">
                        Activity
                      </span>
                    </div>
                  </div>

                  <div>
                    <button className="btn btn-secondary btn-sm">
                      <span className="fw-semibold">Show details</span>
                    </button>
                  </div>
                </div>
                <div className="d-flex mt-3 gap-2 mt-3">
                  <div className="block__user-comment">
                    <img src={constants.USER_UNDEFINE_URL} />
                  </div>
                  <div className="flex-fill p-2 block__input-comment">
                    <span>Write a comment...</span>
                  </div>
                </div>
              </div>
              <div className="col-3 px-2">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                    <div>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <span>Join</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                    <div>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <span>Members</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                    <div>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </div>
                    <span>Archive</span>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}

      <div>
        {addCardTitleVisible ? (
          <div className="form__add-card">
            <textarea
              className="form__card-title p-1"
              placeholder="Enter a title for this card..."
              value={titleCard}
              onChange={handleChangeCreateCardTitle}
              autoFocus
              ref={textAreaRefCreateCardTitle}
            ></textarea>
            <div className="d-flex justify-content-start gap-2 mt-1">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCreateCard}
              >
                <span className="fw-semibold">Add card</span>
              </button>
              <button
                className="btn__close-add-card"
                onClick={() => setAddCardTitleVisible(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        ) : (
          <div className="add-a-card" onClick={handleAddCardTitle}>
            <span>
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <button>Add a card</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Card;
