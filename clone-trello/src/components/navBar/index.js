import React from "react";
import { Dropdown } from "react-bootstrap";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import * as constants from "../../shared/constants";

const NavBar = () => {
  return (
    <React.Fragment>
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <div className="ms-3">
            <a class="navbar-brand fs-4 fw-bolder" style={{ color: "#455570" }}>
              Trellone
            </a>
          </div>

          <div className="d-flex flex-fill gap-2">
            <div></div>
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
              <button type="button" class="btn btn-primary">
                <span className="fw-semibold">Create</span>
              </button>
            </div>
          </div>

          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
          <div className="ms-2 d-flex gap-3">
            <div>
              <FontAwesomeIcon icon={faBell} size="lg" color="#909191" />
            </div>
            <div>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                size="lg"
                color="#909191"
              />
            </div>
            <div>
              <div>
                <img
                  src={constants.USER_UNDEFINE_URL}
                  alt="a"
                  className="image-user"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavBar;
