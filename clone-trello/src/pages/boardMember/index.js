import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faUserXmark,
  faUserShield,
  faUser,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import boardMemberService from "../../api/Services/boardMember";
import userService from "../../api/Services/user";
import roleService from "../../api/Services/role";
import { Modal, Button, Form, OverlayTrigger, Popover } from "react-bootstrap";

const BoardMemberPages = () => {
  const { id } = useParams();
  const [boardMembers, setBoardMembers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [roleDetails, setRoleDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRoleUpdateModal, setShowRoleUpdateModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [popoverOpenMap, setPopoverOpenMap] = useState({});
  const [adminRoleId, setAdminRoleId] = useState(null);
  const [memberRoleId, setMemberRoleId] = useState(null);
  const popoverRef = useRef(null);

  const handleGetAllRoles = async () => {
    try {
      const response = await roleService.getAllRole({});
      if (response.data.code === 200) {
        const roles = response.data.data;
        const adminRole = roles.find((role) => role.name === "Admin");
        const memberRole = roles.find((role) => role.name === "Member");
        if (adminRole) {
          setAdminRoleId(adminRole.id);
        }
        if (memberRole) {
          setMemberRoleId(memberRole.id);
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    }
  };

  const handleGetAllBoardMember = async () => {
    try {
      const response = await boardMemberService.getAllBoardMember({ boardId: id });
      if (response.data.code === 200) {
        setBoardMembers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch board members:", error);
      toast.error("Failed to fetch board members");
    }
  };
  
  const handleGetUserDetails = async (userId) => {
    try {
      const response = await userService.getUserById({ id: userId });
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

  const handleGetRoleDetails = async (roleId) => {
    try {
      const response = await roleService.getAllRole({ id: roleId });
      if (response.data.code === 200) {
        const role = response.data.data.find((r) => r.id === roleId);
        setRoleDetails((prevDetails) => ({
          ...prevDetails,
          [roleId]: role,
        }));
      }
    } catch (error) {
      console.error(`Error fetching role details for roleId ${roleId}:`, error);
    }
  };

  const handleGetCurrentUserRole = async () => {
    let query = {
      boardId: id,
    };
    try {
      const response = await boardMemberService.getCurrentBoardMemberRole(query);
      if (response.data.code === 200) {
        setCurrentUserRole(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching current user role:", error);
      toast.error("Failed to fetch current user role");
    }
  };

  useEffect(() => {
    handleGetAllRoles();
    handleGetAllBoardMember();
    handleGetCurrentUserRole();
  }, [id]);

  useEffect(() => {
    boardMembers.forEach((member) => {
      if (!userDetails[member.userId]) {
        handleGetUserDetails(member.userId);
      }
      if (!roleDetails[member.roleId]) {
        handleGetRoleDetails(member.roleId);
      }
    });
  }, [boardMembers]);

  const filteredBoardMembers = boardMembers.filter((member) => {
    const user = userDetails[member.userId];
    return (
      user &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleInactiveMember = async () => {
    if (selectedMember) {
      try {
        let query = {
          id: selectedMember.id,
          isActive: false,
        };
        await boardMemberService.changeStatus(query);
        toast.success("Member inactivated successfully");
        setShowConfirmation(false);
        handleGetAllBoardMember();
      } catch (error) {
        console.error("Error inactivating member:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to inactive member";
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateBoardMember = async () => {
    if (selectedMember && selectedRole !== "") {
      try {
        let query = { id: selectedMember.id, roleId: selectedRole };
        const response = await boardMemberService.updateBoardMember(query);
        if (response.data.code === 200) {
          toast.success("Member role updated successfully");
          setShowRoleUpdateModal(false);
          handleGetAllBoardMember();
        } else {
          toast.error(response.data.message || "Failed to update member role");
        }
      } catch (error) {
        console.error("Error updating member role:", error);
        toast.error("Failed to update member role");
      }
    } else {
      toast.error("Selected member or role is invalid");
    }
  };
  
  const togglePopover = (memberId) => {
    setPopoverOpenMap((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  };

  const handleOptionClick = (roleId, member) => {
    if (currentUserRole === "Admin") {
      setSelectedMember(member);
      setSelectedRole(roleId);
      setShowRoleUpdateModal(true);
      setPopoverOpenMap({});
    } else {
      //console.log("You do not have permission to edit roles.");
    }
  };

  const handleDocumentClick = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setPopoverOpenMap({});
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="board-member-container">
      <div className="header">
        <h2 className="title">Board Members</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
      </div>
      <div className="table-wrapper">
        <table className="board-member-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Inactive</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoardMembers.map((member) => (
              <tr key={member.id} className="board-member-row">
                <td>
                  <div className="member-info">
                    <div className="member-name">
                      {userDetails[member.userId]?.name || "Loading..."}
                    </div>
                    <div className="member-email">
                      {userDetails[member.userId]?.email || "Loading..."}
                    </div>
                  </div>
                </td>
                <td
                  className="member-role"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  {currentUserRole === "Admin" ? (
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom"
                      show={popoverOpenMap[member.id] || false}
                      onToggle={() => togglePopover(member.id)}
                      overlay={
                        <Popover id={`popover-${member.id}`}>
                          <Popover.Header as="h3" className="text-center">
                            Update Role
                          </Popover.Header>
                          <Popover.Body>
                            <div className="popover-options">
                              {adminRoleId && (
                                <div
                                  className="popover-option"
                                  onClick={() =>
                                    handleOptionClick(adminRoleId, member)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faUserShield}
                                    className="option-icon"
                                  />
                                  <span className="option-text">Admin</span>
                                </div>
                              )}
                              {memberRoleId && (
                                <div
                                  className="popover-option"
                                  onClick={() =>
                                    handleOptionClick(memberRoleId, member)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="option-icon"
                                  />
                                  <span className="option-text">Member</span>
                                </div>
                              )}
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <div>
                        {roleDetails[member.roleId]?.name || "Loading..."}
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="role-icon"
                        />
                      </div>
                    </OverlayTrigger>
                  ) : (
                    <div>
                      {roleDetails[member.roleId]?.name || "Loading..."}
                    </div>
                  )}
                </td>

                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <button
                    className="ellipsis-icon"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowConfirmation(true);
                    }}
                    disabled={
                      currentUserRole !== "Admin" ||
                      roleDetails[member.roleId]?.name === "Admin"
                    }
                  >
                    <FontAwesomeIcon icon={faUserXmark} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmation && (
        <Modal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Inactive Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to inactive this member?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleInactiveMember}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showRoleUpdateModal && selectedMember && (
        <Modal
          show={showRoleUpdateModal}
          onHide={() => setShowRoleUpdateModal(false)}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Update Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to update the role for{" "}
            {userDetails[selectedMember.userId]?.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRoleUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateBoardMember}>
              Update Role
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default BoardMemberPages;
