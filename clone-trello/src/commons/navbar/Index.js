import React from "react";

const NavBar = () => {
  return (
    <React.Fragment>
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">Trello</a>
          <div className="d-flex flex-fill">
            <div>Workspaces</div>
            <div>Recent</div>
            <div>Starred</div>
            <div>More</div>
          </div>

          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavBar;
