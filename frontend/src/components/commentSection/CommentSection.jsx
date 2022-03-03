import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Comment from "../comment/Comment";
import CreateComment from "../createComment/CreateComment";
import '../comments.css'

const CommentSection = ({currentUserId}) => {
    const [backendComments, setBackendComments] = useState(["one_comment","two_comment"]);

    useEffect(() => {
        // this is where we fetch comments from the api
    }, []);

const addComment = (text) => {
    console.log("addComment:", text);
    setBackendComments([text, ...backendComments])
};
    return (
        <div className="comments">
            <h3 className="comments-title"> Comments</h3>
            <div className="comment-form-title">Post a comment!</div>
            <CreateComment submitLabel = "Post" handleSubmit={addComment} currentUserId ={currentUserId} />
            <div className="comments-container">
                {/* //remember to send in key = {backendComment.id} when you have it */}
                {backendComments.map(backendComment => (
                    
                    <Comment comment = {backendComment} currentUserId = {currentUserId}/>

                ))}
            </div>
        </div>




    )
};

export default CommentSection;