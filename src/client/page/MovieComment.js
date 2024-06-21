import React, { useState, useEffect } from "react";
import axios from "axios";
import userDefaultImage from "../../img/user_default.png";
import { DeleteFilled } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

function MovieComment() {
  const { t } = useTranslation();

  const [comments, setComments] = useState([]);
  const [rendered, setRendered] = useState(0);
  const [enableRender, setEnableRender] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  var token = Cookies.get("jwt_token");
  const user = typeof token === "undefined" ? null : jwtDecode(token);
  useEffect(() => {
    fetchComments();
    console.log(comments)
  }, []);

  const fetchComments = () => {
    axios
      .get(`https://backend-w87n.onrender.com/comment`)
      .then((response) => {
        setComments(response.data);
        setRendered(response.data.length);
        setEnableRender(
          response.data.length > 5 ? response.data.length - 5 : 0
        );

        fetchUserDetailsForComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchUserDetailsForComments = (comments) => {
    const commentPromises = comments.map((comment) => {
      return axios
        .get(`https://backend-w87n.onrender.com/account/view/${comment.userCommentId}`)
        .then((response) => response.data)
        .catch((error) => {
          console.error("Error fetching user details:", error);
          return null;
        });
    });

    Promise.all(commentPromises).then((userDetails) => {
      const updatedComments = comments.map((comment, index) => {
        return {
          ...comment,
          userComment: userDetails[index],
        };
      });
      setComments(updatedComments);
    });
  };

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = (event) => {
    // if(user!=null){
    //   event.preventDefault();
    //   const currentDate = new Date().toISOString();
    //   const newCommentData = {
    //     parentId: null,
    //     content: newComment,
    //     commentAt: currentDate,
    //     updateAt: currentDate,
    //     deleteAt: null,
    //     status: 1,
    //     movieId: 2,
    //     userCommentId: user.idUser,
    //     userReplyId: 5,
    //     chapterId: 1,
    //   };
    //   axios
    //     .post("http://localhost:8080/comment/create", newCommentData)
    //     .then((response) => {
    //       console.log(response);
    //       setNewComment('');  
  
    //       fetchComments();
    //     })
    //     .catch((error) => {
    //       console.error("Error posting comment:", error);
    //     });
    // }
   
  };

  // const handleReplyInputChange = (event, commentId) => {
  //   const { value } = event.target;
  //   setReplyContent((prevState) => ({
  //     ...prevState,
  //     [commentId]: value,
  //   }));
  // };

  const handleSubmitReply = (event, commentId) => {
    // event.preventDefault();
    // const reply = replyContent[commentId];
    // const currentDate = new Date().toISOString();
    // const replyData = {
    //   parentId: commentId,
    //   content: reply,
    //   commentAt: currentDate,
    //   updateAt: currentDate,
    //   deleteAt: null,
    //   status: 1,
    //   movieId: 2,
    //   userCommentId: user.idUser,
    //   userReplyId: 1,
    //   chapterId: 1,
    // };

    // axios
    //   .post("http://localhost:8080/comment/create", replyData)
    //   .then((response) => {
    //     if (response.data.isSuccess) {
    //       setReplyContent((prevState) => ({
    //         ...prevState,
    //         [commentId]: "",
    //       }));
    //       fetchComments();
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error posting reply:", error);
    //   });
  };

  const removeComment = (idComment) => {
    // axios
    //   .post("http://localhost:8080/comment/remove", { idComment })
    //   .then((response) => {
    //     if (response.data.isSuccess) {
    //       fetchComments();
    //     }
    //   })
    //   .catch((error) => console.error("Error removing comment:", error));
  };

  const showForm = (idComment) => {
    // const updatedComments = comments.map((comment) => {
    //   if (comment.id === idComment) {
    //     return { ...comment, showReplyForm: !comment.showReplyForm };
    //   }
    //   return comment;
    // });
    // setComments(updatedComments);
  };

  return (
    <div className="anime__details__review">
      <div className="row row-no-gutters">
        <div className="section-title col-xs-6 comment-tile">
          <h5> {t("content.comment")}</h5>
        </div>
        <div className="section-title col-xs-6">
          <h5>Top View</h5>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-control new-comment"
            rows="3"
            placeholder=        {t("content.addcommnent")}

            value={newComment}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-send-comment">
        {t("content.review")}
        </button>
      </form>

      <div id="commentBase">
        {comments.slice(0, 5).map((comment) => (
          <div className="anime__review__item root0" key={comment.id}>
            <div className="anime__review__item__pic">
              <img
                src={comment.userComment?.avatarPicture || userDefaultImage}
                alt="User Avatar"
              />
            </div>
            <div className="anime__review__item__text commentDisplay">
              <h6>
                {comment.userComment?.fullName || "Anonymous"}{" "}
                <span>- {comment.commentAt}</span>
              </h6>
              <p>{comment.content}</p>
              <button
                onClick={() => removeComment(comment.id)}
                className="btn btn-delete-comment"
              >
                <DeleteFilled />
              </button>
            </div>

            <div className="replyBase">
              <button
                className="setValue btn btn-outline-info btn-reply"
                onClick={() => showForm(comment.id)}
              >
                {t("content.reply")}
              </button>
              {/* {comment.showReplyForm && (
                <form
                  onSubmit={(event) => handleSubmitReply(event, comment.id)}
                >
                  <div className="form-group">
                    <textarea
                      className="form-control new-comment"
                      rows="3"
                      placeholder="Trả lời bình luận"
                      value={replyContent[comment.id] || ""}
                      onChange={(event) =>
                        handleReplyInputChange(event, comment.id)
                      }
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-send-comment">
                    Gửi
                  </button>
                </form>
              )} */}
            </div>
          </div>
        ))}
      </div>
      {enableRender > 0 && (
        <button
          className="btn btn-outline-success"
          // onClick={() => showMore("root0")}
          value={rendered}
        >
          <h5> {t("content.showmore")}</h5>
        </button>
      )}
    </div>
  );
}
export default MovieComment;
