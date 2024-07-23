import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import Link component from react-router-dom
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircleQuestion,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import * as constants from "../../shared/constants";
import boardService from "../../api/Services/board";
import userFcmTokenService from '../../api/Services/userFcmToken'; // Adjust the import path as necessary
import { getFcmToken } from '../../utils/firebase';
import { debounce } from "lodash";

const NavBar = () => {
  const { name } = useParams();
  const [boardByName, setBoardByName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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

  const handleBoardClick = (boardId) => {
    navigate(`/board/board-content/${boardId}`);
  };

  const handleInactiveUserFcmToken = async () => {
    try {
      // Retrieve the FCM token from Firebase
      const currentToken = await getFcmToken();
      if (currentToken) {
        console.log('FCM Token: ', currentToken);
  
        // Get the user ID from local storage
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        const userId = userProfile?.data?.id;
  
        if (userId) {
          // Create the query with the FCM token and user ID
          let query = {
            fcmToken: currentToken,
            userId: userId,
            isActive: false,
          };
  
          // Call the service to inactivate the FCM token
          await userFcmTokenService.changeStatus(query);
          
          // Clear user profile from local storage and navigate
          localStorage.removeItem("userProfile");
          navigate("/");
        } else {
          console.log('User ID not found in local storage.');
        }
      } else {
        console.log('No FCM token found.');
      }
    } catch (error) {
      console.error("Error inactivating FCM token:", error);
    }
  };
  const handleLogout = async () => {
    await handleInactiveUserFcmToken();
  };

  useEffect(() => {
    handleGetBoardByName(name);
  }, [name]);

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
            className={`d-flex align-items-center position-relative ${
              isFocused ? "focused" : ""
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
            {/* <div>
              <FontAwesomeIcon icon={faBell} size="lg" color="#909191" />
            </div>
            <div>
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
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
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
