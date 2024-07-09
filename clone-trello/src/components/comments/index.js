import React, { useEffect, useState } from "react";
import "./style.scss";
import Connection from "../signalrConnection";
import * as constants from "../../shared/constants";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    Connection.start()
      .then(() => {
        console.log("SignalR Connected.");
      })
      .catch((error) =>
        console.error("Error while starting connection: " + error)
      );
  }, []);

  return (
    <React.Fragment>
      <div>
        <div className="d-flex gap-2 mt-2 align-items-center">
          <div className="block__user-comment">
            <img src={constants.USER_UNDEFINE_URL} />
          </div>
          <div className="flex-fill p-2 block__input-comment">
            <span>Write a comment...</span>
          </div>
        </div>

        <div className="d-flex mt-3 gap-2">
          <div className="block__user-comment">
            <img src={constants.USER_UNDEFINE_URL} />
          </div>
          <div className="w-100 d-flex flex-column">
            <div>
              <div className="d-flex gap-2">
                <span>Name</span>
                <span>Jun 18 at 14:15 PM</span>
              </div>
              <div className="flex-fill p-2 block__input-comment">
                <span>...comment here...</span>
              </div>
            </div>
            <div className="d-flex gap-1 mt-1 ms-2">
              <span className="label__comment-action">Edit</span>
              <span>•</span>
              <span className="label__comment-action">Delete</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Comments;
