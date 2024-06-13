import React from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

const NavbarBoardContent = () => {
  return (
    <React.Fragment>
      <nav className="navbar navbar__board-content">
        <div className="container-fluid d-flex justify-content-between">
          <div className="d-flex gap-3">
            <div>
              <span>Board Name</span>
            </div>
            <div className="d-flex gap-2 block__change-visibility p-1 align-items-center">
              <span>
                <FontAwesomeIcon
                  icon={faUserGroup}
                  size="xs"
                  className="fw-semibold"
                />
              </span>
              <span className="fw-semibold fs-6">Workspace visible</span>
            </div>
          </div>
          <div className="d-flex gap-3">
            <div>
              <button className="btn btn-secondary btn-sm d-flex gap-1">
                <span>
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
                <span className="fw-semibold fs-6">Share</span>
              </button>
            </div>
            <div className="block__option-wrapper d-flex align-items-center">
              <span className="d-flex align-items-center justify-content-center block__option-board-content ">
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
              </span>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavbarBoardContent;
