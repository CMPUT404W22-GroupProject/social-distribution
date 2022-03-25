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
        const commentHostname = new URL(comment.id).hostname;
        const team4Authorization = btoa("Team10:abcdefg");
        const team9Authorization = btoa("group10:pwd1010");
        const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
        
        const fetchAuthor = async () => {
            const result = await axios.get("/authors/" + myAuthorId);
            setAuthor(result.data)
        }
        const fetchLikeCount = async () => {
            
            var result;
            if (commentHostname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                result = await axios.get(comment.id + "/likes", {
                    headers: {
                      'Authorization': 'Basic ' + team10Authorization
                    }
                  });
            } else if (commentHostname === "cmput-404-w22-project-group09.herokuapp.com"){
                result = await axios.get(comment.id + "/likes", {
                    headers: {
                      'Authorization': 'Basic ' + team9Authorization
                    }
                  });
            }
           

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
            if (commentHostname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                if (!isLiked){
                    console.log("LIKE OBJECT: ",newLike);
                    try {
                        await axios.post(comment.author.id + "/inbox/", newLike, {
                            headers: {
                              'Authorization': 'Basic ' + team10Authorization
                            }
                          })
                            .then((response) => {
                                //console.log("THIS IS THE DATA",response.data);
                                setLikeId(response.data.id);
                            }); 
                    } catch (error) {
                        //console.log(error)
                    }
                }  else {
                    console.log("DELETED LIKE");
                    try {
                        await axios.delete(likeId, {
                            headers: {
                              'Authorization': 'Basic ' + team10Authorization
                            }
                          })
                    } catch (error) {
                        //console.log(error)
                    }
                }
            } else if (commentHostname === "cmput-404-w22-project-group09.herokuapp.com"){
                if (!isLiked){
                    console.log("comment.author.id: ", comment);
                    try {
                        await axios.post(comment.author.id + "/inbox/", newLike, {
                            headers: {
                              'Authorization': 'Basic ' + team9Authorization
                            }
                          })
                            .then((response) => {
                                //console.log("THIS IS THE DATA",response.data);
                                setLikeId(response.data.id);
                            }); 
                    } catch (error) {
                        //console.log(error)
                    }
                }  else {
                    console.log("DELETED LIKE");
                    try {
                        await axios.delete(likeId, {
                            headers: {
                              'Authorization': 'Basic ' + team9Authorization
                            }
                          })
                    } catch (error) {
                        //console.log(error)
                    }
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
        
                    <div className="comment-author">{comment.author.displayName}</div>
                    
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