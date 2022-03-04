import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Comment from "../comment/Comment";
import CreateComment from "../createComment/CreateComment";
import '../comments.css'
import axios from "axios"
import { badgeUnstyledClasses } from "@mui/base";
import { NewReleases } from "@mui/icons-material";

const CommentSection = ({myAuthorId, commentsId}) => {
    //Handles the main comment events such as submitting comments, retrieving comments.
    const [backendComments, setBackendComments] = useState([]);
    const commentsUrl = new URL(commentsId);
    const commentsPath = commentsUrl.pathname;
    const [author, setAuthor] = useState([]);

    //console.log("COMMENTSPATH: ", commentsPath);
    
    const fetchComments = async () => {
        try {
            const result = await axios.get(commentsPath);
            //puts posts in array + sorts from newest to oldest
            setBackendComments(result.data.comments.sort((p1, p2) => {
            return new Date(p2.published) - new Date(p1.published)
            }))
        } catch(error){
        }
    }

    const fetchAuthor = async () => {
        try {
        const result = await axios.get("/authors/" + myAuthorId);
        setAuthor(result.data)
        } catch(error){
        }
    }

    useEffect(() => {
        // this is where we fetch comments from the api
        fetchAuthor();
        fetchComments();
        
    }, []);

const addComment  = async (text) => {
    //formats comment and handles the submition 

    var date = new Date();
    var formattedDate = date.toISOString();

    var newComment = {
        "type": "comment",
        "author": myAuthorId,
        "comment": text,
        "contentType": "text/plain",
        "published": formattedDate
    }
    var newInternalComment = {
        "type": "comment",
        "author": myAuthorId,
        "comment": text,
        "published": formattedDate,
    }
    
    try {
        await axios.post(commentsPath + '/', newComment)
        .then((response) => {
            newInternalComment["id"] = response.data.id;
        });

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
            <CreateComment submitLabel = "Post" handleSubmit={addComment} myAuthorId ={myAuthorId} />
            
            <div className="comments-container">
                {/* //remember to send in key = {backendComment.id} when you have it */}
                {console.log("COMMENTS", backendComments)}
                {backendComments.map((backendComment) => (
                    
                    <Comment key = {backendComment.id} myAuthorId = {myAuthorId} comment = {backendComment} />
                    //commentBody = {b.comment} commentAuthor = {b.author.displayName} commentDate = {b.published}

                ))}
            </div>
        </div>
    )
};

export default CommentSection;