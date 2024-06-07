import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import cardServices from "../../api/Services/card.services";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

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

  const handleEditClickCardTitle = (cardIdVisible) => {
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
                    ></textarea>
                    <div className="d-flex justify-content-around pb-2">
                      <button
                        className="btn btn-primary btn-sm col-5"
                        onClick={() => handleUpdateCardTitle(catalogCard.id)}
                      >
                        <span className="fw-semibold">Save</span>
                      </button>
                      <button className="btn btn-secondary btn-sm col-5">
                        <span
                          className="fw-semibold"
                          onClick={() => setEditingCardTitle(false)}
                        >
                          Cancel
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex">
                    <p className="label-card-title">{catalogCard.title}</p>
                    <button
                      className="btn__edit-card-title"
                      onClick={() => handleEditClickCardTitle(catalogCard.id)}
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
      {/* ---------- */}
      {isModalCardShow && modalCardDetail && (
        <Modal
          show={isModalCardShow}
          onHide={handleModalCard}
          centered
          size="lg"
        >
          <ModalHeader closeButton className="block__modal-header">
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <FontAwesomeIcon icon={faTable} size="lg" />
              <span className="fs-4 fw-semibold">{modalCardDetail.title}</span>
            </div>
            <span>in list ... </span>
          </ModalHeader>
          <ModalBody>
            <div className="d-flex ">
              <div className="col-9">
                <div>CCCCC</div>
                <div>
                  <div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex gap-3 align-items-center">
                        <div>
                          <FontAwesomeIcon icon={faAlignLeft} />
                        </div>
                        <div>
                          <span className="fs-5 fw-semibold">Description</span>
                        </div>
                      </div>

                      <div>
                        <button className="btn btn-secondary btn-sm">
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="block__input-description p-2 mt-3">
                        <span className="fw-semibold">
                          Add a more detailed description...{" "}
                        </span>
                      </div>
                      <p className="mb-0">Description</p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div>Comment</div>
                </div>
              </div>
              <div className="col-3">BBBBB</div>
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
