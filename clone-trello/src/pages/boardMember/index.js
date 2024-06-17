import React, { useState, useEffect } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import boardMemberService from "../../api/Services/boardMember";
import userService from "../../api/Services/user";
import roleService from "../../api/Services/role";
import {
  Modal,
  Button
} from "react-bootstrap";

const BoardMemberPages = () => {
  const { id } = useParams();
  const [boardMembers, setBoardMembers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [roleDetails, setRoleDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGetAllBoardMember = async () => {
    try {
      const response = await boardMemberService.getAllBoardMember(id);
      if (response.data.code === 200) {
        setBoardMembers(response.data.data);
        console.log("Get board members successful!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch board members");
    }
  };

  const handleGetUserDetails = async (userId) => {
    try {
      const response = await userService.getUserById(userId);
      if (response.data.code === 200) {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          [userId]: response.data.data,
        }));
        console.log("Fetched user details:", response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching user details for userId ${userId}:`, error);
    }
  };

  const handleGetRoleDetails = async (roleId) => {
    try {
      const response = await roleService.getAllRole(roleId);
      if (response.data.code === 200) {
        const role = response.data.data.find((r) => r.id === roleId);
        setRoleDetails((prevDetails) => ({
          ...prevDetails,
          [roleId]: role,
        }));
        console.log("Fetched role details:", role);
      }
    } catch (error) {
      console.error(`Error fetching role details for roleId ${roleId}:`, error);
    }
  };

  useEffect(() => {
    handleGetAllBoardMember();
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
        console.log("Inactivating member with ID:", selectedMember.id);
        setShowConfirmation(false);
      } catch (error) {
        console.error("Error inactivating member:", error);
        toast.error("Failed to inactive member");
      }
    }
  };

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
      <table className="board-member-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th></th>
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
              <td className="member-role">
                {roleDetails[member.roleId]?.name || "Loading..."}
              </td>
              <td>
                <button
                  className="ellipsis-icon"
                  onClick={() => {
                    setSelectedMember(member);
                    setShowConfirmation(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirmation && (
        <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Inactive member</Modal.Title>
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
    </div>
  );
};

export default BoardMemberPages;
