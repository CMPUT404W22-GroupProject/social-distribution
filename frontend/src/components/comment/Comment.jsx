import React from "react";
import '../comments.css'

const Comment = ({comment, currentUserId}) => {
    

    return (
        <div className="comment">
            <div className="comment-image-container">
                <img alt="user-icon"></img>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">Author</div>
                </div>
                <div className="comment-text">{comment}</div>
            </div>
        </div>
    )
};

export default Comment;