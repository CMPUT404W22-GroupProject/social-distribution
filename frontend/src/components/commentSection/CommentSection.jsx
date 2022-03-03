import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Comment from "../comment/Comment";
import CreateComment from "../createComment/CreateComment";
import '../comments.css'
import axios from "axios"
import { badgeUnstyledClasses } from "@mui/base";
import { NewReleases } from "@mui/icons-material";

const CommentSection = ({currentUserId, commentsId}) => {
    const [backendComments, setBackendComments] = useState([]);
    const commentsUrl = new URL(commentsId);
    const commentsPath = commentsUrl.pathname;
    const [author, setAuthor] = useState([]);

    console.log("COMMENTSPATH: ", commentsPath);
    
    const fetchComments = async () => {
        const result = await axios.get(commentsPath);
        
        setBackendComments(result.data.comments)
    }

    const fetchAuthor = async () => {
        const result = await axios.get("/authors/1");
        setAuthor(result.data)
    }

    

    useEffect(() => {
        // this is where we fetch comments from the api

        fetchAuthor();
        fetchComments();
        
    }, []);

const addComment  = async (text) => {
    //console.log("addComment:", text);
    //setBackendComments([text, ...backendComments])

    var date = new Date();
    var formattedDate = date.toISOString();

    var newComment = {
        "type": "comment",
        //"author": author,
        "comment": text,
        "commentType": "text/markdown",
        "published": formattedDate,
    }
    var newInternalComment = {
        "type": "comment",
        "author": author,
        "comment": text,
        "commentType": "text/markdown",
        "published": formattedDate,
    }
    
    try {

        await axios.post(commentsPath + '/', newComment);

       } catch (error) {
         console.log(error)


       }
       //fetch from server again if comment is uploaded, ideally new one should show as well or display is internally
       setBackendComments([newInternalComment, ...backendComments])
       //OR
       //fetchComments();

    console.log("addComment:", newComment);
};
    return (
        <div className="comments">
            <h3 className="comments-title"> Comments</h3>
            <div className="comment-form-title">Post a comment!</div>
            <CreateComment submitLabel = "Post" handleSubmit={addComment} currentUserId ={currentUserId} />
            
            <div className="comments-container">
                {/* //remember to send in key = {backendComment.id} when you have it */}
                {console.log("COMMENTS", backendComments)}
                {backendComments.map((backendComment) => (
                    
                    <Comment key = {backendComment.id} currentUserId = {currentUserId} comment = {backendComment} />
                    //commentBody = {b.comment} commentAuthor = {b.author.displayName} commentDate = {b.published}

                ))}
            </div>
        </div>




    )
};

export default CommentSection;