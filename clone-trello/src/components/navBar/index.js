import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dropdown, Overlay, Popover, Button } from "react-bootstrap";
import { Link, useParams, useNavigate, Await } from "react-router-dom"; // Import Link component from react-router-dom
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircleQuestion,
  faSearch,
  faEye,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import * as constants from "../../shared/constants";
import boardService from "../../api/Services/board";
import userFcmTokenService from "../../api/Services/userFcmToken"; // Adjust the import path as necessary
import notificationService from "../../api/Services/notification";
import Connection from "../signalrConnection";
import { getFcmToken } from "../../utils/firebase";
import { debounce } from "lodash";

const NavBar = () => {
  const { name } = useParams();
  const [boardByName, setBoardByName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [showRead, setShowRead] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const handleGetBoardByName = async (searchTerm) => {
    let query = {
      name: searchTerm,
    };
    try {
      const response = await boardService.getBoardByName(query);
      if (response.data.code === 200) {
        setBoardByName(response.data.data);
      } else {
        console.error("Failed to fetch board.");
      }
    } catch (error) {
      console.error("Error fetching board by name:", error);
    }
  };

  const debouncedGetBoardByName = useCallback(
    debounce((term) => handleGetBoardByName(term), 500),
    []
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedGetBoardByName(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    handleGetBoardByName(name);
  }, [name]);

  const handleBoardClick = (boardId) => {
    navigate(`/board/board-content/${boardId}`);
  };

  // Get the user ID from local storage
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const currentUserId = userProfile?.data?.id;

  const handleInactiveUserFcmToken = async () => {
    try {
      // Retrieve the FCM token from Firebase
      const currentToken = await getFcmToken();
      if (currentToken) {
        console.log("FCM Token: ", currentToken);

        if (currentUserId) {
          // Create the query with the FCM token and user ID
          let query = {
            fcmToken: currentToken,
            userId: currentUserId,
            isActive: false,
          };

          // Call the service to inactivate the FCM token
          await userFcmTokenService.changeStatus(query);

          // Clear user profile from local storage and navigate
          localStorage.removeItem("userProfile");
          navigate("/");
        } else {
          console.log("User ID not found in local storage.");
        }
      } else {
        console.log("No FCM token found.");
      }
    } catch (error) {
      console.error("Error inactivating FCM token:", error);
    }
  };
  const handleLogout = async () => {
    await handleInactiveUserFcmToken();
  };

  ////////
  const handleGetTotalNotification = async (userId) => {
    try {
      const response = await notificationService.countNotification({ userId });
      if (response.data.code === 200) {
        const tempTotalNotifications = response.data.data;
        console.log(tempTotalNotifications)
        console.log(
          "Initial total notifications fetched:",
          tempTotalNotifications
        );
        setTotalNotifications(tempTotalNotifications);

      } else {
        console.error("Failed to fetch total notifications.");
      }
    } catch (error) {
      console.error("Error fetching total notifications:", error);
    }
  };

  useEffect(() => {
    const startSignalRConnection = async () => {
      try {
        await Connection.start();
        console.log("SignalR Connected.");

        // Get initial notification count
        await handleGetAllNotification(currentUserId);

        // Listen for real-time notification count updates
        Connection.on("ReceiveTotalNotification", (totalNotifications) => {
          // console.log("Real-time notification update received:", totalNotifications);
          // setTotalNotifications(totalNotifications);
          Connection.invoke(
            "ReceiveTotalNotification", 
            currentUserId
          );
          console.log("GetTotalNotification invoked, result:", totalNotifications);
          setTotalNotifications(totalNotifications);
  
        });

        // Invoke the server method to get total notifications
        // const result = await Connection.invoke(
        //   "ReceiveTotalNotification",  // Correct method name
        //   currentUserId
        // );
        // console.log("GetTotalNotification invoked, result:", result);
        // setTotalNotifications(result);

      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    startSignalRConnection();

    return () => {
      Connection.stop()
        .then(() => console.log("SignalR Disconnected"))
        .catch((err) => console.error("SignalR Disconnection Error: ", err));
    };
  }, [currentUserId]);


  const handleGetAllNotification = async (userId) => {
    let query = {
      userId: userId,
    };
    try {
      const response = await notificationService.getAllNotification(query);
      if (response.data.code === 200) {
        setNotifications(response.data.data);
        const totalCount = response.data.totalCount;
        console.log("Initial total notifications fetched:", totalCount);
        setTotalNotifications(totalCount);
      } else {
        console.error("Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const togglePopover = () => {
    handleGetAllNotification(currentUserId);
    setIsPopoverOpen(!isPopoverOpen);
    setShowRead(false);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const handleGetNotificationByFilter = async (userId) => {
    let query = {
      userId: userId,
      isRead: null,
    };
    try {
      const response = await notificationService.getNotificationByFilter(query);
      if (response.data.code === 200) {
        setNotifications(response.data.data);
      } else {
        console.error("Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleToggleShowRead = () => {
    setShowRead(!showRead);
    if (!showRead) {
      handleGetNotificationByFilter(currentUserId);
    } else {
      handleGetAllNotification(currentUserId);
    }
  };

  const handleChangeStatus = async (id, isRead) => {
    let query = {
      id: id,
      isRead: isRead,
    };
    try {
      const response = await notificationService.changeStatus(query);
      if (response.data.code === 200) {
        handleGetAllNotification(currentUserId);
        handleGetTotalNotification(currentUserId);
      } else {
        console.log("Error updating task check status:");
      }
    } catch (error) {
      console.error("Error updating task check status:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead
    );
    for (const notification of unreadNotifications) {
      await handleChangeStatus(notification.id, true);
    }
  };

  useEffect(() => {
    handleGetAllNotification(currentUserId);
  }, []);

  return (
    <React.Fragment>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <div className="ms-3">
            <a
              class="navbar-brand fs-4 fw-bolder"
              style={{ color: "#455570" }}
              href="/home"
            >
              Trellone
            </a>
          </div>

          <div className="d-flex flex-fill ms-3 align-items-center">
            {/* <div>
              <button type="button" className="btn btn-primary btn-sm px-4">
                <span className="fw-semibold">Create</span>
              </button>
            </div> */}
          </div>

          <form
            className={`d-flex align-items-center position-relative ${isFocused ? "focused" : ""
              }`}
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <div className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ paddingLeft: "30px" }}
            />
            {boardByName.length > 0 && isFocused && (
              <div className="search-results dropdown-menu show">
                {boardByName.map((board, key) => (
                  <button
                    key={key}
                    className="dropdown-item"
                    onClick={() => handleBoardClick(board.id)}
                  >
                    {board.name}
                  </button>
                ))}
              </div>
            )}
          </form>
          <div className="ms-2 d-flex gap-3">
            <div>
              <div
                className="notification-bell"
                onClick={togglePopover}
                ref={bellRef}
              >
                <FontAwesomeIcon icon={faBell} size="lg" color="#909191" />
                {totalNotifications > 0 && (
                  <span className="notification-count">
                    {totalNotifications}
                  </span>
                )}
              </div>
              <Overlay
                target={bellRef.current}
                show={isPopoverOpen}
                placement="bottom"
                containerPadding={20}
              >
                <Popover id="popover-basic">
                  <Popover.Header as="h3" className="notifications-header">
                    Notifications
                    <div className="notifications-controls">
                      <Button
                        onClick={handleToggleShowRead}
                        className="btn-toggle-read"
                      >
                        {showRead ? (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        ) : (
                          <FontAwesomeIcon icon={faEye} />
                        )}
                      </Button>
                      <Button onClick={closePopover} className="btn-close-noti">
                        <FontAwesomeIcon icon={faXmark} />
                      </Button>
                    </div>
                  </Popover.Header>

                  <Popover.Body className="scrollable-container">
                    {notifications.length > 0 ? (
                      <>
                        {!showRead && (
                          <div
                            className="mark-all-as-read mb-2"
                            onClick={handleMarkAllAsRead}
                          >
                            Mark all as read
                          </div>
                        )}
                        {notifications.map((notification, index) => (
                          <div key={index} className="notification-item">
                            <strong>{notification.title}</strong>
                            <p>{notification.body}</p>
                            <div
                              className="faEye-container"
                              onClick={() =>
                                handleChangeStatus(notification.id, true)
                              }
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span className="hover-text">Mark as read</span>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="no-notifications">
                        <FontAwesomeIcon icon={faBell} />
                        <div>No notifications found</div>
                      </div>
                    )}
                  </Popover.Body>
                </Popover>
              </Overlay>
            </div>

            {/* <div>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                size="lg"
                color="#909191"
              />
            </div> */}
            <div>
              <Dropdown>
                <Dropdown.Toggle
                  as="div"
                  id="dropdown-custom-components"
                  className="image-user-wrapper no-caret"
                >
                  <img
                    src={constants.USER_UNDEFINE_URL}
                    alt="user"
                    className="image-user"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="custom-dropdown-menu">
                  <Dropdown.Header>Account</Dropdown.Header>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavBar;
