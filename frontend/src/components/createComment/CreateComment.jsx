import React from "react";
import { useState } from "react";
import '../comments.css'
import {Button} from 'react-bootstrap'

const CreateComment = ({handleSubmit, submitLabel, currentUserId}) => {

    const [text, setText] = useState("");
    const isTextareaDisabled = text.length === 0;
    const canReply = Boolean(currentUserId) //to check if the user is logged in or not, if not they cant post a comment, right now the currentUserId is hardcoded as '1'

    const onSubmit = (event) => {
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