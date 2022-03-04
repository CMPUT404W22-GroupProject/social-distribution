import React from "react";
import { useState } from "react";
import '../comments.css'
import {Button} from 'react-bootstrap'

const CreateComment = ({handleSubmit, submitLabel, myAuthorId}) => {
    //form where user writes their comment, but doesnt handle submition of comment

    const [text, setText] = useState("");
    const isTextareaDisabled = text.length === 0;
    const canReply = Boolean(myAuthorId) //to check if the user is logged in or not, if not they cant post a comment, right now the currentUserId is hardcoded as '1'

    const onSubmit = (event) => {
        //sends text event back to parent CommentSection that deals with the data
        event.preventDefault();
        handleSubmit(text);
        setText("");
    }

    return (
        <form onSubmit={onSubmit}>
            <textarea className="comment-form-textarea" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <Button variant="primary" className="comment-form-button" type = "submit" disabled={isTextareaDisabled && canReply}>{submitLabel}</Button>
        </form>

    )
};

export default CreateComment;