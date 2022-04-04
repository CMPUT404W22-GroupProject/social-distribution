import React from "react";
import '../comment/comment.css'
import {format} from "timeago.js"
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useState, useEffect} from 'react';
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import { compose } from "@mui/system";

const Comment = ({comment, loggedInAuthor, team}) => {
        // this is how the comment will appear in the CommentSection
        //user can like comments 
        const [like, setLike] = useState(0);
        const [isLiked, setIsLiked] = useState(false);
        const [author, setAuthor] = useState({});
        const [likeId, setLikeId] = useState(0);
        const commentHostname = new URL(comment.id).hostname;
        const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
        const team4Authorization = btoa("Team10:abcdefg");
        const team9Authorization = btoa("group10:pwd1010");
        const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
        const team10token = JSON.parse(localStorage.getItem('user')).token
        

        const hasAuthorAlreadyLiked = (likeObjectRecieved) => {
            likeObjectRecieved.forEach((like) => {
                //chekcing to see if logged in user has already liked the post i.e. seeing if logged in user is already in like object list
                // if so, then isLiked will be set to true. This is will avoid user liking the same object multiple times. 
                //console.log("like.author.id: ", like)
                    //console.log("myAuthorIdUrl: ", myAuthorIdUrl)
                if (like.author.id === loggedInAuthor.id){
                    //console.log("SET TO TRUE")
                    setIsLiked(true);
                    //const likeIdUrl = new URL(like.id);
                    //const likeIdUrlPath = likeIdUrl.pathname;
                    //console.log("LIKE OBJECT: ", like)
                    setLikeId(like.id);
                }
            })
        } 
        const fetchLikeCount = async () => {
            var result;
            if (commentHostname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                result = await axios.get(comment.id + "/likes", {
                    headers: {
                      'Authorization': 'token ' + team10token
                      //'Authorization': 'Basic ' + team10Authorization
                    }
                  });
                  if (result.data.length !== undefined){
                    setLike(result.data.length);
                }
                const likeObjectRecieved = result.data;
                hasAuthorAlreadyLiked(likeObjectRecieved);
            } else if (commentHostname === "cmput-404-w22-project-group09.herokuapp.com"){
                result = await axios.get(comment.id + "/likes", {
                    headers: {
                      'Authorization': 'Basic ' + team9Authorization
                    }
                  });
                  if (result.data.length !== undefined){
                    setLike(result.data.length);
                }
                const likeObjectRecieved = result.data;
                hasAuthorAlreadyLiked(likeObjectRecieved);
            } else if (commentHostname === "backend-404.herokuapp.com"){
                result = await axios.get(comment.id + "/likes/", {
                    headers: {
                      'Authorization': 'Basic ' + team4Authorization
                    }
                  });
                  if (result.data.length !== undefined){
                    setLike(result.data.length);
                }
                const likeObjectRecieved = result.data;
                hasAuthorAlreadyLiked(likeObjectRecieved);
            } else if (commentHostname === "tik-tak-toe-cmput404.herokuapp.com"){
                result = await axios.get(comment.id + "/likes/", {
                    headers: {
                      'Authorization': 'Basic ' + team0Authorization
                    }
                  });
                  if (result.data.length !== undefined){
                    setLike(result.data.length);
                }
                const likeObjectRecieved = result.data;
                hasAuthorAlreadyLiked(likeObjectRecieved);
            }

            
        }
        
        useEffect(() => {
            // this is where we fetch data from the api
            fetchLikeCount();
        }, []);

        const likeHandler = async () => {
            //handles like events
            var newLike = {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": loggedInAuthor.id + " likes your comment",
                "type" : "Like",
                "author": loggedInAuthor,
                "object": comment.id
            }
            if (commentHostname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                if (!isLiked){
                    console.log("LIKE OBJECT: ",newLike);
                    try {
                        await axios.post(comment.author.id + "/inbox/", newLike, {
                            headers: {
                              'Authorization': 'token ' + team10token
                              //'Authorization': 'Basic ' + team10Authorization
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
                              'Authorization': 'token ' + team10token
                              //'Authorization': 'Basic ' + team10Authorization
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
            } else if (commentHostname === "backend-404.herokuapp.com"){
                    if (!isLiked){
                        console.log("comment.author.id: ", comment);
                        try {
                            await axios.post(comment.author.id + "/inbox/", newLike, {
                                headers: {
                                  'Authorization': 'Basic ' + team4Authorization
                                }
                              })
                                .then((response) => {
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
                                  'Authorization': 'Basic ' + team4Authorization
                                }
                              })
                        } catch (error) {
                            //console.log(error)
                        }
                    }    
            } else if (commentHostname === "tik-tak-toe-cmput404.herokuapp.com"){
                    if (!isLiked){
                        console.log("comment.author.id: ", comment);
                        try {
                            await axios.post(comment.author.id + "/inbox/", newLike, {
                                headers: {
                                  'Authorization': 'Basic ' + team0Authorization
                                }
                              })
                                .then((response) => {
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
                                  'Authorization': 'Basic ' + team0Authorization
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
            {(comment.author.profileImage === "" || comment.author.profileImage === null) && 
                <PersonIcon className="comment-image-container"/>}
            {(comment.author.profileImage !== "" && comment.author.profileImage !== null) && 
                <img className= "comment-image-container" src = {comment.author.profileImage}/>}
            <div className="comment-center">
                <div className="comment-right-part">
                    <div className="comment-author">{comment.author.displayName}</div>
                    
                    <div className="comment-date">{format(comment.published)}</div>
                </div>
                {(team === "team0")
                ? <div className="comment-text">{comment.content}</div>
                : <div className="comment-text">{comment.comment}</div>}
            </div>
            
            { !isLiked && <div className="comment-left-part" onClick={likeHandler}>
                        <FavoriteBorderIcon data-testid="FavoriteBorderIconComment" htmlColor="black" className="comment-like" />
                        <span data-testid = "likeCommentCount" className="comment-like-counterr">{like}</span>
                    </div> }

                    { isLiked && <div className="comment-left-part" onClick={likeHandler}>
                        <FavoriteIcon data-testid="FavoriteIconComment" htmlColor="red" className="comment-like" />
                        <span data-testid = "likeCommentCount" className="comment-like-counterr">{like}</span>
                    </div> }
        </div>
    )
};

export default Comment;