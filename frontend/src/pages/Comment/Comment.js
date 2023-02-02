import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  //   const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://54.209.211.222:5000/comment/${id}`).then((response) => {
      setComments(response.data);
    });
  });
  //   }, []);

  const addComment = () => {
    axios
      .post("http://54.209.211.222:5000/comment", {
        commentBody: newComment,
        ProfileId: id,
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            // username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  return (
    <div className="postPage">
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>

        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
