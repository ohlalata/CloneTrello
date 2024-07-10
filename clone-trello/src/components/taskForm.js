import { Overlay, Popover, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const taskForm = ({
  task,
  onChange,
  onSave,
  onCancel,
  handleGetUserByTodoId,
  assignPopoverRef,
  isAssignPopoverOpen,
  closeAssignPopover,
  availableUsers,
  handleAssignMemberClick,
  dueDatePopoverRef,
  handleDueDateClick,
  isDatePickerOpen,
  setIsDatePickerOpen,
  handleDayClick,
  handleSaveDueDate,
  handleRemoveDueDate,
  selectedUser,
  dueDateLabel
}) => {
  return (
    <div className="new-task-form">
      <div className="form-row">
        <input
          type="text"
          name="name"
          value={task.name}
          onChange={onChange}
          placeholder="Task name"
        />
      </div>
      <div className="form-row">
        <select name="priorityLevel" value={task.priorityLevel} onChange={onChange}>
          <option value="" disabled>Select priority</option>
          <option value={2}>Low</option>
          <option value={1}>Medium</option>
          <option value={0}>High</option>
        </select>
        <select name="status" value={task.status} onChange={onChange}>
          <option value="" disabled>Select status</option>
          <option value={0}>New</option>
          <option value={1}>In Progress</option>
          <option value={2}>Resolved</option>
        </select>
      </div>
      <div className="form-row">
        <input
          type="text"
          name="description"
          value={task.description}
          onChange={onChange}
          placeholder="Description"
        />
      </div>
      <div className="button-container">
        <div className="form-row justify-content-end">
          <button className="custom-button" onClick={onSave}>Save</button>
          <button className="custom-button" onClick={onCancel}>Cancel</button>
        </div>
        <div className="form-row justify-content-end">
          <div className="assign-container">
            <button className="custom-button" onClick={handleGetUserByTodoId} ref={assignPopoverRef}>
              {selectedUser ? (
                <>
                  <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "5px" }} />
                  {selectedUser.name}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "5px" }} />
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
                  <Button onClick={closeAssignPopover} className="btn btn-close" style={{ marginLeft: "10px" }}></Button>
                </Popover.Header>
                <Popover.Body>
                  <div>Available Users</div>
                  <div className="scrollable-container">
                    {availableUsers.length > 0 ? (
                      <div>
                        {availableUsers.map((user, index) => (
                          <div key={index} className="member-item">
                            <div
                              className="member-details"
                              onClick={() => handleAssignMemberClick(user)}
                            >
                              <FontAwesomeIcon icon={faUser} className="user-icon" />
                              {user.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-members">No available users found</div>
                    )}
                  </div>
                </Popover.Body>
              </Popover>
            </Overlay>
          </div>
          <div ref={dueDatePopoverRef}>
            <button className="custom-button" onClick={handleDueDateClick}>
              <FontAwesomeIcon icon={faClock} style={{ marginRight: "5px" }} />
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
            <Popover id="datePopover-contained" className="block__datePopover-visibility">
              <Popover.Header className="d-flex justify-content-between">
                <div></div>
                <span className="fw-semibold label__dates">Select Due Date</span>
                <div>
                  <Button size="sm" variant="close" aria-label="close" onClick={() => setIsDatePickerOpen(false)} />
                </div>
              </Popover.Header>
              <Popover.Body>
                <div className="d-flex justify-content-center">
                  <DayPicker mode="single" selected={task.dueDate} onDayClick={handleDayClick} />
                </div>
                <div className="mt-3 d-flex flex-column w-100 gap-2">
                  <button className="btn btn-primary fw-semibold" onClick={handleSaveDueDate}>
                    Save
                  </button>
                  <button className="btn btn-light fw-semibold" onClick={handleRemoveDueDate}>
                    Remove
                  </button>
                </div>
              </Popover.Body>
            </Popover>
          </Overlay>
        </div>
      </div>
    </div>
  );
};
export default taskForm;