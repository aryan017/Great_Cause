import React, { useState, useEffect } from "react";
import { fetchComment,addComment,likeComment,dislikeComment } from "../api/api";
import "../assests/comments.css"

const CommentSection = ({campaignId}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  const fetchComments = async () => {
    try {
      const response =await fetchComment(campaignId);
      console.log(response)
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response =await addComment(campaignId,{content : newComment});
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await likeComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await dislikeComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        ></textarea>
        <button onClick={handleAddComment}>Post</button>
      </div>
      <ul>
        {comments?.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <small>{JSON.parse(comment.user_id).username}</small>
            <div className="comment-actions">
              <button onClick={() => handleLike(comment.id)}>👍 {comment.likes}</button>
              <button onClick={() => handleDislike(comment.id)}>👎 {comment.dislikes}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
