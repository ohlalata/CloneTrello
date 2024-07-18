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
import roleService from "../../api/Services/role";
import { Modal, Button, OverlayTrigger, Popover } from "react-bootstrap";

const BoardMemberPages = () => {
  const { id } = useParams();
  const [boardMembers, setBoardMembers] = useState([]);
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
        const boardMembers = response.data.data;
        setBoardMembers(boardMembers);

        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        const currentUserEmail = userProfile?.data?.email;

        const currentUser = boardMembers.find(
          (member) => member.userEmail === currentUserEmail
        );
        setCurrentUserRole(currentUser?.roleName);
      }
    } catch (error) {
      console.error("Failed to fetch board members:", error);
      toast.error("Failed to fetch board members");
    }
  };

  useEffect(() => {
    handleGetAllRoles();
    handleGetAllBoardMember();
  }, [id]);

  const filteredBoardMembers = boardMembers.filter((member) => {
    return (
      member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="board-member">
      <div className="board-member__header">
        <h2 className="board-member__title">Board Members</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="board-member__search-box"
        />
      </div>
      <div className="table-wrapper">
        <table className="board-member__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Inactive</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoardMembers.map((member) => (
              <tr key={member.id} className="board-member__row">
                <td>
                  <div className="board-member__info">
                    <div className="board-member__name">{member.userName}</div>
                    <div className="board-member__email">{member.userEmail}</div>
                  </div>
                </td>
                <td className="board-member__role-cell" style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {currentUserRole === "Admin" ? (
                    member.roleName !== "Admin" ? (
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
                                      className="popover-option__icon"
                                    />
                                    <span className="popover-option__text">Admin</span>
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
                                      className="popover-option__icon"
                                    />
                                    <span className="popover-option__text">Member</span>
                                  </div>
                                )}
                              </div>
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <div className="board-member__role-wrapper" style={{ cursor: "pointer" }}>
                          <span className="board-member__role">
                            {member.roleName}
                          </span>
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="board-member__role-icon"
                          />
                        </div>
                      </OverlayTrigger>
                    ) : (
                      <div className="board-member__role-wrapper">
                        <span className="board-member__role">
                          {member.roleName}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="board-member__role-wrapper">
                      <span className="board-member__role">
                        {member.roleName}
                      </span>
                    </div>
                  )}
                </td>

                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <button
                    className="board-member__ellipsis-icon"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowConfirmation(true);
                    }}
                    disabled={
                      currentUserRole !== "Admin" || member.roleName === "Admin"
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
            <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
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
            Are you sure you want to update the role for {selectedMember.userName}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleUpdateModal(false)}>
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
