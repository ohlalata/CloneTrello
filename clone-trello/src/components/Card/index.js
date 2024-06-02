import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import cardServices from "../../api/Services/card.services";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Card = (listIdProps) => {
  const textareaRefCardTitle = useRef(null);
  const textAreaRefCreateCardTitle = useRef(null);

  const [isEditingCardTitle, setIsEditingCardTitle] = useState(null);
  const [inputTitleCard, setInputTitleCard] = useState("");
  const [listCard, setListCard] = useState([]);

  const [addCardTitleVisible, setAddCardTitleVisible] = useState(false);

  const [titleCard, setTitleCard] = useState("");

  const handleAddCardTitle = () => {
    setAddCardTitleVisible(true);
  };

  const handleEditClickCardTitle = (cardIdVisible) => {
    setIsEditingCardTitle(cardIdVisible);
  };

  const handleBlurCardTitle = () => {
    setIsEditingCardTitle(false);
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
      <ol className="list-card">
        {listCard.map((catalogCard, key) => (
          <li key={key}>
            <div className="list-content">
              <div className="list-content-cover">
                <div className="list-content-proress"></div>
                {isEditingCardTitle == catalogCard.id ? (
                  <textarea
                    className="list-content-text-input"
                    placeholder="Enter a title..."
                    value={inputTitleCard}
                    onChange={handleChangeCardTitle}
                    ref={textareaRefCardTitle}
                    onBlur={handleBlurCardTitle}
                    autoFocus
                  ></textarea>
                ) : (
                  <p className="list-content-text">{catalogCard.title}</p>
                )}
              </div>
              <button
                className="btn-edit-card-title"
                onClick={() => handleEditClickCardTitle(catalogCard.id)}
              >
                <span>
                  <FontAwesomeIcon icon={faPen} size="xs" />
                </span>
              </button>
            </div>
          </li>
        ))}
      </ol>
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
