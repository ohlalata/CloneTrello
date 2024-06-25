import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faX } from "@fortawesome/free-solid-svg-icons";
import cardServices from "../../api/Services/card";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalHeader, FormControl } from "react-bootstrap";
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
import cardMemberService from "../../api/Services/cardMember";
import userService from "../../api/Services/user";
import boardMemberService from "../../api/Services/boardMember";

const Card = (listIdProps, listBoardIdProps) => {
  const textareaRefCardTitle = useRef(null);
  const textAreaRefCreateCardTitle = useRef(null);
  const datePopoverRef = useRef(null);
  const memberPopoverRef = useRef(null);

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
  const [datePopover, setDatePopover] = useState(false);
  const [datePopoverTarget, setDatePopoverTarget] = useState(null);
  const [cardMembers, setCardMembers] = useState([]);
  const [isMemberPopoverOpen, setIsMemberPopoverOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [boardMembers, setBoardMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoardMember, setSelectedBoardMember] = useState(null);

  const handleDatePopoverClick = () => {
    setDatePopover(true);
  };

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
    const contentString = JSON.stringify(rawContent);
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    setDescriptionTemp(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    handleUpdateDescription(id, contentString, title);
  };

  const handleModalCard = (objCardDetail) => {
    setModalCardDetail(objCardDetail);
    setIsModalCardShow(!isModalCardShow);
    setIsMemberPopoverOpen(false);
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
        console.log("list card", response.data.data);
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
        setRichTextVisible(false);

        handleGetAllCard();
        console.log("update descript ok");
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

  const handleGetUserDetails = async (userId) => {
    try {
      const response = await userService.getUserById(userId);
      if (response.data.code === 200) {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          [userId]: response.data.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching user details for userId ${userId}:`, error);
    }
  };

  const handleGetAllBoardMember = async () => {
    try {
      const response = await boardMemberService.getAllBoardMember(listIdProps.listBoardIdProps);
      if (response.data.code === 200) {
        setBoardMembers(response.data.data);

        response.data.data.forEach(member => {
          handleGetUserDetails(member.userId);
        });
      } else {
        console.error("Failed to fetch board members");
        toast.error("Failed to fetch board members");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch board members");
    }
  };


  const handleGetCardMember = async (cardId) => {
    try {
      const response = await cardMemberService.getAllCardMember(cardId);
      if (response.data.code === 200) {
        const membersData = response.data.data;
        setCardMembers(membersData);
        setSelectedCardId(cardId);

        membersData.forEach((member) => {
          handleGetUserDetails(member.userId);
        });

      } else {
        console.error("Failed to fetch card members!");
      }
    } catch (error) {
      console.error("Error fetching card members:", error);
    }
  };

  const handleMemberClick = async (cardId) => {
    if (!isMemberPopoverOpen) {
      await handleGetCardMember(cardId);
      setIsMemberPopoverOpen(true);
    }
  };

  const closePopover = () => {
    setIsMemberPopoverOpen(false);
  };

  useEffect(() => {
    handleGetAllBoardMember();
  }, [listIdProps.listBoardIdProps]);

  useEffect(() => {
    handleGetAllCard();
    handleGetAllBoardMember();
  }, []);

  useEffect(() => {
    const contentString = modalCardDetail?.description;
    if (modalCardDetail?.description && isModalCardShow) {
      const rawContent = JSON.parse(contentString);
      setDescriptionTemp(rawContent.blocks[0]?.text);
      const contentState = convertFromRaw(rawContent);

      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [isModalCardShow]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBoardMembers = boardMembers.filter(member => {
    const userDetail = userDetails[member.userId];
    const userName = userDetail ? userDetail.name.toLowerCase() : '';

    return userName.includes(searchTerm.toLowerCase());
  });

  const handleCreateMemberClick = async (member) => {
    try {
      const response = await cardMemberService.createCardMember(member.userId, selectedCardId);
      if (response.data.code === 201) {
        toast.success(`Member ${member.name} added successfully!`);
        handleGetCardMember(selectedCardId);
      } else {
        toast.error(`Failed to add member ${member.name}`);
      }
    } catch (error) {
      toast.error(`Failed to add member ${member.name}`);
      console.error(error);
    }
  };

  const availableBoardMembers = filteredBoardMembers.filter(boardMember =>
    !cardMembers.some(cardMember => cardMember.userId === boardMember.userId)
  );

  const handleInactiveCardMember = async (id) => {
    try {
      const response = await cardMemberService.changeStatus(id, false);
      if (response.data.code === 200) {
        toast.success('Inactive member successfully!');
        handleGetCardMember(selectedCardId);
      } else {
        toast.error('Inactive member Failed!');
      }
    } catch (error) {
      toast.error('Inactive member Failed!');
      console.error(error);
    }
  };

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
                  <div
                    className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action"
                    onClick={() => handleMemberClick(modalCardDetail.id)}
                    ref={memberPopoverRef}
                  >
                    <div>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <span>Members</span>
                    <Overlay
                      target={memberPopoverRef.current}
                      container={memberPopoverRef}
                      show={isMemberPopoverOpen}
                      placement="bottom"

                    >
                      <Popover id="popover-basic">
                        <Popover.Header as="h3"> Members
                          <Button onClick={closePopover} className="btn btn-close">
                          </Button>
                        </Popover.Header>
                        <Popover.Body>
                          <FormControl
                            type="text"
                            placeholder="Search members.."
                            autoFocus
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="mb-3"
                          />
                          <div>Card Members</div>
                          <div className="scrollable-container">
                            {cardMembers.length > 0 ? (
                              <div className="member-list">
                                {cardMembers.map((member, index) => (
                                  <div key={index} className="member-item">
                                    <div className="member-details">
                                      <FontAwesomeIcon icon={faUser} className="user-icon" />
                                      {userDetails[member.userId] ? userDetails[member.userId].name : `User ${member.userId}`}
                                    </div>
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="remove-icon"
                                      onClick={() => handleInactiveCardMember(member.id)}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-members">No card members found</div>
                            )}
                          </div>
                          <div>Board Members</div>
                          <div className="scrollable-container">
                            {availableBoardMembers.length > 0 ? (
                              <div>
                                {availableBoardMembers.map((member, index) => (
                                  <div key={index} className="member-item">
                                    <div className="member-details" onClick={() => handleCreateMemberClick(member)}>
                                      <FontAwesomeIcon icon={faUser} className="user-icon" />
                                      {userDetails[member.userId] ? userDetails[member.userId].name : `User ${member.userId}`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-members">No board members found</div>
                            )}
                          </div>
                        </Popover.Body>
                      </Popover>
                    </Overlay>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                      <div>
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <span>Dates</span>
                    </div>

                    <Overlay>
                      <Popover>
                        <Popover.Header></Popover.Header>
                        <Popover.Body></Popover.Body>
                      </Popover>
                    </Overlay>
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
