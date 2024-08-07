import React, { useEffect, useState, useRef, useContext } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faPen,
  faAngleLeft,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Overlay, Button } from "react-bootstrap";
import * as constants from "../../shared/constants";
import cardLabelService from "../../api/Services/cardLabel";
import { toast } from "react-toastify";
import labelService from "../../api/Services/label";

const CardLabel = (cardId) => {
  const cardLabelRef = useRef(null);

  const [cardLabelTarget, setCardLabelTarget] = useState(null);
  const [cardLabel, setCardLabel] = useState([]);
  const [labelExist, setLabelExist] = useState([]);

  const [isShowCardLabel, setIsShowCardLabel] = useState(false);
  const [isCreateCardLabel, setIsCreateCardLabel] = useState(false);
  const [selectCardLabel, setSelectCardLabel] = useState(20);
  const [colorSelected, setColorSelected] = useState("#579dff");
  const [isDisableCreate, setIsDisableCreate] = useState(false);

  const [isUpdateCardLabel, setIsUpdateCardLabel] = useState(false);

  const [titleCardLabel, setTitleCardLabel] = useState("");

  const [labelCardId, setLabelCardId] = useState("");

  const [isCardLabelChecked, setIsCardLabelChecked] = useState(false);

  const handleCheckboxChange = (event, id, name) => {
    setIsCardLabelChecked(event.target.checked);
    console.log(event.target.checked);
    console.log(event.target);
    console.log("iddd", id);
    console.log("name name, ", name);

    ////////////////////////////////////////////////////////////////////////////////////
    if (event.target.checked) {
      handleCreateExistCardLabel(id);
    } else {
      handleGetCardLabelByFilter(name);
    }
  };

  const handleCardLabelTitle = (e) => {
    setTitleCardLabel(e.target.value);
  };

  const handleUpdateCardLabel = (name, color, id) => {
    setIsUpdateCardLabel(true);
    setTitleCardLabel(name);
    setColorSelected(color);
    setLabelCardId(id);

    constants.LABEL_COLOR.forEach((element, index) => {
      if (element == color) {
        setSelectCardLabel(index);
        return;
      }
    });
  };

  const handleHideCardLabel = () => {
    setIsShowCardLabel(false);
  };

  const handlePopoverCardLabel = (event) => {
    if (isShowCardLabel) return;
    setIsShowCardLabel(true);
    setCardLabelTarget(event.target);
  };

  const handleCreateCardLabel = () => {
    setIsCreateCardLabel(true);
  };

  const handleSelectCardLabel = (color, index) => {
    setSelectCardLabel(index);
    setColorSelected(color);
    setIsDisableCreate(false);
  };

  const handleRemoveColor = () => {
    setColorSelected("#e9ebee");
    setSelectCardLabel("99");
    setIsDisableCreate(true);
  };

  const handleBackCardLabel = () => {
    setIsCreateCardLabel(false);
    setIsUpdateCardLabel(false);
  };

  const handleGetCardLabelByFilter = async (name) => {
    let query = { cardId: cardId.cardId, labelName: name, isActive: true };
    try {
      const response = await cardLabelService.getCardLabelByFilter(query);
      if (response.data.code == 200) {
        try {
          let queryDelete = { id: response.data.data[0].id, isActive: false };
          const responseDelete = await cardLabelService.deleteCardLabel(
            queryDelete
          );
          if (responseDelete.data.code == 200) {
            console.log("delete card label ok");
            handleGetAllExistCardLabel();
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleChangeStatusCardLabel = async (id, isActive) => {
  //   let query = { id: id, isActive: isActive };
  //   try {
  //     const response = await cardLabelService.deleteCardLabel(query);
  //     if (response.data.code == 200) {
  //       console.log("delete card label ok");
  //       handleGetAllExistCardLabel();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleGetAllExistCardLabel = async () => {
    let query = { cardId: cardId.cardId };
    try {
      const response = await cardLabelService.getAllCardLabel(query);
      if (response.data.code == 200) {
        setCardLabel(response.data.data);
        console.log("CARD LABEL: ", response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateExistCardLabel = async (labelId) => {
    let query = { cardId: cardId.cardId, labelId: labelId };
    try {
      const response = await cardLabelService.createCardLabel(query);
      if (response.data.code == 201) {
        // setCardLabel(response.data.data);
        console.log("create card label ok");
        handleGetAllExistCardLabel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteExistLabel = async () => {
    let query = { id: labelCardId, isActive: false };
    try {
      const response = await labelService.deleteLabel(query);
      if (response.data.code == 200) {
        console.log("delete card label ok");
        toast.success("Inactive card label successful");
        setIsUpdateCardLabel(false);
        handleGetAllLabel();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`${error.response.data.data}`);
      } else {
        toast.error("Error inactive card label: An unexpected error occurred");
      }
      console.error("Error inactive card label:", error);
    }
  };

  const handleUpdateExistLabel = async () => {
    let requestBody = {
      id: labelCardId,
      name: titleCardLabel,
      color: colorSelected,
    };
    try {
      const response = await labelService.updateLabel(requestBody);
      if (response.data.code == 200) {
        setIsUpdateCardLabel(false);
        toast.success("Update card label successful");
        setTitleCardLabel("");
        handleGetAllLabel();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`${error.response.data.data}`);
      } else {
        toast.error("Error updating card label: An unexpected error occurred");
      }
      console.error("Error updating card label:", error);
    }
  };

  const handleGetAllLabel = async () => {
    let query = { boardId: cardId.boardId };
    try {
      const response = await labelService.getAllLabel(query);
      if (response.data.code == 200) {
        //setCardLabel(response.data.data);
        setLabelExist(response.data.data);
        console.log("new Labell", response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNewLabel = async () => {
    let queryLabel = {
      boardId: cardId.boardId,
      name: titleCardLabel,
      color: colorSelected,
    };
    try {
      const responseLabel = await labelService.createLabel(queryLabel);
      if (responseLabel.data.code == 201) {
        try {
          let queryCardLabel = {
            cardId: cardId.cardId,
            labelId: responseLabel.data.data.id,
          };
          const responseCardLabel = await cardLabelService.createCardLabel(
            queryCardLabel
          );
          if (responseCardLabel.data.code == 201) {
            setIsCreateCardLabel(false);
            toast.success("Create label successful");
            setTitleCardLabel("");
            handleGetAllLabel();
            handleGetAllExistCardLabel();
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`${error.response.data.data}`);
      } else {
        toast.error("Error create label: An unexpected error occurred");
      }
      console.error("Error create label:", error);
    }
  };

  useEffect(() => {
    handleGetAllExistCardLabel();
    handleGetAllLabel();
  }, []);

  useEffect(() => {
    cardId.onItemsUpdate(cardLabel);
  }, [cardLabel]);
  return (
    <React.Fragment>
      <div
        ref={cardLabelRef}
        onClick={(e) => handlePopoverCardLabel(e)}
        className="block__popover-card-label-wrapper"
      >
        <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
          <div>
            <FontAwesomeIcon icon={faTags} />
          </div>
          <span>Label</span>
        </div>

        <Overlay
          show={isShowCardLabel}
          target={cardLabelTarget}
          placement="right"
          container={cardLabelRef.current}
          rootClose={true}
          onHide={handleHideCardLabel}
        >
          <Popover
            id="popover-card-label"
            className="block__popover-card-label"
          >
            <Popover.Header
              className="d-flex justify-content-between"
              style={{ backgroundColor: "#ffffff" }}
            >
              {isCreateCardLabel || isUpdateCardLabel ? (
                <div onClick={handleBackCardLabel}>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </div>
              ) : (
                <div></div>
              )}

              {isCreateCardLabel ? (
                <span className="fw-semibold"> Create Labels </span>
              ) : isUpdateCardLabel ? (
                <span className="fw-semibold">Edit Labels </span>
              ) : (
                <span className="fw-semibold"> Labels </span>
              )}

              <div>
                <Button
                  size="sm"
                  variant="close"
                  aria-label="Close"
                  onClick={handleHideCardLabel}
                />
              </div>
            </Popover.Header>
            <Popover.Body>
              {isCreateCardLabel || isUpdateCardLabel ? (
                <div className="d-flex flex-column gap-3">
                  <div className="block__sample-color-wrapper d-flex justify-content-center align-items-center ">
                    <div
                      className="block__sample-color"
                      style={{ backgroundColor: colorSelected }}
                    ></div>
                  </div>

                  <div>
                    <span className="fw-semibold title__caption">Title</span>
                    <input
                      type="text"
                      name="title-card-label"
                      className="w-100 border border-2 p-1 rounded-1 mt-1"
                      value={titleCardLabel}
                      onChange={handleCardLabelTitle}
                    ></input>
                  </div>

                  <div>
                    <span className="fw-semibold title__caption">
                      Select a color
                    </span>
                    <div className="block__grid-container mt-2">
                      {constants.LABEL_COLOR.map((color, index) => (
                        <div
                          key={index}
                          className={`block__color-box ${selectCardLabel == index
                            ? "block__selected-color"
                            : ""
                            }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleSelectCardLabel(color, index)}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="d-flex justify-content-center block__remove-color"
                    onClick={handleRemoveColor}
                  >
                    <span className="fw-semibold">
                      <FontAwesomeIcon icon={faXmark} /> Remove color
                    </span>
                  </div>

                  <div className="w-100 border border-1"></div>

                  <div className="d-flex justify-content-between">
                    {isCreateCardLabel && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isDisableCreate}
                        onClick={handleCreateNewLabel}
                      >
                        Create
                      </button>
                    )}
                    {isUpdateCardLabel && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleUpdateExistLabel}
                      >
                        Save
                      </button>
                    )}

                    {isUpdateCardLabel && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleDeleteExistLabel}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <div>
                    <input
                      className="w-100 border border-2 p-1 rounded-1 "
                      name="search-label"
                      type="text"
                      placeholder="Search labels..."
                    // value={}
                    // onChange={}
                    ></input>
                  </div>
                  <div>
                    <span className="fw-semibold label__caption">Labels</span>

                    <div className="mt-2 d-flex flex-column gap-1">
                      {labelExist.map((cardLabels, key) => (
                        <div
                          key={key}
                          className="d-flex justify-content-between "
                        >
                          <div className="col-1 d-flex justify-content-center align-items-center">
                            <input
                              checked={cardLabel
                                .map((a) => a.labelId)
                                .includes(cardLabels.id)}
                              type="checkbox"
                              className="checkbox__card-label"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  cardLabels.id,
                                  cardLabels.name
                                )
                              }
                            />
                          </div>
                          <div
                            className="col-9 d-flex justify-content-start align-items-center"
                            style={{
                              height: "30px",
                              backgroundColor: `${cardLabels.color}`,
                              borderRadius: "3px",
                            }}
                          >
                            <span className="ms-3 fw-semibold">
                              {cardLabels.name}
                            </span>
                          </div>
                          <div
                            className="col-1 d-flex justify-content-center align-items-center"
                            onClick={() =>
                              handleUpdateCardLabel(
                                cardLabels.name,
                                cardLabels.color,
                                cardLabels.id
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="block__create_card-label d-flex justify-content-center mt-2"
                      onClick={handleCreateCardLabel}
                    >
                      <span className="fw-semibold">Create a new label</span>
                    </div>
                  </div>
                </div>
              )}
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
    </React.Fragment>
  );
};

export default CardLabel;
