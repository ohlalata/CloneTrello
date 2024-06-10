import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import Link component from react-router-dom
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";
import * as constants from "../../shared/constants";
import boardService from "../../api/Services/board";

const NavBar = () => {
  const { name } = useParams();
  const [boardByName, setBoardByName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleGetBoardByName = async (searchTerm) => {
    try {
      const response = await boardService.getBoardByName(searchTerm);
      if (response.data.code === 200) {
        setBoardByName(response.data.data);
        console.log("Board fetched successfully!");
      } else {
        console.error("Failed to fetch board.");
      }
    } catch (error) {
      console.error("Error fetching board by name:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    handleGetBoardByName(event.target.value);
  };
  useEffect(() => {
    handleGetBoardByName(name);
  }, [name]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleBoardClick = (boardId) => {
    navigate(`/board/board-content/${boardId}`);
  };

  return (
    <React.Fragment>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <div className="ms-3">
            <a className="navbar-brand fs-4 fw-bolder" style={{ color: "#455570" }}>
              Trellone
            </a>
          </div>

          <div className="d-flex flex-fill gap-2">
            <div>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" variant="light">
                  Workspaces
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Your Workspaces</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#/action-2">Workspaces 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Workspaces 2</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" variant="light">
                  Recent
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-2">Workspaces 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Workspaces 2</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" variant="light">
                  Starred
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" variant="light">
                  More
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-2">Template 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Template 2</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div>
              <button type="button" className="btn btn-primary">
                <span className="fw-semibold">Create</span>
              </button>
            </div>
          </div>

          <form
            className={`d-flex align-items-center position-relative ${isFocused ? "focused" : ""}`}
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
                  <button key={key} className="dropdown-item" onClick={() => handleBoardClick(board.id)}>
                    {board.name}
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="ms-2 d-flex gap-3">
            <div>
              <FontAwesomeIcon icon={faBell} size="lg" color="#909191" />
            </div>
            <div>
              <FontAwesomeIcon icon={faCircleQuestion} size="lg" color="#909191" />
            </div>
            <div>
              <img src={constants.USER_UNDEFINE} alt="user" className="image-user" />
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavBar;
