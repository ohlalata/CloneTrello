import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faX,
  faListCheck,
  faTrash,
  faUserPlus,
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
import { Popover, Overlay, Button, ButtonGroup } from "react-bootstrap";
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
} from "date-fns"; /////////////////////////////
import { DateRange, DayPicker } from "react-day-picker"; /////////////////////////
import "react-day-picker/dist/style.css";
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

const Card = (listIdProps, listBoardIdProps) => {
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
    name: "",
    priorityLevel: "",
    status: "",
    description: "",
    assignedUserId: "",
    dueDate: "",
  });
  const [isAssignPopoverOpen, setIsAssignPopoverOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dueDateLabel, setDueDateLabel] = useState("Due Date");

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
  const pastMonth = new Date();
  const dayRange = {
    from: pastMonth,
    to: addDays(pastMonth, 1),
  };
  const [range, setRange] = useState(dayRange);

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
  // truong hop range true && range.from < range.to mà set range.to = range.from thì lỗi
  // truong hop range.from = range.to mà set range.to = range.from thì lỗi
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

  const handleModalCard = (objCardDetail) => {
    setModalCardDetail(objCardDetail);

    setIsModalCardShow(!isModalCardShow);
    setDatePopover(false);

    setIsMemberPopoverOpen(false);
    //handleGetAllCard();
    handleGetCardByFilter();
  };

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

  const handleGetAllCard = async () => {
    let query = { listId: listIdProps.listIdProps };
    try {
      const response = await cardServices.getAllCard(query);
      if (response.data.code == 200) {
        setListCard(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        handleGetAllCard();
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
    handleGetAllCard();
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
    setNewTask({
      ...newTask,
      assignedUserId: user.id,
    });
    setSelectedUser(user);
    closeAssignPopover();
  };

  const handleDueDateClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDayClick = (day) => {
    const utcDay = new Date(day.getTime() - day.getTimezoneOffset() * 60000);
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
    setDueDateLabel("Due Date");
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
      } else {
        toast.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const startAddingItem = (todoId) => {
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

                {/* todo part */}
                <div className="mt-3">
                  {todoItems.length > 0 && (
                    <div>
                      {todoItems.map((todo) => (
                        <div key={todo.id}>
                          <div className="todo-item d-flex justify-content-between align-items-center mt-3">
                            <div className="d-flex gap-2 align-items-center">
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
                              <button className="custom-button">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  onClick={() =>
                                    handleChangeStatusChecklist(todo.id)
                                  }
                                />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2">
                            {addingItem === todo.id ? (
                              <div className="new-task-form">
                                <div className="form-row">
                                  <input
                                    type="text"
                                    placeholder="Task name"
                                    value={newTask.name}
                                    onChange={(e) =>
                                      setNewTask({
                                        ...newTask,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-row">
                                  <select
                                    value={newTask.priorityLevel}
                                    onChange={(e) =>
                                      setNewTask({
                                        ...newTask,
                                        priorityLevel: parseInt(e.target.value),
                                      })
                                    }
                                  >
                                    <option value="" disabled>
                                      Select priority
                                    </option>
                                    <option value={2}>Low</option>
                                    <option value={1}>Medium</option>
                                    <option value={0}>High</option>
                                  </select>
                                  <select
                                    value={newTask.status}
                                    onChange={(e) =>
                                      setNewTask({
                                        ...newTask,
                                        status: parseInt(e.target.value),
                                      })
                                    }
                                  >
                                    <option value="" disabled>
                                      Select status
                                    </option>
                                    <option value={0}>New</option>
                                    <option value={1}>In Progress</option>
                                    <option value={2}>Resolved</option>
                                  </select>
                                </div>
                                <div className="form-row">
                                  <input
                                    type="text"
                                    placeholder="Description"
                                    value={newTask.description}
                                    onChange={(e) =>
                                      setNewTask({
                                        ...newTask,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="button-container">
                                  <div className="form-row justify-content-end">
                                    <button
                                      className="custom-button"
                                      onClick={() => handleCreateTask(todo.id)}
                                    >
                                      Add
                                    </button>
                                    <button
                                      className="custom-button"
                                      onClick={stopAddingItem}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                  <div className="form-row justify-content-end">
                                    <div className="assign-container">
                                      <button
                                        className="custom-button"
                                        onClick={() =>
                                          handleGetUserByTodoId(todo.id)
                                        }
                                        ref={assignPopoverRef}
                                      >
                                        {selectedUser ? (
                                          <>
                                            <FontAwesomeIcon
                                              icon={faUserPlus}
                                              style={{ marginRight: "5px" }}
                                            />
                                            {selectedUser.name}
                                          </>
                                        ) : (
                                          <>
                                            <FontAwesomeIcon
                                              icon={faUserPlus}
                                              style={{ marginRight: "5px" }}
                                            />
                                            Assign
                                          </>
                                        )}
                                      </button>
                                      <Overlay
                                        target={assignPopoverRef.current}
                                        show={isAssignPopoverOpen}
                                        placement="bottom"
                                      >
                                        <Popover id="popover-basic">
                                          <Popover.Header as="h3">
                                            Members
                                            <Button
                                              onClick={closeAssignPopover}
                                              className="btn btn-close"
                                              style={{ marginLeft: "10px" }}
                                            ></Button>
                                          </Popover.Header>
                                          <Popover.Body>
                                            <div>Available Users</div>
                                            <div className="scrollable-container">
                                              {availableUsers.length > 0 ? (
                                                <div>
                                                  {availableUsers.map(
                                                    (user, index) => (
                                                      <div
                                                        key={index}
                                                        className="member-item"
                                                      >
                                                        <div
                                                          className="member-details"
                                                          onClick={() =>
                                                            handleAssignMemberClick(
                                                              user
                                                            )
                                                          }
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={faUser}
                                                            className="user-icon"
                                                          />
                                                          {user.name}
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              ) : (
                                                <div className="no-members">
                                                  No available users found
                                                </div>
                                              )}
                                            </div>
                                          </Popover.Body>
                                        </Popover>
                                      </Overlay>
                                    </div>
                                    <div ref={dueDatePopoverRef}>
                                      <button
                                        className="custom-button"
                                        onClick={handleDueDateClick}
                                      >
                                        <FontAwesomeIcon
                                          icon={faClock}
                                          style={{ marginRight: "5px" }}
                                        />
                                        {dueDateLabel}
                                      </button>
                                    </div>
                                    <Overlay
                                      show={isDatePickerOpen}
                                      target={dueDatePopoverRef.current}
                                      placement="right"
                                      container={dueDatePopoverRef.current}
                                      containerPadding={12}
                                      rootClose={true}
                                      onHide={() => setIsDatePickerOpen(false)}
                                    >
                                      <Popover
                                        id="datePopover-contained"
                                        className="block__datePopover-visibility"
                                      >
                                        <Popover.Header className="d-flex justify-content-between">
                                          <div></div>
                                          <span className="fw-semibold label__dates">
                                            Select Due Date
                                          </span>
                                          <div>
                                            <Button
                                              size="sm"
                                              variant="close"
                                              aria-label="close"
                                              onClick={() =>
                                                setIsDatePickerOpen(false)
                                              }
                                            />
                                          </div>
                                        </Popover.Header>
                                        <Popover.Body>
                                          <div className="d-flex justify-content-center">
                                            <DayPicker
                                              mode="single"
                                              selected={newTask.dueDate}
                                              onDayClick={handleDayClick}
                                            />
                                          </div>
                                          <div className="mt-3 d-flex flex-column w-100 gap-2">
                                            <button
                                              className="btn btn-primary fw-semibold"
                                              onClick={handleSaveDueDate}
                                            >
                                              Save
                                            </button>
                                            <button
                                              className="btn btn-light fw-semibold"
                                              onClick={handleRemoveDueDate}
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        </Popover.Body>
                                      </Popover>
                                    </Overlay>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                className="custom-button"
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
                {/* Comment */}
                <Comments />
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

                {activityVisible && (
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
                      <FontAwesomeIcon icon={faTags} />
                    </div>
                    <span>Label</span>
                  </div>

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
                          <div>Title</div>
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
