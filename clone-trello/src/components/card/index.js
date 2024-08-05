import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faX,
  faListCheck,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
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
import { Popover, Overlay, Button, ButtonGroup, Form } from "react-bootstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  format,
  addDays,
  parse,
  endOfDay,
  isValid,
  subMinutes,
  subDays,
  subHours,
} from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { set } from "date-fns";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import cardMemberService from "../../api/Services/cardMember";
import userService from "../../api/Services/user";
import boardMemberService from "../../api/Services/boardMember";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import todoService from "../../api/Services/todo";
import { useForm } from "react-hook-form";
import taskService from "../../api/Services/task";
import { enUS, vi } from "date-fns/locale";
//import Connection from "../signalrConnection";
import Comments from "../comments";
import TaskForm from "../taskForm";
import CardLabel from "../cardLabel";
import cardLabelService from "../../api/Services/cardLabel";
import CardActivity from "../cardActivity";
import Connection from "../signalrConnection";
import listServices from "../../api/Services/list";

const Card = (listIdProps, listBoardIdProps) => {
  // let userProfile = JSON.parse(localStorage.getItem("userProfile")).data.id;
  // console.log("userProfile", userProfile);

  const textareaRefCardTitle = useRef(null);
  const textAreaRefCreateCardTitle = useRef(null);
  const datePopoverRef = useRef(null);
  const memberPopoverRef = useRef(null);
  const checklistPopoverRef = useRef(null);
  const assignPopoverRef = useRef(null);
  const dueDatePopoverRef = useRef(null);

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
  //const datePopoverRef = useRef(null);
  const [cardMembers, setCardMembers] = useState([]);
  const [isMemberPopoverOpen, setIsMemberPopoverOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [boardMembers, setBoardMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChecklistPopoverOpen, setIsChecklistPopoverOpen] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [todoItems, setTodoItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [valueQuill, setValueQuill] = useState("");
  const quillRef = useRef(null);
  const { register } = useForm();
  // const onSubmit = (data) => console.log(data);
  //const [DescriptionTemp, setDescriptionTemp] = useState("");
  const [addingItem, setAddingItem] = useState(null);
  const [newTask, setNewTask] = useState({
    // name: '',
    // priorityLevel: '',
    // status: '',
    // description: '',
    // assignedUserId: '',
    // dueDate: null
  });
  const [isAssignPopoverOpen, setIsAssignPopoverOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  //const [dueDateLabel, setDueDateLabel] = useState("Due Date");
  const [dueDateLabel, setDueDateLabel] = useState("Due Date");
  const [taskItems, setTaskItems] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({});

  //------------ DATE PICKER-------------
  const [datePopover, setDatePopover] = useState(false);
  const [datePopoverTarget, setDatePopoverTarget] = useState(null);
  const initiallySelectedDate = new Date();
  const [daySelected, setDaySelected] = useState(initiallySelectedDate);
  const [isStartDay, setIsStartDay] = useState(true);
  const [isDueDay, setIsDueDay] = useState(false);
  const [checkDueday, setCheckDueDay] = useState(true);
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
  const [dueDateRemind, setDueDateRemind] = useState("None");

  const [labelDay, setLabelDay] = useState("");
  const [visileLabelDay, setVisileLabelDay] = useState("");
  //const [cardLabels, setCardLabels] = useState([]);

  const pastMonth = new Date();
  const dayRange = {
    from: pastMonth,
    to: addDays(pastMonth, 1),
  };
  const [range, setRange] = useState(dayRange);
  const [allList, setAllList] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [isMovePopoverOpen, setIsMovePopoverOpen] = useState(false);
  const movePopoverRef = useRef(null);

  const handleDatePopoverClick = (event) => {
    if (datePopover) return;
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
    setDueDay(format(selectedDay, "MM/dd/yyyy"));
  };

  const handleStartDayDisable = () => {
    setIsStartDay(!isStartDay);
  };

  const handleDueDayDisable = () => {
    setCheckDueDay(!checkDueday);
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

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p> From {format(range.from, "PPP")}</p>;
    }
  }
  if (range.to) {
    footer = (
      <span>
        From {format(range.from, "PPP")} To {format(range.to, "PPP")}
      </span>
    );
  }

  const handleSelectRange = (selectedRange) => {
    console.log("selectedRange", selectedRange);
    if (!selectedRange) {
      setRange({
        from: pastMonth,
        to: pastMonth,
      });
      setStartDay(format(pastMonth, "MM/dd/yyyy"));
      setDueDay(format(pastMonth, "MM/dd/yyyy"));
    } else if (!selectedRange.to) {
      setRange({
        from: selectedRange.from,
        to: selectedRange.from,
      });
      setStartDay(format(selectedRange.from, "MM/dd/yyyy"));
      setDueDay(format(selectedRange.from, "MM/dd/yyyy"));
    } else {
      setRange({
        from: selectedRange.from,
        to: selectedRange.to,
      });
      setStartDay(format(selectedRange.from, "MM/dd/yyyy"));
      setDueDay(format(selectedRange.to, "MM/dd/yyyy"));
    }
  };

  useEffect(() => {
    if (isStartDay == false) {
      setStartDay(format(initiallySelectedDate, "MM/dd/yyyy"));
      setDueDay(format(addDays(initiallySelectedDate, 1), "MM/dd/yyyy"));
    } else {
      setDueDay(format(daySelected, "MM/dd/yyyy"));
    }
  }, [isStartDay]);

  //-----------------------------------------------------------------
  // QUILL

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  const handleChangeQuill = (content) => {
    setValueQuill(content);
  };

  //-----------------------------------------------------------------

  const onChangeRemind = (event) => {
    let rawRemind = parse(
      dueDay + " " + dueTime,
      "MM/dd/yyyy h:mm a",
      new Date(),
      { locale: vi }
    );
    if (event.target.value == "None") {
      setDueDateRemind("");
    } else if (event.target.value == "At time") {
      setDueDateRemind(dueDay + " " + dueTime);
    } else if (event.target.value == "15 Minutes Before") {
      setDueDateRemind(format(subMinutes(rawRemind, 15), "MM/dd/yyyy h:mm a"));
    } else if (event.target.value == "1 Hour Before") {
      setDueDateRemind(format(subHours(rawRemind, 1), "MM/dd/yyyy h:mm a"));
    } else if (event.target.value == "1 Day Before") {
      setDueDateRemind(format(subDays(rawRemind, 1), "MM/dd/yyyy h:mm a"));
    }
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

  const displayLabelDay = (cardDetail) => {
    console.log("modalCardDetail", cardDetail);

    if (!cardDetail?.startDate && cardDetail?.endDate) {
      setLabelDay(format(new Date(cardDetail.endDate), "PPP, p"));
      setVisileLabelDay("Due date");
    }
    if (cardDetail?.startDate && !cardDetail?.endDate) {
      setLabelDay(format(new Date(cardDetail.startDate), "PPP"));
      setVisileLabelDay("Start date");
    }
    if (!cardDetail?.startDate && !cardDetail?.endDate) {
      setLabelDay("");
      setVisileLabelDay("");
    }

    if (cardDetail?.startDate && cardDetail?.endDate) {
      setLabelDay(
        format(new Date(cardDetail.startDate), "PPP") +
          " - " +
          format(new Date(cardDetail.endDate), "PPP, p")
      );
      setVisileLabelDay("Dates");
    }
  };

  const handleModalCard = (objCardDetail) => {
    setModalCardDetail(objCardDetail);
    setIsModalCardShow(!isModalCardShow);
    setDatePopover(false);
    setIsMemberPopoverOpen(false);
    //handleGetAllCard();
    handleGetCardByFilter();
    displayLabelDay(objCardDetail);
  };

  /////////////////////////////////////////////////////////////////

  const handleAddCardTitle = () => {
    setAddCardTitleVisible(true);
  };

  const handleRichTextVisible = (abc) => {
    setRichTextVisible(true);
    setValueQuill(abc);
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

  const handleUpdateDates = async (
    cardID,
    description,
    startDay,
    dueDay,
    dueTime,
    reminderDate,
    title
  ) => {
    //parse start day
    let parseStartDay = parse(
      startDay + " 08:00 AM",
      "MM/dd/yyyy h:mm a",
      new Date(),
      {
        locale: vi,
      }
    );
    let isoStartDay = isValid(parseStartDay) ? parseStartDay.toISOString() : "";

    // parse due day
    let parseDueDay = parse(
      dueDay + " " + dueTime,
      "MM/dd/yyyy h:mm a",
      new Date(),
      { locale: vi }
    );
    let isoDueDay = isValid(parseDueDay) ? parseDueDay.toISOString() : "";

    // parse remind
    let parseRemind = parse(reminderDate, "MM/dd/yyyy h:mm a", new Date(), {
      locale: vi,
    });
    let isoRemind = isValid(parseRemind) ? parseRemind.toISOString() : "";

    let query = {
      id: cardID,
      description: description,
      startDate: isoStartDay,
      endDate: isoDueDay,
      reminderDate: isoRemind,
      title: title,
    };
    console.log("query", query);
    try {
      const response = await cardServices.updateCardDates(query);
      if (response.data.code == 200) {
        // tat popover date
        // set lai modal card detail
        // hien thong tin tren description
        // get card by filter
        console.log("update day ok");
        console.log(response.data.data);
        setModalCardDetail(response.data.data);
        handleGetCardByFilter();
        handleHideDatePopover();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveCardDates = (
    cardID,
    description,
    startDay,
    dueDay,
    dueTime,
    reminderDate,
    title
  ) => {
    handleUpdateDates(
      cardID,
      description,
      startDay,
      dueDay,
      dueTime,
      reminderDate,
      title
    );
  };

  const removeDates = (
    cardID,
    description,
    startDay,
    dueDay,
    dueTime,
    reminderDate,
    title
  ) => {
    startDay = "";
    dueDay = "";
    dueTime = "";
    reminderDate = "";
    handleUpdateDates(
      cardID,
      description,
      startDay,
      dueDay,
      dueTime,
      reminderDate,
      title
    );
  };

  // const handleGetAllCard = async () => {
  //   let query = { listId: listIdProps.listIdProps };
  //   try {
  //     const response = await cardServices.getAllCard(query);
  //     if (response.data.code == 200) {
  //       setListCard(response.data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleGetCardByFilter = async () => {
    let query = { listId: listIdProps.listIdProps, isActive: true };
    try {
      const response = await cardServices.getCardByFilter(query);
      if (response.data.code == 200) {
        setListCard(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDescription = async (cardID, description, title) => {
    let query = { id: cardID, description: description, title: title };
    try {
      const response = await cardServices.updateCardDescription(query);
      if (response.data.code == 200) {
        setModalCardDetail(response.data.data);
        setRichTextVisible(false);
        console.log("update description ok!");
        //handleGetAllCard();
        handleGetCardByFilter();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCardTitle = async (cardID) => {
    let query = { id: cardID, title: inputTitleCard };
    try {
      const response = await cardServices.updateCardTitle(query);
      if (response.data.code == 200) {
        setEditingCardTitle("false");
        //handleGetAllCard();
        handleGetCardByFilter();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCardTitleModal = async (cardID) => {
    let query = { id: cardID, title: CardTitleModal };
    try {
      const response = await cardServices.updateCardTitle(query);
      if (response.data.code == 200) {
        setIsCardTitleModal(true);
        setModalCardDetail(response.data.data);
        //handleGetAllCard();
        handleGetCardByFilter();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCard = async () => {
    try {
      let query = { listId: listIdProps.listIdProps, title: titleCard };
      const response = await cardServices.createCard(query);
      if (response.data.code == 201) {
        setTitleCard("");
        setAddCardTitleVisible(false);
        //handleGetAllCard();
        handleGetCardByFilter();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveCard = async (cardID) => {
    let query = { id: cardID, isActive: false };
    try {
      const response = await cardServices.changeStatus(query);
      if (response.data.code === 200) {
        // window.location.reload();

        toast.success("Card archived successfully!");
        setIsModalCardShow(false);
        //handleGetAllCard();
        handleGetCardByFilter();
      }
    } catch (error) {
      toast.error("Card archived failed!");
      console.error(error);
    }
  };

  const handleGetUserDetails = async (userId) => {
    let query = { id: userId };
    try {
      const response = await userService.getUserById(query);
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
    let query = { boardId: listIdProps.listBoardIdProps };
    try {
      const response = await boardMemberService.getAllBoardMember(query);
      if (response.data.code === 200) {
        setBoardMembers(response.data.data);

        response.data.data.forEach((member) => {
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
    let query = { cardId: cardId };
    try {
      const response = await cardMemberService.getAllCardMember(query);
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
    //handleGetAllCard();
    handleGetCardByFilter();
    handleGetAllBoardMember();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBoardMembers = boardMembers.filter((member) => {
    const userDetail = userDetails[member.userId];
    const userName = userDetail ? userDetail.name.toLowerCase() : "";

    return userName.includes(searchTerm.toLowerCase());
  });

  const handleCreateMemberClick = async (member) => {
    let query = { userId: member.userId, cardId: selectedCardId };
    try {
      const response = await cardMemberService.createCardMember(query);
      if (response.data.code === 201) {
        toast.success(`Member added successfully!`);
        handleGetCardMember(selectedCardId);
      } else {
        toast.error(`Failed to add member`);
      }
    } catch (error) {
      toast.error(`Failed to add member`);
      console.error(error);
    }
  };

  const availableBoardMembers = filteredBoardMembers.filter(
    (boardMember) =>
      !cardMembers.some(
        (cardMember) => cardMember.userId === boardMember.userId
      )
  );

  const handleRemoveCardMember = async (id) => {
    let query = { id: id, isActive: false };
    try {
      const response = await cardMemberService.changeStatus(query);
      if (response.data.code === 200) {
        toast.success("Remove member successfully!");
        handleGetCardMember(selectedCardId);
      } else {
        toast.error("Remove member Failed!");
      }
    } catch (error) {
      toast.error("Remove member Failed!");
      console.error(error);
    }
  };

  const saveCardDescription = (cardID, description, title) => {
    if (valueQuill) {
      handleUpdateDescription(cardID, description, title);
      setValueQuill("");
      console.log("description", description);
    } else {
      setRichTextVisible(false);
      setValueQuill("");
    }
  };
  const handleChecklistClick = () => {
    setIsChecklistPopoverOpen(!isChecklistPopoverOpen);
  };

  const closeChecklistPopover = () => {
    setIsChecklistPopoverOpen(false);
    setChecklistTitle(null);
  };

  const handleChecklistTitleChange = (e) => {
    setChecklistTitle(e.target.value);
  };

  const handleAddChecklist = async () => {
    let query = { cardId: modalCardDetail.id, title: checklistTitle };
    try {
      const response = await todoService.createTodo(query);
      if (response.data.code === 201) {
        toast.success(`To-do list added successfully!`);
      } else {
        toast.error(`Failed to add to-do list`);
      }
      closeChecklistPopover();
      handleGetAllChecklist();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleGetAllChecklist = async () => {
    try {
      const response = await todoService.getAllTodo({
        cardId: modalCardDetail.id,
      });
      if (response.data.code === 200) {
        setTodoItems(response.data.data);
      } else {
        console.error("Failed to fetch todo:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching todo:", error);
    }
  };

  useEffect(() => {
    if (isModalCardShow && modalCardDetail.id) {
      handleGetAllChecklist();
    }
  }, [isModalCardShow, modalCardDetail]);

  const handleUpdateChecklist = async (id, title) => {
    let query = { id, title };
    try {
      const response = await todoService.updateTodo(query);
      if (response.status === 200) {
        toast.success("To-do list updated successfully!");
      } else {
        toast.error("Failed to update to-do list");
      }
      closeChecklistPopover();
      handleGetAllChecklist();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const stopEditing = () => {
    setEditingId(null);
    setNewTitle("");
  };

  const saveTitle = async (id) => {
    await handleUpdateChecklist(id, newTitle);
    stopEditing();
  };

  const handleChangeStatusChecklist = async (id) => {
    let query = { id: id, isActive: false };
    try {
      const response = await todoService.changeStatus(query);
      if (response.status === 200) {
        toast.success(`To-do status updated successfully!`);
      } else {
        toast.error(`Failed to update to-do status`);
      }
      handleGetAllChecklist();
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  // module task

  const closeAssignPopover = () => {
    setIsAssignPopoverOpen(false);
  };

  const handleGetUserByTodoId = async (todoId) => {
    setIsAssignPopoverOpen(!isAssignPopoverOpen);
    try {
      const response = await userService.getUserByTodoId({ todoId });
      setAvailableUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users by todoId:", error);
    }
  };

  const handleAssignMemberClick = (user) => {
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      assignedUserId: user.id,
    }));
    setNewTask((prevTask) => ({
      ...prevTask,
      assignedUserId: user.id,
    }));
    setSelectedUser(user);
    closeAssignPopover();
  };

  const handleDueDateClick = () => {
    //setIsDatePickerOpen(!isDatePickerOpen);
    setIsDatePickerOpen((prev) => !prev);
  };

  const handleDayClick = (day) => {
    const utcDay = new Date(day.getTime() - day.getTimezoneOffset() * 60000);
    setUpdatedTask((prevTask) => ({ ...prevTask, dueDate: utcDay }));
    setNewTask((prevTask) => ({ ...prevTask, dueDate: utcDay }));
  };

  const handleSaveDueDate = () => {
    if (newTask.dueDate) {
      setDueDateLabel(format(newTask.dueDate, "MMM d"));
    }
    setIsDatePickerOpen(false);
    console.log("Due Date selected:", newTask.dueDate);
  };

  const handleRemoveDueDate = () => {
    setNewTask((prevTask) => ({ ...prevTask, dueDate: null }));
    setUpdatedTask((prevTask) => ({ ...prevTask, dueDate: null }));
    setDueDateLabel("Due Date");
    setIsDatePickerOpen(false);
  };

  const handleCreateTask = async (todoId) => {
    const requestBody = {
      todoId: todoId,
      name: newTask.name,
      priorityLevel: newTask.priorityLevel,
      status: newTask.status,
      description: newTask.description || null,
      assignedUserId: newTask.assignedUserId || null,
      dueDate: newTask.dueDate || null,
    };

    try {
      const response = await taskService.createTask(requestBody);
      if (response.data.code === 201) {
        toast.success("Task added successfully!");
        stopAddingItem();
        handleGetAllTask(todoId, setTaskItems);
      } else {
        toast.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const startAddingItem = (todoId) => {
    setIsAssignPopoverOpen(false);
    setAddingItem(todoId);
    setNewTask({
      name: "",
      priorityLevel: "",
      status: "",
      description: "",
      assignedUserId: "",
      dueDate: "",
    });
  };

  const stopAddingItem = () => {
    setAddingItem(null);
    setSelectedUser(null);
    setDueDate(null);
    setDueDateLabel("Due Date");
    setIsAssignPopoverOpen(false);
  };

  useEffect(() => {
    displayLabelDay(modalCardDetail);
  }, [modalCardDetail]);
  //   setDueDateLabel('Due Date');
  //   setIsAssignPopoverOpen(false);
  // };

  const userLookup = {};
  availableUsers.forEach((user) => {
    userLookup[user.id] = user.name;
  });

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleGetAllTask = async (todoId, setTaskItems) => {
    let query = { todoId: todoId };
    try {
      const response = await taskService.getAllTask(query);
      if (response.status === 200) {
        handleGetUserByTodoId(todoId);
        setTaskItems(response.data.data); // Update task items directly from response
      } else {
        console.error("Failed to fetch tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleUpdateTask = async (taskId, todoId) => {
    const requestBody = {
      id: taskId,
      name: updatedTask.name,
      priorityLevel: updatedTask.priorityLevel,
      status: updatedTask.status,
      description: updatedTask.description || null,
      assignedUserId: updatedTask.assignedUserId || null,
      dueDate: updatedTask.dueDate || null,
    };

    try {
      const response = await taskService.updateTask(requestBody);
      if (response.data.code === 200) {
        toast.success("Task updated successfully!");
        stopEditingTask();
        handleGetAllTask(todoId, setTaskItems);
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEditingTask = (taskId, task) => {
    const priorityMapping = {
      High: 0,
      Medium: 1,
      Low: 2,
    };

    const statusMapping = {
      New: 0,
      InProgress: 1,
      Resolved: 2,
    };

    const mappedPriorityLevel =
      priorityMapping[task.priorityLevel] !== undefined
        ? priorityMapping[task.priorityLevel]
        : task.priorityLevel;
    const mappedStatus =
      statusMapping[task.status] !== undefined
        ? statusMapping[task.status]
        : task.status;

    setIsAssignPopoverOpen(false);
    setEditingTask(taskId);
    setUpdatedTask({
      id: task.id,
      name: task.name,
      priorityLevel: mappedPriorityLevel,
      status: mappedStatus,
      description: task.description || "",
      assignedUserId: task.assignedUserId || "",
      dueDate: task.dueDate || null,
    });
  };

  const stopEditingTask = () => {
    setIsAssignPopoverOpen(false);
    setEditingTask(null);
    setUpdatedTask({
      id: "",
      name: "",
      priorityLevel: "",
      status: "",
      description: "",
      assignedUserId: "",
      dueDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [name]:
        name === "priorityLevel" || name === "status"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSaveTask = async (taskId, todoId) => {
    await handleUpdateTask(taskId, todoId);
  };

  const handleCheckTask = async (taskId, currentChecked, todoId) => {
    let query = {
      id: taskId,
      isChecked: !currentChecked,
    };

    try {
      const response = await taskService.updateCheckTask(query);
      if (response.data.code === 200) {
        toast.success("Task check status updated successfully!");
        handleGetAllTask(todoId, setTaskItems);
      } else {
        toast.error("Failed to Check task");
      }
    } catch (error) {
      console.error("Error updating task check status:", error);
    }
  };

  const handleInactiveTask = async (taskId, todoId) => {
    let query = {
      id: taskId,
      isActive: false,
    };

    try {
      const response = await taskService.changeStatus(query);
      if (response.data.code === 200) {
        toast.success("Inactive task successfully!");
        handleGetAllTask(todoId, setTaskItems);
      } else {
        toast.error("Failed to inactive task.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    if (todoItems.length > 0) {
      todoItems.forEach((todo) => {
        handleGetAllTask(todo.id, setTaskItems);
      });
    }
  }, [todoItems]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [cardLabelChild, setCardLabelChild] = useState([]);
  const handleCardLabelChild = (newItems) => {
    setCardLabelChild(newItems);
  };

  // const handleGetAllCardLabel = async () => {
  //   let query = { cardId: modalCardDetail.id };
  //   try {
  //     const response = await cardLabelService.getAllCardLabel(query);
  //     if (response.data.code == 200) {
  //       setCardLabels(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   if (isModalCardShow && modalCardDetail.id) {
  //     handleGetAllCardLabel();
  //   }
  // }, [isModalCardShow, modalCardDetail]);

  const handleMoveCard = async (id, newListId) => {
    let query = {
      id: id,
      newListId: newListId,
    };
    try {
      const response = await cardServices.moveCard(query);
      if (response.data.code === 200) {
        toast.success("Card moved successfully!");
        setIsMovePopoverOpen(false);
        setIsModalCardShow(false);
      }
    } catch (error) {
      toast.error("Card move failed!");
      console.error(error);
    }
  };

  const handleGetListByFilter = async () => {
    let query = { boardId: listIdProps.listBoardIdProps, isActive: true };
    try {
      const response = await listServices.getListByFilter(query);
      if (response.data.code === 200) {
        setAllList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetListByFilter();
  }, [listIdProps, listBoardIdProps]); // Add dependencies here

  const handleListChange = (e) => {
    setSelectedListId(e.target.value);
  };

  const handleMove = () => {
    handleMoveCard(modalCardDetail.id, selectedListId);
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
              {/* VISUAL */}
              <div className="mt-1">
                <div className="label-container">
                  {cardLabelChild.map((label) => (
                    <span
                      key={label.id}
                      className="label-name"
                      style={{
                        backgroundColor: label.labelColor,
                      }}
                    >
                      {label.labelName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-1">
                {visileLabelDay && labelDay && (
                  <div className="d-flex flex-column gap-1">
                    <span className="fw-semibold content__visual-label-day">
                      {visileLabelDay}
                    </span>
                    <div>
                      <span className="content__label-day p-1">{labelDay}</span>
                    </div>
                  </div>
                )}
              </div>
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
                          onClick={() =>
                            handleRichTextVisible(modalCardDetail.description)
                          }
                        >
                          <span className="fw-semibold">Edit</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {richTextVisible ? (
                    <div className="d-flex flex-column gap-2">
                      <div className="block__rich-text-editor">
                        <ReactQuill
                          ref={quillRef}
                          value={valueQuill}
                          onChange={handleChangeQuill}
                          modules={modules}
                          formats={formats}
                        />
                      </div>
                      <div className="d-flex justify-content-start gap-3">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            saveCardDescription(
                              modalCardDetail.id,
                              valueQuill,
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
                    <div
                      onClick={() =>
                        handleRichTextVisible(modalCardDetail.description)
                      }
                    >
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
                          dangerouslySetInnerHTML={{
                            __html: modalCardDetail.description,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* todo & task part */}
                <div className="mt-3">
                  {todoItems.length > 0 && (
                    <div>
                      {todoItems.map((todo) => (
                        <div key={todo.id}>
                          <div className="todo-item d-flex justify-content-between align-items-center mt-3">
                            <div
                              className="d-flex gap-2 align-items-center"
                              style={{ cursor: "pointer" }}
                            >
                              <div>
                                <FontAwesomeIcon icon={faListCheck} />
                              </div>
                              <div>
                                {editingId === todo.id ? (
                                  <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) =>
                                      setNewTitle(e.target.value)
                                    }
                                    onBlur={() => saveTitle(todo.id)}
                                    autoFocus
                                  />
                                ) : (
                                  <span
                                    className="label__modal-todo fw-semibold"
                                    onClick={() =>
                                      startEditing(todo.id, todo.title)
                                    }
                                  >
                                    {todo.title}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                className="custom-button"
                                onClick={() =>
                                  handleChangeStatusChecklist(todo.id)
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2">
                            {taskItems
                              .filter((task) => task.todoId === todo.id)
                              .map((task) => (
                                <div
                                  key={task.id}
                                  className="task-item mt-2 p-2 border rounded"
                                >
                                  {editingTask === task.id ? (
                                    <TaskForm
                                      task={updatedTask}
                                      onChange={handleInputChange}
                                      onSave={() =>
                                        handleSaveTask(task.id, todo.id)
                                      }
                                      onCancel={stopEditingTask}
                                      handleGetUserByTodoId={() =>
                                        handleGetUserByTodoId(todo.id)
                                      }
                                      assignPopoverRef={assignPopoverRef}
                                      isAssignPopoverOpen={isAssignPopoverOpen}
                                      closeAssignPopover={closeAssignPopover}
                                      availableUsers={availableUsers}
                                      handleAssignMemberClick={
                                        handleAssignMemberClick
                                      }
                                      dueDatePopoverRef={dueDatePopoverRef}
                                      handleDueDateClick={handleDueDateClick}
                                      isDatePickerOpen={isDatePickerOpen}
                                      setIsDatePickerOpen={setIsDatePickerOpen}
                                      handleDayClick={handleDayClick}
                                      handleSaveDueDate={handleSaveDueDate}
                                      handleRemoveDueDate={handleRemoveDueDate}
                                      selectedUser={availableUsers.find(
                                        (user) =>
                                          user.id === updatedTask.assignedUserId
                                      )}
                                      dueDateLabel={
                                        updatedTask.dueDate
                                          ? formatDate(updatedTask.dueDate)
                                          : "Set Due Date"
                                      }
                                    />
                                  ) : (
                                    <div>
                                      <div className="task-item-container position-relative">
                                        <input
                                          type="checkbox"
                                          className="task-checkbox"
                                          checked={task.isChecked}
                                          onChange={() =>
                                            handleCheckTask(
                                              task.id,
                                              task.isChecked,
                                              task.todoId
                                            )
                                          }
                                        />
                                        <div
                                          onClick={() =>
                                            startEditingTask(task.id, task)
                                          }
                                          className="w-100"
                                        >
                                          <div className="d-flex justify-content-between">
                                            <span className="task-name fw-bold">
                                              {task.name}
                                            </span>
                                            <div className="d-flex gap-1">
                                              <span
                                                className={`task-priority ${
                                                  task.priorityLevel === "Low"
                                                    ? "priority-low"
                                                    : task.priorityLevel ===
                                                      "Medium"
                                                    ? "priority-medium"
                                                    : task.priorityLevel ===
                                                      "High"
                                                    ? "priority-high"
                                                    : ""
                                                }`}
                                              >
                                                {task.priorityLevel}
                                              </span>
                                              <span
                                                className={`task-status ${
                                                  task.status === "New"
                                                    ? "status-new"
                                                    : task.status ===
                                                      "InProgress"
                                                    ? "status-in-progress"
                                                    : task.status === "Resolved"
                                                    ? "status-resolved"
                                                    : ""
                                                }`}
                                              >
                                                {task.status}
                                              </span>
                                              <span>
                                                <button
                                                  className="custom-button "
                                                  onClick={() =>
                                                    handleInactiveTask(
                                                      task.id,
                                                      task.todoId
                                                    )
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                  />
                                                </button>
                                              </span>
                                            </div>
                                          </div>
                                          <div className="task-description mt-1">
                                            {task.description}
                                          </div>
                                          <div className="d-flex justify-content-end mt-2">
                                            <div className="task-assigned-user">
                                              <FontAwesomeIcon
                                                icon={faUser}
                                                style={{ marginRight: "5px" }}
                                              />
                                              {availableUsers.length > 0 &&
                                              task.assignedUserId
                                                ? userLookup[
                                                    task.assignedUserId
                                                  ] || "User not found"
                                                : "Unassigned"}
                                            </div>
                                            <div
                                              className="task-due-date"
                                              style={{ marginLeft: "10px" }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faClock}
                                                style={{ marginRight: "5px" }}
                                              />
                                              {task.dueDate
                                                ? formatDate(task.dueDate)
                                                : "No due date"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                            {addingItem === todo.id ? (
                              <TaskForm
                                task={newTask}
                                onChange={(e) => {
                                  const { name, value } = e.target;
                                  setNewTask((prevTask) => ({
                                    ...prevTask,
                                    [name]:
                                      name === "priorityLevel" ||
                                      name === "status"
                                        ? parseInt(value, 10)
                                        : value,
                                  }));
                                }}
                                onSave={() => handleCreateTask(todo.id)}
                                onCancel={stopAddingItem}
                                handleGetUserByTodoId={() =>
                                  handleGetUserByTodoId(todo.id)
                                }
                                assignPopoverRef={assignPopoverRef}
                                isAssignPopoverOpen={isAssignPopoverOpen}
                                closeAssignPopover={closeAssignPopover}
                                availableUsers={availableUsers}
                                handleAssignMemberClick={
                                  handleAssignMemberClick
                                }
                                dueDatePopoverRef={dueDatePopoverRef}
                                handleDueDateClick={handleDueDateClick}
                                isDatePickerOpen={isDatePickerOpen}
                                setIsDatePickerOpen={setIsDatePickerOpen}
                                handleDayClick={handleDayClick}
                                handleSaveDueDate={handleSaveDueDate}
                                handleRemoveDueDate={handleRemoveDueDate}
                                selectedUser={selectedUser}
                                dueDateLabel={dueDateLabel}
                              />
                            ) : (
                              <button
                                className="custom-button mt-2"
                                onClick={() => startAddingItem(todo.id)}
                              >
                                Add an item
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* end todo & task part */}

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
                </div>
                <Comments cardId={modalCardDetail.id} />

                {activityVisible && (
                  <CardActivity cardId={modalCardDetail.id} />
                )}
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
                        <Popover.Header as="h3">
                          {" "}
                          Members
                          <Button
                            onClick={closePopover}
                            className="btn btn-close"
                          ></Button>
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
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="user-icon"
                                      />
                                      {userDetails[member.userId]
                                        ? userDetails[member.userId].name
                                        : `User ${member.userId}`}
                                    </div>
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="remove-icon"
                                      onClick={() =>
                                        handleRemoveCardMember(member.id)
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-members">
                                No card members found
                              </div>
                            )}
                          </div>
                          <div>Board Members</div>
                          <div className="scrollable-container">
                            {availableBoardMembers.length > 0 ? (
                              <div>
                                {availableBoardMembers.map((member, index) => (
                                  <div key={index} className="member-item">
                                    <div
                                      className="member-details"
                                      onClick={() =>
                                        handleCreateMemberClick(member)
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="user-icon"
                                      />
                                      {userDetails[member.userId]
                                        ? userDetails[member.userId].name
                                        : `User ${member.userId}`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-members">
                                No board members found
                              </div>
                            )}
                          </div>
                        </Popover.Body>
                      </Popover>
                    </Overlay>
                  </div>

                  <div
                    ref={datePopoverRef}
                    onClick={(e) => handleDatePopoverClick(e)}
                  >
                    <div className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        Dates
                      </span>
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
                            {isStartDay ? (
                              <DayPicker
                                mode="single"
                                selected={daySelected}
                                onSelect={(
                                  day,
                                  selectedDay,
                                  activeModifiers,
                                  e
                                ) => {
                                  dayChange(
                                    day,
                                    selectedDay,
                                    activeModifiers,
                                    e
                                  );
                                }}
                              />
                            ) : (
                              <DayPicker
                                mode="range"
                                defaultMonth={pastMonth}
                                selected={range}
                                footer={footer}
                                //onSelect={setRange}
                                onSelect={handleSelectRange}
                              />
                            )}
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
                                checked={!isStartDay}
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
                                checked={checkDueday}
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
                            <form className="w-100">
                              <select
                                className="w-100 select__reminder"
                                name="select-remind"
                                defaultValue={"None"}
                                {...register("select-remind")}
                                onChange={onChangeRemind}
                              >
                                <option value={"None"}>None</option>
                                <option value={"At time"}>
                                  At time of due date
                                </option>
                                <option value={"15 Minutes Before"}>
                                  15 Minutes before
                                </option>
                                <option value={"1 Hour Before"}>
                                  1 Hour before
                                </option>
                                <option value={"1 Day Before"}>
                                  1 Day before
                                </option>
                              </select>
                            </form>
                          </div>

                          <div className="mt-3 d-flex flex-column w-100 gap-2">
                            <button
                              className="btn btn-primary fw-semibold"
                              onClick={() =>
                                saveCardDates(
                                  modalCardDetail.id,
                                  modalCardDetail.description,
                                  startDay,
                                  dueDay,
                                  dueTime,
                                  dueDateRemind,
                                  modalCardDetail.title
                                )
                              }
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-light fw-semibold"
                              onClick={() =>
                                removeDates(
                                  modalCardDetail.id,
                                  modalCardDetail.description,
                                  startDay,
                                  dueDay,
                                  dueTime,
                                  dueDateRemind,
                                  modalCardDetail.title
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </Popover.Body>
                      </Popover>
                    </Overlay>
                  </div>

                  <CardLabel
                    cardId={modalCardDetail.id}
                    boardId={listIdProps.listBoardIdProps}
                    onItemsUpdate={handleCardLabelChild}
                  />

                  <div
                    className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action"
                    onClick={handleChecklistClick}
                    ref={checklistPopoverRef}
                  >
                    <div>
                      <FontAwesomeIcon icon={faListCheck} />
                    </div>
                    <span>Checklist</span>
                    <Overlay
                      target={checklistPopoverRef.current}
                      container={checklistPopoverRef}
                      show={isChecklistPopoverOpen}
                      placement="bottom"
                    >
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">
                          Add checklist
                          <Button
                            onClick={closeChecklistPopover}
                            className="btn btn-close"
                          ></Button>
                        </Popover.Header>
                        <Popover.Body>
                          <div className="mb-3">Title</div>
                          <FormControl
                            type="text"
                            placeholder="Checklist title"
                            autoFocus
                            value={checklistTitle}
                            onChange={handleChecklistTitleChange}
                            className="mb-3"
                          />
                          <Button onClick={handleAddChecklist}>Add</Button>
                        </Popover.Body>
                      </Popover>
                    </Overlay>
                  </div>

                  <div
                    className="d-flex align-items-center gap-2 p-2 fw-semibold block__card-action"
                    onClick={() => setIsMovePopoverOpen(!isMovePopoverOpen)}
                    ref={movePopoverRef}
                  >
                    <div>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                    <span>Move</span>
                    <Overlay
                      target={movePopoverRef.current}
                      container={movePopoverRef}
                      show={isMovePopoverOpen}
                      placement="bottom"
                      rootClose
                      onHide={() => setIsMovePopoverOpen(false)}
                    >
                      <Popover
                        id="popover-basic"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Popover.Header
                          as="h3"
                          className="d-flex justify-content-between align-items-center"
                        >
                          Move Card
                          <Button
                            onClick={() => setIsMovePopoverOpen(false)}
                            className="btn-close"
                          ></Button>
                        </Popover.Header>
                        <Popover.Body>
                          <Form>
                            <Form.Group controlId="formListSelect">
                              <div className="d-flex flex-column">
                                <span
                                  className="fw-semibold label__destination"
                                  style={{ fontSize: "15px" }}
                                >
                                  Select Destination
                                </span>
                                <form className="w-100">
                                  <select
                                    className="w-100 select__list large-select"
                                    value={selectedListId}
                                    onChange={handleListChange}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="" disabled>
                                      Select a list
                                    </option>
                                    {allList.map((list) => (
                                      <option key={list.id} value={list.id}>
                                        {list.name}
                                      </option>
                                    ))}
                                  </select>
                                </form>
                              </div>
                            </Form.Group>
                            <Button
                              variant="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMove();
                              }}
                              className="mt-2"
                            >
                              Move
                            </Button>
                          </Form>
                        </Popover.Body>
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
