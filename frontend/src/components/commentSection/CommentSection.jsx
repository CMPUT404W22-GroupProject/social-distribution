import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Comment from "../comment/Comment";
import CreateComment from "../createComment/CreateComment";
import '../comments.css'
import axios from "axios"
import { badgeUnstyledClasses } from "@mui/base";
import { NewReleases } from "@mui/icons-material";
import PaginationControlled from "../paginationComments";

const CommentSection = ({loggedInAuthor, commentsId, commentCount, postAuthorId, team}) => {
    //Handles the main comment events such as submitting comments, retrieving comments.
    const [backendComments, setBackendComments] = useState([]);
    const [author, setAuthor] = useState([]);
    const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token
    const postHostName = new URL(postAuthorId).hostname;
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);

    //console.log("commentsID: ", loggedInAuthor);

    //console.log("COMMENTSPATH: ", commentsPath);
    
    const fetchComments = async () => {
      if (page === 1){
        var result;
        if (postHostName === "cmput-404-w22-group-10-backend.herokuapp.com"){
          try {
              result = await axios.get(commentsId, {
                  headers: {
                    'Authorization': 'token ' + team10token
                    //'Authorization': 'Basic ' + team10Authorization
                  }
                });
              //puts posts in array + sorts from newest to oldest
              setBackendComments(result.data.comments.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }
      // Team 9
      if (postHostName === "cmput-404-w22-project-group09.herokuapp.com"){
          try {
              result = await axios.get(commentsId, {
                  headers: {
                    'Authorization': 'Basic ' + team9Authorization
                  }
                });
              //puts posts in array + sorts from newest to oldest
              setBackendComments(result.data.comments.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }
      // Team 4
      if (postHostName === "backend-404.herokuapp.com"){
        console.log("COMING HERE", commentsId)
          try {
              //TODO: VERIFY commentsId FORMATTING
              result = await axios.get(commentsId, {
                  headers: {
                    'Authorization': 'Basic ' + team4Authorization
                  }
                });
              //Uses .items instead of .comments
              setBackendComments(result.data.items.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }
      // Team 0
      if (postHostName === "tik-tak-toe-cmput404.herokuapp.com"){
          try {
              result = await axios.get(commentsId, {
                  headers: {
                    'Authorization': 'Basic ' + team0Authorization
                  }
                });
              setBackendComments(result.data.comments.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }

      } else {
        if (postHostName === "cmput-404-w22-group-10-backend.herokuapp.com"){
          try {
              result = await axios.get(commentsId + "?page=" + page, {
                  headers: {
                    'Authorization': 'token ' + team10token
                    //'Authorization': 'Basic ' + team10Authorization
                  }
                });
              console.log("COMMENTS PAGE 2")
              //puts posts in array + sorts from newest to oldest
              setBackendComments(result.data.comments.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }
      // Team 9
      if (postHostName === "cmput-404-w22-project-group09.herokuapp.com"){
          try {
              result = await axios.get(commentsId + "?page=" + page, {
                  headers: {
                    'Authorization': 'Basic ' + team9Authorization
                  }
                });
              //puts posts in array + sorts from newest to oldest
              setBackendComments(result.data.comments.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }
      // Team 4
      if (postHostName === "backend-404.herokuapp.com"){
          try {
              //TODO: VERIFY commentsId FORMATTING
              result = await axios.get(commentsId + "?page=" + page, {
                  headers: {
                    'Authorization': 'Basic ' + team4Authorization
                  }
                });
              //TODO: VERIFY RESPONSE FORMATTING
              setBackendComments(result.data.items.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }
      // Team 0
      if (postHostName === "tik-tak-toe-cmput404.herokuapp.com"){
          try {
              result = await axios.get(commentsId + "?page=" + page, {
                  headers: {
                    'Authorization': 'Basic ' + team0Authorization
                  }
                });
              setBackendComments(result.data.comments.sort((p1, p2) => {
              return new Date(p2.published) - new Date(p1.published)
              }))
          } catch(error){
          }
          setCount(result.data.count);
      }

      }
        
    }

    const handleCallBack = (childData) => {
      //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
      setPage(childData);
  }
    useEffect(() => {
        // this is where we fetch comments from the api
        fetchComments();
        
    }, [page]);

    const addComment  = async (text) => {
        //formats comment and handles the submition 

        var date = new Date();
        var formattedDate = date.toISOString();

        var newComment = {
            "type": "comment",
            "author": loggedInAuthor,
            "comment": text,
            "contentType": "text/plain",
            "published": formattedDate.charAt,
        }

            if (postHostName === "cmput-404-w22-group-10-backend.herokuapp.com"){
                    //sending comment to post first, waiting for id
                    try {
                        await axios.post(commentsId + '/', newComment, {
                            headers: {
                              'Authorization': 'token ' + team10token
                              //'Authorization': 'Basic ' + team10Authorization
                            }
                          })
                        .then((response) => {
                            newComment["id"] = response.data.id;
                        });

                    } catch (error) {
                        //console.log(error)
                    }
                    //sending comment to inbox of post owner 

                    try {
                        await axios.post(postAuthorId + '/inbox/', newComment, {
                            headers: {
                              'Authorization': 'token ' + team10token
                              //'Authorization': 'Basic ' + team10Authorization
                            }
                          })
                        .then((response) => {
                        });

                    } catch (error) {
                        //console.log(error)
                    }
            }

            if (postHostName === "cmput-404-w22-project-group09.herokuapp.com"){
                try {
                    
                    await axios.post(commentsId, newComment, {
                        headers: {
                          'Authorization': 'Basic ' + team9Authorization
                        }
                      })
                    .then((response) => {
                        //console.log("COMMENTID: ", response)
                        newComment["id"] = response.data.id;
                    });

                } catch (error) {
                    //console.log(error)
                }
                try {
                    console.log("POST AUTHOR ID: ", postAuthorId);
                    await axios.post(postAuthorId + "/inbox", newComment, {
                        headers: {
                          'Authorization': 'Basic ' + team9Authorization
                        }
                      })
                    .then((response) => {
                    });

                } catch (error) {
                    //console.log(error)
                }

            }

            if (postHostName === "backend-404.herokuapp.com"){
              // TEAM 4 says posting comments to their backend is not possible
              // Thus this post to commentsId is useless
              try {
                var urlArray = commentsId.split("/");
                var postId = urlArray[6]; // Get the post UUID
                var postInfo =  {
                  "contentType":"text/plain",
                  "post_id": postId,
                  "comment": text,
                  }
                    await axios.post(commentsId, postInfo, {  
                      headers: {
                          'Authorization': 'Basic ' + team4Authorization
                        }
                      })
                    .then((response) => {
                        //console.log("COMMENTID: ", response)
                        newComment["id"] = response.data.id;
                    });

                } catch (error) {
                    //console.log(error)
                }
                try {
                    console.log("POST AUTHOR ID: ", postAuthorId);
                    // We cannot get the created comment ID because we cannot get a response BECAUSE the above POST is not allowed from remote nodes
                    var inboxInfo = {
                      "type": "comment",
                      "id": commentsId,
                      "author": loggedInAuthor,
                  }
                  await axios.post(postAuthorId + "/inbox/", inboxInfo, {
                      headers: {
                        'Authorization': 'Basic ' + team4Authorization
                      }
                    })
                    // The response from Team 0 has no valuable information
                    // Only returns "author" and "type"
                  .then((response) => {
                  });

                } catch (error) {
                    //console.log(error)
                }
            }
            if (postHostName === "tik-tak-toe-cmput404.herokuapp.com"){
              // This also seems to be locked away from remote users
              // Still give it the correct format as per their spec
              var inboxInfo = {
                "title": "New Comment",
                "content": text,
                "contentType": "text/plain"
              }
              try {
                    await axios.post(commentsId, newComment, {
                        headers: {
                          'Authorization': 'Basic ' + team0Authorization
                        }
                      })
                    .then((response) => {
                        //console.log("COMMENTID: ", response)
                        newComment["id"] = response.data.id;
                    });

                } catch (error) {
                    //console.log(error)
                }
                try {
                  console.log("POST AUTHOR ID: ", postAuthorId);
                  var inboxInfo = {
                    "type": "comment",
                    "id": commentsId,
                    "author": loggedInAuthor,
                  }
                  await axios.post(postAuthorId + "/inbox/", inboxInfo, {
                      headers: {
                        'Authorization': 'Basic ' + team0Authorization
                      }
                    })
                  .then((response) => {
                  });

                } catch (error) {
                    //console.log(error)
                }
            }
        

       //fetch from server again if comment is uploaded, ideally new one should show as well or display is internally
       //setBackendComments([newInternalComment, ...backendComments])
       //OR
       fetchComments();

    console.log("addComment:", newComment);
};
    return (
        <div className="comments">
            <div className="comments-title"> Comments</div>
            <div class="form-group">
              <label>Post a comment</label>
              <CreateComment  submitLabel = "Post" handleSubmit={addComment} loggedInAuthor ={loggedInAuthor} />
              <div className="comments-container">
                  {/* //remember to send in key = {backendComment.id} when you have it */}
                  {backendComments.map((backendComment) => (
                      
                      <Comment key = {backendComment.id} loggedInAuthor = {loggedInAuthor} comment = {backendComment} team = {team}/>
                      //commentBody = {b.comment} commentAuthor = {b.author.displayName} commentDate = {b.published}

                  ))}
              </div>
              <PaginationControlled count = {count} parentCallBack = {handleCallBack}/>
            </div>
        </div>
    )
};

export default CommentSection;