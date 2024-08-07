import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
// import Connection from "../signalrConnection";
import * as constants from "../../shared/constants";
import commentServices from "../../api/Services/comment";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Popover, Overlay, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import signalR from "../../utils/signalR";

const Comments = (cardId) => {
  const quillCommentRef = useRef(null);
  const deleteCommentRef = useRef(null);
  const quillUpdateCommentRed = useRef(null);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isRichTextComment, setIsRichTextComment] = useState(false);
  const [isPopoverDelete, setIsPopoverDelete] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [idDelete, setIdDelete] = useState("");
  const [commentUpdate, setCommentUpdate] = useState("");
  const [isUpdateComment, setIsUpdateComment] = useState(true);
  const [editCommentId, setEditCommentId] = useState("");

  useEffect(() => {
    const handleReceiveComment = (comment) => {
      setComments((prevComments) => {
        // Prevent duplicate comments
        if (!prevComments.find((c) => c.id === comment.id)) {
          return [...prevComments, comment];
        }
        return prevComments;
      });
      handleGetAllComment();
    };

    signalR.signalREventEmitter.on("ReceiveComment", handleReceiveComment);

    return () => {
      signalR.signalREventEmitter.off("ReceiveComment", handleReceiveComment);
    };
  }, []);

  // const tempComment = () => {

  // }

  const modulesComment = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  const formatsComment = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  const handleRichTextCommentVisible = () => {
    setIsRichTextComment(!isRichTextComment);
  };

  const handleChangeQuillComment = (content) => {
    setCommentContent(content);
  };

  const handlePopoverDelete = (event, id) => {
    if (isPopoverDelete) return;
    setIsPopoverDelete(true);
    setCommentTarget(event.target);
    setIdDelete(id);
  };

  const handleHidePopoverDelete = () => {
    setIsPopoverDelete(false);
  };

  const handleUpdateQuillComment = (content) => {
    setCommentUpdate(content);
  };

  const handleEditClick = (id, content) => {
    setIsUpdateComment(false);
    setEditCommentId(id);
    setCommentUpdate(content);
  };

  const handleDiscardChanges = () => {
    setIsUpdateComment(true);
    setEditCommentId(false);
  };

  const handleUpdateComment = async () => {
    let query = { id: editCommentId, stringEdit: commentUpdate };
    try {
      const response = await commentServices.updateComment(query);
      if (response.data.code == 200) {
        console.log("update ok");

        setIsUpdateComment(true);
        setEditCommentId(false);
        handleGetAllComment();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async () => {
    let query = { id: idDelete, isActive: false };
    try {
      const response = await commentServices.deleteComment(query);
      if (response.data.code == 200) {
        console.log("delete ok");
        handleGetAllComment();
        toast.success("Delete comment successful");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete comment fail!");
    }
  };

  const handleGetAllComment = async () => {
    let query = { cardId: cardId.cardId };
    try {
      const response = await commentServices.getAllComment(query);
      if (response.data.code == 200) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateComment = async () => {
    let query = { cardId: cardId.cardId, content: commentContent };
    try {
      const response = await commentServices.createComment(query);
      if (response.data.code == 201) {
        console.log("create comment successful");

        // // phát hiện sự kiện bình luận mới qua SignalR
        // Connection.invoke("SendComment", response.data.data);
        // // cập nhật bình luận tại tab hiện tại
        setComments((prevComments) => [...prevComments, response.data.data]);
        // console.log("CONNECTIONID: ", Connection.connectionId);
        handleGetAllComment();
        setIsRichTextComment(false);
        setCommentContent("");
        toast.success("Create comment successful");
      }
    } catch (error) {
      console.error(error);
      toast.error("Create comment fail!");
    }
  };

  useEffect(() => {
    handleGetAllComment();
  }, []);

  return (
    <React.Fragment>
      <div>
        <div className="d-flex gap-2 mt-2 align-items-center">
          <div className="block__user-comment mb-1">
            <img src={constants.USER_UNDEFINE_URL} />
          </div>
          {isRichTextComment ? (
            <div className="d-flex flex-column gap-2 block__comment-input-wrapper">
              <div className="block__rich-text-comment">
                <ReactQuill
                  ref={quillCommentRef}
                  value={commentContent}
                  onChange={handleChangeQuillComment}
                  modules={modulesComment}
                  formats={formatsComment}
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleCreateComment}
                >
                  <span className="fw-semibold">Save</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleRichTextCommentVisible}
                >
                  <span className="fw-semibold">Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex-fill p-2 block__input-comment"
              onClick={handleRichTextCommentVisible}
            >
              <span style={{ color: "#172b4d" }}>Write a comment...</span>
            </div>
          )}
        </div>
        {/* comment */}
        {comments
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .map((cataLogComments, key) => (
            <div className="d-flex mt-2 gap-2" key={key}>
              <div className="block__user-comment">
                <img src={constants.USER_UNDEFINE_URL} />
              </div>
              <div className="w-100 d-flex flex-column">
                <div>
                  <div className="d-flex gap-2">
                    <span className="fw-bold">{cataLogComments.userName}</span>
                    <span style={{ color: "#172b4d" }}>
                      {format(cataLogComments.createdDate, "PPP")}
                    </span>
                  </div>
                  {editCommentId == cataLogComments.id ? (
                    <div>
                      <div className="block__rich-text-update">
                        <ReactQuill
                          ref={quillUpdateCommentRed}
                          value={commentUpdate}
                          onChange={handleUpdateQuillComment}
                          modules={modulesComment}
                          formats={formatsComment}
                        />
                      </div>
                      <div className="d-flex gap-2 mt-1">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleUpdateComment}
                        >
                          <span className="fw-semibold">Edit</span>
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleDiscardChanges}
                        >
                          <span className="fw-semibold">Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-fill p-2 block__input-comment">
                      <div
                        className="block__comment-render-wrapper"
                        dangerouslySetInnerHTML={{
                          __html: cataLogComments.content,
                        }}
                      />
                    </div>
                  )}
                </div>

                {isUpdateComment && (
                  <div className="d-flex gap-1 mt-1 ms-2">
                    <div
                      onClick={() =>
                        handleEditClick(
                          cataLogComments.id,
                          cataLogComments.content
                        )
                      }
                    >
                      <span className="label__comment-action">Edit</span>
                    </div>
                    <span>•</span>
                    <div
                      ref={deleteCommentRef}
                      onClick={(e) =>
                        handlePopoverDelete(e, cataLogComments.id)
                      }
                      className="block__popover-delete-wrapper"
                    >
                      <span className="label__comment-action">Delete</span>

                      <Overlay
                        show={isPopoverDelete}
                        target={commentTarget}
                        placement="right"
                        container={deleteCommentRef.current}
                        rootClose={true}
                        onHide={handleHidePopoverDelete}
                      >
                        <Popover
                          id="popover-delete-comment"
                          className="block__popover-delete-comment"
                        >
                          <Popover.Header
                            className="d-flex justify-content-between"
                            style={{ backgroundColor: "#ffffff" }}
                          >
                            <div></div>
                            <span className="fw-semibold">
                              {" "}
                              Delete Comment?{" "}
                            </span>
                            <div>
                              <Button
                                variant="close"
                                aria-label="Close"
                                onClick={handleHidePopoverDelete}
                              />
                            </div>
                          </Popover.Header>
                          <Popover.Body>
                            <div className="d-flex flex-column">
                              <div>
                                <span>
                                  Deleting a comment is forever. There is no
                                  undo.
                                </span>
                              </div>
                              <div
                                className="w-100"
                                onClick={handleDeleteComment}
                              >
                                <button
                                  className="btn btn-danger btn-sm"
                                  style={{ width: "100%" }}
                                >
                                  <span className="fw-semibold">
                                    Delete comment
                                  </span>
                                </button>
                              </div>
                            </div>
                          </Popover.Body>
                        </Popover>
                      </Overlay>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Comments;
