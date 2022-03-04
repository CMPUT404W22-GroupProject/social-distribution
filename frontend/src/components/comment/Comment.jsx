import React from "react";
import '../comment/comment.css'
import {format} from "timeago.js"
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState, useEffect} from 'react';
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";

const Comment = ({comment, myAuthorId}) => {
        // this is how the comment will appear in the CommentSection
        //user can like comments 
        const [like, setLike] = useState(0);
        const [isLiked, setIsLiked] = useState(false);
        const [author, setAuthor] = useState({});
        const [likeId, setLikeId] = useState(0);
        const commentUrl = new URL(comment.id);
        const commentPath = commentUrl.pathname;
        
        const fetchAuthor = async () => {
            const result = await axios.get("/authors/" + myAuthorId);
            setAuthor(result.data)
        }
        const fetchLikeCount = async () => {
            const result = await axios.get(commentPath + "/likes");

            if (result.data.length !== undefined){
                setLike(result.data.length);
            }
        }
        
        useEffect(() => {
            // this is where we fetch data from the api
            fetchAuthor();
            fetchLikeCount();
        }, []);

        const likeHandler = async () => {
            //handles like events
            var newLike = {
                "author": myAuthorId, //just sending in ID
            }
            if (!isLiked){
                console.log("LIKE OBJECT: ",newLike);
                try {
                    await axios.post(commentPath + "/likes", newLike)
                    .then((response) => {
                        //console.log("THIS IS THE DATA",response.data);
                        setLikeId(response.data.id);
                    });
                } catch (error) {
                    console.log(error)
                }
            }  else {
                console.log("DELETED LIKE");
                try {
                    await axios.delete( commentPath + "/likes/" + likeId)
                } catch (error) {
                    console.log(error)
                }
            } 
    
            setLike(isLiked ? like - 1: like + 1); //if user has already liked it and called, will decrement. if user hasnt liked, will increment. 
            setIsLiked(!isLiked) //changes isliked state of user
    
            console.log("like changed!: ", like, isLiked);
        }

    return (
        <div className="comment">
            <PersonIcon className="comment-image-container"/>
            <div className="comment-right-part">
                    <div className="comment-author">{author.displayName}</div>
                    <div className="comment-date">{format(comment.published)}</div>
                
            </div>
            <div className="comment-text">{comment.comment}</div>
            { !isLiked && <div className="comment-left-part" onClick={likeHandler}>
                        <FavoriteIcon htmlColor="grey" className="comment-like" />
                        <span data-testid = "likeCommentCount" className="comment-like-counterr">{like}</span>
                    </div> }

                    { isLiked && <div className="comment-left-part" onClick={likeHandler}>
                        <FavoriteIcon htmlColor="red" className="comment-like" />
                        <span data-testid = "likeCommentCount" className="comment-like-counterr">{like}</span>
                    </div> }
        </div>
    )
};

export default Comment;