import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import Connection from "../signalrConnection";
import * as constants from "../../shared/constants";
import commentServices from "../../api/Services/comment";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Comments = (cardId) => {
  const quillCommentRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isRichTextComment, setIsRichTextComment] = useState(false);

  useEffect(() => {
    Connection.start()
      .then(() => {
        console.log("SignalR Connected.");
      })
      .catch((error) =>
        console.error("Error while starting connection: " + error)
      );

    Connection.on("ReceiveComment", (message) => {
      setComments((comments) => [...comments, { message }]);
    });

    // Cleanup khi component unmount
    return () => {
      console.log("CONNECTION STOP!");
      Connection.stop();
    };
  }, []);

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

  const handleGetAllComment = async () => {
    let query = { cardId: cardId.cardId };
    try {
      const response = await commentServices.getAllComment(query);
      if (response.data.code == 200) {
        console.log("get comment ok!");
        setComments(response.data.data);
        console.log(response.data.data);
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
        handleGetAllComment();
        setIsRichTextComment(false);
        setCommentContent("");
        // bla bla bla
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllComment();
  }, []);

  return (
    <React.Fragment>
      <div>
        <div className="d-flex gap-2 mt-2 align-items-center">
          <div className="block__user-comment">
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
                    <span className="fw-bold">{"hehe"}</span>
                    <span style={{ color: "#172b4d" }}>
                      {format(cataLogComments.createdDate, "PPP")}
                    </span>
                  </div>
                  <div className="flex-fill p-2 block__input-comment">
                    <span style={{ color: "#172b4d" }}>
                      {cataLogComments.content}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-1 mt-1 ms-2">
                  <span className="label__comment-action">Edit</span>
                  <span>•</span>
                  <span className="label__comment-action">Delete</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Comments;
