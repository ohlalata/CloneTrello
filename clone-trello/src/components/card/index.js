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
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Popover, Overlay, Button, ButtonGroup } from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

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
  const [richTextVisible, setRichTextVisible] = useState(false);
  const [activityVisible, setActivityVisible] = useState(true);
  const [isCardTitleModal, setIsCardTitleModal] = useState(true);
  const [CardTitleModal, setCardTitleModal] = useState("");
  const [DescriptionTemp, setDescriptionTemp] = useState("");

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  //------------------------------------------------------------
  const datePopoverRef = useRef(null);
  const [datePopover, setDatePopover] = useState(false);
  const [datePopoverTarget, setDatePopoverTarget] = useState(null);

  const initiallySelectedDate = new Date();
  const [daySelected, setDaySelected] = useState(initiallySelectedDate);

  const [isStartDay, setIsStartDay] = useState(true);
  const [isDueDay, setIsDueDay] = useState(false);

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const [startDay, setStartDay] = useState("M/D/YYYY");
  const [dueDay, setDueDay] = useState(format(daySelected, "MM/dd/yyyy"));
  const [dueTime, setDueTime] = useState(formatAMPM(initiallySelectedDate));

  const handleDatePopoverClick = (event) => {
    if (datePopover) return;
    // event.preventDefault();
    // event.stopPropagation();
    setDatePopover(true);
    setDatePopoverTarget(event.target);
    console.log(event);
  };

  const handleHideDatePopover = () => {
    setDatePopover(false);
  };

  const dayChange = (day, selectedDay, activeModifiers, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("day: ", day);
    console.log("selectedDay: ", selectedDay);
    console.log("activeModifiers: ", activeModifiers);
    console.log("event: ", e);
    setDaySelected(selectedDay);
  };

  //----------------------------------------------------------------

  const handleStartDayDisable = () => {
    setIsStartDay(!isStartDay);
  };

  const handleDueDayDisable = () => {
    setIsDueDay(!isDueDay);
  };

  const handleChangeStartDay = (e) => {
    setStartDay(e.target.value);
  };

  const handleChangeDueDay = (e) => {
    setDueDay(e.target.value);
  };

  const handleChangeDueTime = (e) => {
    setDueTime(e.target.value);
  };

  useEffect(() => {}, []);

  //-----------------------------------------------------------------

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleChangeCardTitleModal = (e) => {
    setCardTitleModal(e.target.value);
  };

  const handleCardTitleModal = (cardTitleModalRaw) => {
    setIsCardTitleModal(false);
    setCardTitleModal(cardTitleModalRaw);
  };

  const handleActivityVisible = () => {
    setActivityVisible(!activityVisible);
  };

  const saveContent = (id, title) => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const contentString = draftToHtml(rawContent);

    // console.log(
    //   typeof draftToHtml(convertToRaw(editorState.getCurrentContent()))
    // );
    // console.log("contentString", contentString);

    setDescriptionTemp(contentString);
    handleUpdateDescription(id, contentString, title);
  };

  const handleModalCard = (objCardDetail) => {
    setModalCardDetail(objCardDetail);
    setIsModalCardShow(!isModalCardShow);
    setDatePopover(false);
    handleGetAllCard();
  };

  const handleAddCardTitle = () => {
    setAddCardTitleVisible(true);
  };

  const handleRichTextVisible = () => {
    setRichTextVisible(true);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDescription = async (cardID, description, tite) => {
    const formData = new FormData();
    formData.append("Description", description);
    formData.append("Title", tite);

    try {
      const response = await cardServices.updateCardDescription(
        cardID,
        formData
      );
      if (response.data.code == 200) {
        setModalCardDetail(response.data.data);
        setRichTextVisible(false);
        console.log("update description ok!");
        handleGetAllCard();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCardTitle = async (cardID) => {
    const formData = new FormData();
    formData.append("Title", inputTitleCard);
    try {
      const response = await cardServices.updateCardTitle(cardID, formData);
      if (response.data.code == 200) {
        setEditingCardTitle("false");
        handleGetAllCard();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCardTitleModal = async (cardID) => {
    const formData = new FormData();
    formData.append("Title", CardTitleModal);
    try {
      const response = await cardServices.updateCardTitle(cardID, formData);
      if (response.data.code == 200) {
        setIsCardTitleModal(true);
        setModalCardDetail(response.data.data);
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
        setTitleCard("");
        setAddCardTitleVisible(false);
        handleGetAllCard();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveCard = async (cardID) => {
    try {
      const response = await cardServices.changeStatus(cardID, false);
      if (response.data.code === 200) {
        window.location.reload();

        toast.success("Card archived successfully!");
        setIsModalCardShow(false);
        handleGetAllCard();
      }
    } catch (error) {
      toast.error("Card archived failed!");
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllCard();
  }, []);

  useEffect(() => {
    const contentString = modalCardDetail?.description;

    // console.log(typeof modalCardDetail?.description);

    if (modalCardDetail?.description) {
      setDescriptionTemp(contentString);
      // console.log(contentString);
    }
  }, [isModalCardShow, richTextVisible]);

  return (
    <React.Fragment>
      <ol className="block__list-card">
        {listCard
          .sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
          .map((catalogCard, key) => (
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
            <div className="d-flex flex-column w-100">
              <div className="d-flex gap-2 justify-content-start align-items-center w-100">
                <FontAwesomeIcon icon={faTable} size="lg" />
                {isCardTitleModal ? (
                  <span
                    className="fs-4 fw-semibold w-100"
                    onClick={() => handleCardTitleModal(modalCardDetail.title)}
                  >
                    {modalCardDetail.title}
                  </span>
                ) : (
                  <input
                    name="input-card-title-modal"
                    className="w-100  fw-semibold fs-4"
                    type="text"
                    value={CardTitleModal}
                    onChange={handleChangeCardTitleModal}
                    onBlur={() =>
                      handleUpdateCardTitleModal(modalCardDetail.id)
                    }
                    autoFocus
                  ></input>
                )}
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

                    {modalCardDetail.description == null ? (
                      <div></div>
                    ) : (
                      <div>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleRichTextVisible}
                        >
                          <span className="fw-semibold">Edit</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {richTextVisible ? (
                    <div className="d-flex flex-column gap-2">
                      <div className="block__rich-text-editor">
                        <Editor
                          editorState={editorState}
                          wrapperClassName="wrapperClassName"
                          toolbarClassName="toolbarClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={handleEditorChange}
                        />
                      </div>
                      <div className="d-flex justify-content-start gap-3">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            saveContent(
                              modalCardDetail.id,
                              modalCardDetail.title
                            )
                          }
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setRichTextVisible(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={handleRichTextVisible}>
                      {!modalCardDetail.description ? (
                        <div className="block__input-description p-2 mt-3">
                          <span
                            className="fw-semibold ps-1"
                            style={{ fontSize: "15px" }}
                          >
                            Add a more detailed description...{" "}
                          </span>
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: DescriptionTemp }}
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* <div className="d-flex justify-content-between mt-3">
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

                  {activityVisible ? (
                    <div>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleActivityVisible}
                      >
                        <span className="fw-semibold">Hide details</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleActivityVisible}
                      >
                        <span className="fw-semibold">Show details</span>
                      </button>
                    </div>
                  )}
                </div> */}

                {/* <div>
                  <div className="d-flex gap-2 mt-2 align-items-center">
                    <div className="block__user-comment">
                      <img src={constants.USER_UNDEFINE_URL} />
                    </div>
                    <div className="flex-fill p-2 block__input-comment">
                      <span>Write a comment...</span>
                    </div>
                  </div>

                  <div className="d-flex mt-3 gap-2">
                    <div className="block__user-comment">
                      <img src={constants.USER_UNDEFINE_URL} />
                    </div>
                    <div className="w-100 d-flex flex-column">
                      <div>
                        <div className="d-flex gap-2">
                          <span>Name</span>
                          <span>Jun 18 at 14:15 PM</span>
                        </div>
                        <div className="flex-fill p-2 block__input-comment">
                          <span>...comment here...</span>
                        </div>
                      </div>
                      <div className="d-flex gap-1 mt-1 ms-2">
                        <span className="label__comment-action">Edit</span>
                        <span>•</span>
                        <span className="label__comment-action">Delete</span>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* {activityVisible && (
                  <div className="d-flex gap-2 p-1">
                    <div className="block__user-activity">
                      <img src={constants.USER_UNDEFINE_URL} />
                    </div>
                    <div className="d-flex flex-column">
                      <div className="d-flex gap-1">
                        <span>name</span>
                        <span>activity</span>
                      </div>

                      <span>time</span>
                    </div>
                  </div>
                )} */}
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

                  <div
                    ref={datePopoverRef}
                    onClick={(e) => handleDatePopoverClick(e)}
                  >
                    <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                      <div>
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <span>Dates</span>
                    </div>

                    <Overlay
                      show={datePopover}
                      target={datePopoverTarget}
                      placement="right"
                      container={datePopoverRef.current}
                      containerPadding={12}
                      rootClose={true}
                      onHide={handleHideDatePopover}
                    >
                      <Popover
                        id="datePopover-contained"
                        className="block__datePopover-visibility"
                      >
                        <Popover.Header
                          className="d-flex justify-content-between"
                          style={{ backgroundColor: "#ffffff" }}
                        >
                          <div></div>
                          <span className="fw-semibold label__dates">
                            Dates
                          </span>
                          <div>
                            <Button
                              size="sm"
                              variant="close"
                              aria-label="close"
                              onClick={handleHideDatePopover}
                            />
                          </div>
                        </Popover.Header>
                        <Popover.Body>
                          <div className="d-flex justify-content-center">
                            <DayPicker
                              mode="single"
                              selected={daySelected}
                              //onSelect={setDaySelected}
                              onSelect={(
                                day,
                                selectedDay,
                                activeModifiers,
                                e
                              ) => {
                                dayChange(day, selectedDay, activeModifiers, e);
                              }}
                            />
                          </div>

                          <div className="d-flex flex-column ">
                            <span
                              className="fw-semibold label__dates"
                              style={{ fontSize: "13px" }}
                            >
                              Start date
                            </span>
                            <div className="d-flex gap-1">
                              <input
                                name="checkbox-startdate"
                                type="checkbox"
                                onChange={handleStartDayDisable}
                              />
                              <input
                                name="input-startday"
                                disabled={isStartDay}
                                className="input__start-date"
                                type="text"
                                value={startDay}
                                onChange={handleChangeStartDay}
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-column mt-2">
                            <span
                              className="fw-semibold label__dates"
                              style={{ fontSize: "13px" }}
                            >
                              Due date
                            </span>
                            <div className="d-flex gap-1">
                              <input
                                type="checkbox"
                                name="checkbox-dueday"
                                onChange={handleDueDayDisable}
                              />
                              <input
                                disabled={isDueDay}
                                name="input-dueday"
                                className="input__due-date"
                                type="text"
                                style={{ width: "90px" }}
                                value={dueDay}
                                onChange={handleChangeDueDay}
                              />
                              <input
                                disabled={isDueDay}
                                name="input-duetime"
                                className="input__due-date"
                                type="text"
                                style={{ width: "90px" }}
                                value={dueTime}
                                onChange={handleChangeDueTime}
                              />
                            </div>
                          </div>

                          <div className="d-flex flex-column mt-3">
                            <span
                              className="fw-semibold label__dates"
                              style={{ fontSize: "12px" }}
                            >
                              Set due date reminder
                            </span>
                            <div className="w-100">
                              <select
                                className="w-100 select__reminder"
                                name="select-remind"
                                defaultValue={"None"}
                              >
                                <option value={"None"}>None</option>
                                <option value={"At time"}>
                                  At time of due date
                                </option>
                                <option value={"5 Minutes"}>
                                  5 Minutes before
                                </option>
                                <option value={"10 Minutes"}>
                                  10 Minutes before
                                </option>
                                <option value={"15 Minutes"}>
                                  15 Minutes before
                                </option>
                                <option value={"1 Hour"}>1 Hour before</option>
                                <option value={"2 Hour"}>2 Hour before</option>
                                <option value={"1 Day"}>1 Day before</option>
                                <option value={"2 Day"}>2 Day before</option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-3 d-flex flex-column w-100 gap-2">
                            <button className="btn btn-primary fw-semibold">
                              Save
                            </button>
                            <button className="btn btn-light fw-semibold">
                              Remove
                            </button>
                          </div>
                        </Popover.Body>
                      </Popover>
                    </Overlay>
                  </div>

                  <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                    <div>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                    <span>Move</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                    <div>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </div>
                    <span onClick={() => handleArchiveCard(modalCardDetail.id)}>
                      Archive
                    </span>
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
