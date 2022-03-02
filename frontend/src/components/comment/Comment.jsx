import React from "react";
import '../comments.css'
import {format} from "timeago.js"
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState, useEffect} from 'react';

const Comment = ({comment, currentUserId}) => {
        // commentBody, commentAuthor, commentDate, 
        const [like, setLike] = useState(6);
        const [isLiked, setIsLiked] = useState(false);
        //const currentUserId = 1;
        const currentUserName = "Gurjog Singh"
        


        const likeHandler = () => {

            var newLike = {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": currentUserName + " likes your post",
                "type": "Like",
                "author": comment.author, //this might not be right, confirm
                "object": comment.id
            }
            {!isLiked && console.log("LIKE OBJECT: ",newLike)}
    
            setLike(isLiked ? like - 1: like + 1); //if user has already liked it and called, will decrement. if user hasnt liked, will increment. 
            setIsLiked(!isLiked) //changes isliked state of user
    
            console.log("like changed!: ", like, isLiked);
        }

    return (
        <div className="comment">
            <div className="comment-image-container">
                <img alt="user-icon"></img>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.author.displayName}</div>
                    <div className="comment-date">{format(comment.published)}</div>
                </div>
           
                { !isLiked && <div className="comment-left-part" onClick={likeHandler}>
                        <FavoriteIcon htmlColor="grey" className="comment-like" />
                        <span className="comment-like-counterr">{like}</span>
                    </div> }

                    { isLiked && <div className="comment-left-part" onClick={likeHandler}>
                        <FavoriteIcon htmlColor="red" className="comment-like" />
                        <span className="comment-like-counterr">{like}</span>
                    </div> }
                
                <div className="comment-text">{comment.comment}</div>
            </div>
        </div>
    )
};

export default Comment;