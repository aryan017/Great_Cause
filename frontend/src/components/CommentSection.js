import React, { useState, useEffect } from "react";
import {
  fetchComment,
  addComment,
  likeComment,
  dislikeComment,
  updateComment,
  deleteComment
} from "../api/api";
import "../assests/comments.css";
import EmojiPicker from "emoji-picker-react";

const CommentSection = ({ campaignId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  const fetchComments = async () => {
    try {
      const response = await fetchComment(campaignId);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await addComment(campaignId, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async (commentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          if (comment.likedBy?.includes(currentUserId)) return comment; 
          
          return {
            ...comment,
            likes: comment.likes + 1,
            likedBy: [...(comment.likedBy || []), currentUserId],
            dislikedBy: (comment.dislikedBy || []).filter(id => id !== currentUserId), 
            dislikes: comment.dislikedBy?.includes(currentUserId) ? comment.dislikes - 1 : comment.dislikes
          };
        }
        return comment;
      })
    );

    try {
      await likeComment(commentId);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          if (comment.dislikedBy?.includes(currentUserId)) return comment; 
          
          return {
            ...comment,
            dislikes: comment.dislikes + 1,
            dislikedBy: [...(comment.dislikedBy || []), currentUserId],
            likedBy: (comment.likedBy || []).filter(id => id !== currentUserId), 
            likes: comment.likedBy?.includes(currentUserId) ? comment.likes - 1 : comment.likes
          };
        }
        return comment;
      })
    );

    try {
      await dislikeComment(commentId);
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editedComment.trim()) return;
    try {
      await updateComment(commentId, { content: editedComment });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, content: editedComment } : comment
        )
      );
      setEditingCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  const handleEditEmojiClick = (emojiObject) => {
    setEditedComment((prev) => prev + emojiObject.emoji);
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
         <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>

        {showEmojiPicker && (
        <EmojiPicker onEmojiClick={handleEmojiClick} />
        )}
        <button onClick={handleAddComment}>Post</button>
      </div>
      <ul>
        {comments?.map((comment) => (
          <li key={comment.id}>
            {editingCommentId === comment.id ? (
              <div className="edit-comment">
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                ></textarea>
                <button onClick={() => setShowEditEmojiPicker(!showEditEmojiPicker)}>😀</button>
                {showEditEmojiPicker && (
                  <EmojiPicker onEmojiClick={handleEditEmojiClick} />
                )}
                <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
                <button onClick={() => setEditingCommentId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{JSON.parse(comment.user_id).username} : {comment.content}</p>
                <div className="comment-actions">
                  <button
                    onClick={() => handleLike(comment.id)}
                    disabled={comment.likedBy?.includes(currentUserId)}
                  >
                    👍 {comment.likes}
                  </button>
                  <button
                    onClick={() => handleDislike(comment.id)}
                    disabled={comment.dislikedBy?.includes(currentUserId)}
                  >
                    👎 {comment.dislikes}
                  </button>
                  {comment.user?.id === currentUserId && (
                    <>
                      <button onClick={() => handleEditComment(comment)}>✏️ Edit</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>🗑️ Delete</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
