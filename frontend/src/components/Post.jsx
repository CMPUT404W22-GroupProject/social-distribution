import {Card, Button} from 'react-bootstrap'
import './post.css'
import PersonIcon from '@mui/icons-material/Person'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import CommentIcon from '@mui/icons-material/Comment'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import ShareIcon from '@mui/icons-material/Share'
import {useState, useEffect} from 'react'
import Popup from '../components/popup/Popup'
import CommentSection from './commentSection/CommentSection'
import axios from "axios"
import {format} from "timeago.js"
import ReactMarkdown from "react-markdown";
import PopupSmall from './popupSmall/PopupSmall'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { PsychologyTwoTone } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef } from 'react';

function Post({post, team, loggedInAuthor}){
    //This is the main post card that handles post events, and houses the like, comment and share events too
    const [buttonPopup, setButtonPopup] = useState(false);
    const [like, setLike] = useState(0); //initial like value obtained from server and set in useEffect bellow
    const [likeObjects, setLikeObjects] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const hasImage = false;
    const postAuthor = post.author; //entire author object derived from post
    const postAuthorId = postAuthor.id; //this is just the ID of POST author, NOT entire object,
    const commentCount = post.count; //comment counter obtained from server
    //const myAuthorId = "53f89145-c0bb-4a01-a26a-5a3332e47156"; // this is my user author id, get from Context // JACK SPARROW
    //const loggedInAuthor.id = "https://cmput-404-w22-group-10-backend.herokuapp.com/authors/53f89145-c0bb-4a01-a26a-5a3332e47156"; //this is my user author id path, ideally retrieved from Context// JACK SPARROW
    //const myAuthorIdUrl = "https://cmput-404-w22-group-10-backend.herokuapp.com/authors/9170ef2f-501c-47c7-a8b2-99480fb49216" //MOE
    const [author, setAuthor] = useState({});
    const commentsSrc = post.commentsSrc;
    const [likeId, setLikeId] = useState(0);
    const [buttonSmallPopupForLike, setButtonSmallPopupForLike] = useState(false);
    const [buttonSmallPopupForShare, setButtonSmallPopupForShare] = useState(false);
    const [buttonSmallPopupForEdit, setButtonSmallPopupForEdit] = useState(false);
    const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token
    const postHostName = new URL(post.id).hostname;
    const [isPlain, setisPlain] = useState(false);
    const [isMarkdown, setIsMarkdown] = useState(false);
    const [postTitle, setPostTitle] = useState(post.title);
    const [postDescription, setPostDescription] = useState(post.description);
    const [postContent, setPostContent] = useState(post.content);
    const [postTags, setPostTags] = useState(post.categories);
    const [isPublic, setIsPublic] = useState(false);

    //console.log("contentype: ", post)

     useEffect(() => {
         //fetches data from the server
        const fetchLikeCount = async () => {
            if (postHostName === "cmput-404-w22-group-10-backend.herokuapp.com") {
                try {
                        const postUrl = new URL(post.id); //this is full url that includes http://localhost:8000/ stuff
                        const postPath = postUrl.pathname; //this is path of post e.g. authors/{authorid}/posts/{postid}
                        await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com" + postPath + "/likes", {
                            headers: {
                              'Authorization': 'token ' + team10token
                              //'Authorization': 'Basic ' + team10Authorization
                            }
                          })
                        .then((response) => {
                        const result = response;
                        const likeObjectRecieved = response.data;
                        hasAuthorAlreadyLiked(likeObjectRecieved);
                        

                        if (result.data.length !== undefined){
                            setLike(result.data.length);
                            setLikeObjects(result.data);
                        }
                    });
                } catch (error) {
                    //console.log(error)
                }
            }

            if ( postHostName === "cmput-404-w22-project-group09.herokuapp.com"){
                try {
                        await axios.get(post.id + "/likes", {
                            headers: {
                            'authorization': 'Basic ' + team9Authorization
                            }
                        })
                        .then((response) => {
                        const result = response;
                        //console.log("RECIEVED LIKE: ", response)
                        const likeObjectRecieved = response.data.items;
                        hasAuthorAlreadyLiked(likeObjectRecieved);
                        if (result.data.items.length !== undefined){
                            setLike(result.data.items.length);
                            setLikeObjects(result.data.items);
                        }
                    });
                } catch (error) {
                    //console.log(error)
                }
            }
            if ( postHostName === "backend-404.herokuapp.com"){
                try {
                        await axios.get(post.id + "/likes/", {
                            headers: {
                            'authorization': 'Basic ' + team4Authorization
                            }
                        })
                        .then((response) => {
                        const result = response;
                        //console.log("RECIEVED LIKE: ", response)
                        const likeObjectRecieved = response.data.items;
                        hasAuthorAlreadyLiked(likeObjectRecieved);
                        if (result.data.items.length !== undefined){
                            setLike(result.data.items.length);
                            setLikeObjects(result.data.items);
                        }
                    });
                } catch (error) {
                    //console.log(error)
                }
            }
            // NOTE: THIS ENDPOINT IS NOT RESPONSIVE!!!!
            // CANNOT FIND A /LIKES ENDPOINT THAT WORKS
            if ( postHostName === "tik-tak-toe-cmput404.herokuapp.com"){
                try {
                        await axios.get(post.id + "/likes", {
                            headers: {
                            'authorization': 'Basic ' + team0Authorization
                            }
                        })
                        .then((response) => {
                        const result = response;
                        //console.log("RECIEVED LIKE: ", response)
                        const likeObjectRecieved = response.data.items;
                        hasAuthorAlreadyLiked(likeObjectRecieved);
                        if (result.data.items.length !== undefined){
                            setLike(result.data.items.length);
                            setLikeObjects(result.data.items);
                        }
                    });
                } catch (error) {
                    //console.log(error)
                }
            }

            /* if (result.data.length !== undefined ){
                if (result.data.some(i => i.id.includes(likeId))){
                    console.log("IT INCLUDES")
                    https://stackoverflow.com/questions/56132157/how-to-check-if-array-of-object-contains-a-string
                    setIsLiked(true);
                    var temp = result.data;
                    console.log("ID SENT: ", temp.id);
                    console.log("ID STORE: ", likeId);
                }
            } */
        }
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
        fetchLikeCount();
        if (post.visibility == "PUBLIC"){
            setIsPublic(true);
        }
    },[like, commentCount])

 
    const likeHandler = async () => {
        //handles how a like is sent, and manages likes/dislikes
        var newLike = {
            "author": loggedInAuthor.id, //just sending in ID
        }

        /* {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": "Lara Croft Likes your post",         
            "type": "Like",
            "author":{
                "type":"author",
                "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                "host":"http://127.0.0.1:5454/",
                "displayName":"Lara Croft",
                "url":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                "github":"http://github.com/laracroft",
                "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
            },
            "object":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
       } */
        var remoteNewLike = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": loggedInAuthor.displayName + " likes your post",
            "type" : "Like",
            "author": loggedInAuthor,
            "object": post.id
        }
       // console.log("REMOTENEWLIKE: ", remoteNewLike)
       
        if (postHostName === "cmput-404-w22-group-10-backend.herokuapp.com"){
        if (!isLiked){
            //console.log("LIKE OBJECT: ",newLike);
                //sending POST req with like object to post object
              /*  try {
                    //THIS WILL BE REMOVED LATER, CANT POST TO THIS LINK ONLY GET
                    const postUrl = new URL(post.id); //this is full url that includes http://localhost:8000/ stuff
                    const postPath = postUrl.pathname; //this is path of post e.g. authors/{authorid}/posts/{postid}
                    await axios.post("https://cmput-404-w22-group-10-backend.herokuapp.com" + postPath + "/likes", remoteNewLike)
                    .then((response) => {
                        //console.log("THIS IS THE DATA",response.data);
                        setLikeId(response.data.id);
                        delete newLike["author"];
                        newLike["type"] = "Like";
                        newLike["id"] = response.data.id;
                    });
                } catch (error) {
                    //console.log(error)
                }  */

                //sending POST req with like object to inbox of post author
                try {
                    await axios.post(postAuthorId + "/inbox/", remoteNewLike, {
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
                    //console.log("DELETED LIKE");
                    try {
                        //await axios.delete( postPath + "/likes/" + likeId)
                        //likeId is already full path
                        //console.log("LIKEID: ", likeId)
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
            }
            if (postHostName === "cmput-404-w22-project-group09.herokuapp.com"){
                if (!isLiked){

                    try {
                        await axios.post(post.author.id + "/inbox", remoteNewLike, {
                            headers: {
                              'authorization': 'Basic ' + team9Authorization
                            }
                          })
                        .then((response) => {
                            //console.log("THIS IS THE DATA",response.data);
                            //setLikeId(response.data.id);
                        });
                    } catch (error) {
                        ////console.log(error)
                    }
                } else {
                    //console.log("DELETED LIKE");
                    try {
                        //await axios.delete( postPath + "/likes/" + likeId)
                        //likeId is already full path
                        //await axios.delete(likeId)
                    } catch (error) {
                        ////console.log(error)
                    }
                }
            }
            if (postHostName === "backend-404.herokuapp.com"){
                if (!isLiked){
                    try {
                        var inboxInfo = {
                            "summary": loggedInAuthor.displayName + " likes your post",
                            "type" : "Like",
                            "author": loggedInAuthor,
                            "object": post.id
                          }  
                        await axios.post(post.author.id + "/inbox/", inboxInfo, {
                            headers: {
                              'authorization': 'Basic ' + team4Authorization
                            }
                          });
                    } catch (error) {
                    }
                }
            }
            if (postHostName === "tik-tak-toe-cmput404.herokuapp.com"){
                if (!isLiked){
                    try {
                        await axios.post(post.author.id + "/inbox/", remoteNewLike, {
                            headers: {
                              'authorization': 'Basic ' + team0Authorization
                            }
                        });
                    }catch (error){
                    }
                }
            }

        //if user has already liked it and called, will decrement. if user hasnt liked, will increment. 
        setLike(isLiked ? like - 1: like + 1); 
        //changes isliked state of user
        setIsLiked(!isLiked) 

        //console.log("like changed!: ", like, isLiked);
    }

    const shareHandler = async () => {
       
        console.log("ORIGINAL POST", post)
        var sharedPost = post;
        
        sharedPost["author"] = loggedInAuthor;
        var origTitle = sharedPost["title"];
        sharedPost["title"] = loggedInAuthor.displayName + " shared " + post.author.displayName + "'s post: " + origTitle;
        if (sharedPost["origin"] !== ""){
            sharedPost["source"] = post.id;
        } else {
            sharedPost["origin"] = post.id;
            sharedPost["source"] = post.id;
        }
        delete sharedPost["id"];
        delete sharedPost["count"];
        delete sharedPost["commentsSrc"];
        delete sharedPost["comments"];

        var date = new Date();
        var formattedDate = date.toISOString();
        sharedPost["published"] = formattedDate;
        console.log("POST TO BE SHARED: ", sharedPost)
        
        try {
            await axios.post(loggedInAuthor.id + "/posts/", sharedPost, {
                headers: {
                  'Authorization': 'token ' + team10token
                  //'Authorization': 'Basic ' + team10Authorization
                }
              })
            .then((response) => {
                if (response.status === 201){
                    alert("Shared Successfully!")
                    sharedPost["id"] = response.data.id;
                }
            });

           

            var followers;
            await axios.get(loggedInAuthor.id + "/followers/", {
                headers: {
            'Authorization': 'token ' + team10token
            //'Authorization': 'Basic ' + team10Authorization
                }
                }).then((response) => {followers = response.data["items"]});

                for (var i in followers){
                    const follower = followers[i];
                    var status = null;
                    try {
                      const followerPathname = new URL(follower.id).hostname;
                      if (followerPathname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                          await axios.post(follower.id + "/inbox/", sharedPost, {
                            headers: {
                              'Authorization': 'token ' + team10token
                              //'Authorization': 'Basic ' + team10Authorization
                            }
                          })
                          .then((response) => {
                          status = response.status;
                          })
                      } else if (followerPathname === "cmput-404-w22-project-group09.herokuapp.com"){
                          console.log("follower.id",follower.id)
                          await axios.post(follower.id + "/inbox", sharedPost, {
                            headers: {
                              'Authorization': 'Basic ' + team9Authorization
                            }
                          })
                            .then((response) => {
                            status = response.status;
                            })
                      } else if (followerPathname === "backend-404.herokuapp.com"){
                          await axios.post(follower.id + "/inbox/", sharedPost, {
                            headers: {
                              'authorization': 'Basic ' + team4Authorization
                            }
                          })
                            .then((response) => {
                            status = response.status;
                            }) 
                      } else if (followerPathname === "tik-tak-toe-cmput404.herokuapp.com"){
                          await axios.post(follower.id + "/inbox/", sharedPost, {
                            headers: {
                              'authorization': 'Basic ' + team0Authorization
                            }
                          })
                            .then((response) => {
                            status = response.status;
                            }) 
                        }
                    } catch (error) {
                    ////console.log(error)
                    }
                }

            } catch (error) {
            ////console.log(error)
            }
                if (status === 201) {
                    alert("Shared! Check profile to see post!");
                    //window.location.href = window.location.href;
                    } else {
                      alert("Oops! Something went wrong! Please make sure all fields are filled, and try again!");
                    }

    }

    const editHandler = () => {
        console.log("TIME TO EDIT")

        var editedPost = post;

        editedPost["title"] = postTitle;
        editedPost["description"] = postDescription;
        editedPost["content"] = postContent;
        editedPost["categories"] = postTags;
        
        console.log("EDITED POST: ", editedPost)

        //Sending edited post to author's posts
        axios.put(post.id + '/', editedPost, {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }
          })
          .then((response) => {
            if (response.status === 201) {
                alert("Updated! Refresh page to see edits!");
                //window.location.href = window.location.href;
                } else {
                  alert("Oops! Something went wrong! Please try again!");
                }
          })

    }

    const deleteHandler = () => {

        console.log("TIME TO DELETE")
        
        axios.delete(post.id,{
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }
        })
        .then((response) => {
            if (response.status === 204) {
                alert("Deleted successfully!");
                window.location.href = window.location.href;
                } else {
                  alert("Oops! Something went wrong! Please try again!");
                }
          })
        

    }

    return(
        <div className='postCard'>
            <Card >
                <Card.Header>
                    <div className="postTopLeft">
                        {/* <img className="postProfileImg" /> */}
                        {(post.author.profileImage === "" || post.author.profileImage === null) && 
                        <PersonIcon className="postProfileImg"/>}
                        {(post.author.profileImage !== "" && post.author.profileImage !== null) && 
                        <img className= "postProfileImg" src = {post.author.profileImage}/>}
                        <span className="postUsername">
                            {postAuthor.displayName}
                        </span>
                        <span className="postDate">
                            {format(post.published)}
                        </span>
                       { (post.author.id === loggedInAuthor.id) && (isPublic) && <span className ="postEditDelete">
                           {console.log(post.postAuthorId, "=====", loggedInAuthor.id)}
                            <EditIcon htmlColor='purple' onClick = {()=>{setButtonSmallPopupForEdit(true)}}/>
                            <DeleteIcon htmlColor='red' onClick = {() => {deleteHandler()}}/>
                        </span>}
                     </div> 
                </Card.Header>
                {/* <div className="postDetails">
                    <Card.Title className='postTitle'>
                        {post.title}
                    </Card.Title>
                    <Card.Subtitle className='postDesc'>
                        {post.description}
                    </Card.Subtitle>
                    

                    <Card.Body>
                        {(post.contentType == "text/plain") &&
                            <Card.Text>
                                {post.content}

                            </Card.Text>}
                        {
                            (post.contentType === "image/png;base64" || post.contentType === "image/jpeg;base64") &&
                            <Card.Img src = {post.content} ></Card.Img>
                        }
                        {
                            (post.contentType === "text/markdown") &&
                            <ReactMarkdown children= {post.content} escapeHtml={false}></ReactMarkdown>
                        } */}
                <div className="postDetails">
                <Card.Title className='postTitle'>
                    {post.title}
                </Card.Title>
                <Card.Subtitle className='postDesc'>
                {(team !== "team0") && 
                            post.description}
                </Card.Subtitle>
                

                <Card.Body>
                    {(post.contentType == "text/plain") &&
                        <Card.Text>
                        {(team !== "team0") && 
                            post.content}
                        {(team === "team0") && 
                            post.description}

                        </Card.Text>}
                    {
                        (post.contentType === "image/png;base64" || post.contentType === "image/jpeg;base64") &&
                        <Card.Img src = {post.content} ></Card.Img>
                    }
                    {
                        (post.contentType === "text/markdown") && (team !== "team0") &&
                        
                        <ReactMarkdown children= {post.content}></ReactMarkdown>
                    }

                    {
                        (post.contentType === "text/markdown") && (team === "team0") &&
                        
                        <ReactMarkdown children= {post.description}></ReactMarkdown>
                    }

                </Card.Body>
                <Card.Subtitle className='postTags'>
                        #{post.categories}
                </Card.Subtitle>

                {hasImage && 
                    <Card.Img 
                        className = "postImage" 
                        variant="bottom" 
                        src="holder.js/100px180" 
                    /> }
                    
                </div>
                <Card.Footer className="text-muted">
                    <div className="postOptions">


                        { !isLiked && 
                            <div className="postOption" onClick={likeHandler}>
                                <FavoriteBorderIcon htmlColor="black" className="postIcon" />
                                <span data-testid = "likeCount" className="postLikeCounter">
                                    {like} Like
                                </span>
                            </div>}

                        { isLiked && 
                            <div className="postOption" >
                                <FavoriteIcon htmlColor="red" className="postIcon" onClick={likeHandler}/>
                                <span data-testid = "likeCount" className="postLikeCounter" onClick={() => setButtonSmallPopupForLike(true)}>
                                    {like} Like
                                </span>
                            </div>}


                        <div className="postOption" onClick={() => setButtonPopup(true)}>
                            <CommentIcon htmlColor="black" className="postIcon" />
                            <span data-testid = "commentCount" className="postCommentCounter">
                                {commentCount} Comment
                            </span>
                        </div>
                    
                        <div className="postOption" onClick={() => setButtonSmallPopupForShare(true)}>
                            <IosShareIcon htmlColor="black" className="postIcon" /> Share
                        </div>
                    </div>
                    
                </Card.Footer>

            </Card>

                <Popup trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                    {/* passing in current user id and  sending in post link */}
                    { (postHostName === "cmput-404-w22-group-10-backend.herokuapp.com") &&
                        <CommentSection
                            team = {team}
                            //myAuthorId = {myAuthorId}
                            loggedInAuthor = {loggedInAuthor}
                            commentsId = {post.comments}
                            commentCount = {commentCount}
                            postAuthorId = {postAuthor.id}/>
                    }
                    { (postHostName === "cmput-404-w22-project-group09.herokuapp.com") &&
                        <CommentSection 
                            team = {team}
                            //myAuthorId = {myAuthorId}
                            loggedInAuthor = {loggedInAuthor}
                            commentsId = {post.comments}
                            commentCount = {commentCount}
                            postAuthorId = {postAuthor.id}/>
                    }
                    { (postHostName === "backend-404.herokuapp.com") &&
                        <CommentSection 
                            team = {team}
                            //myAuthorId = {myAuthorId}
                            loggedInAuthor = {loggedInAuthor}
                            commentsId = {post.id + "/comments/"}
                            commentCount = {commentCount}
                            postAuthorId = {postAuthor.id}/>
                    }
                    { (postHostName === "tik-tak-toe-cmput404.herokuapp.com") &&
                        <CommentSection 
                            team = {team}
                            //myAuthorId = {myAuthorId}
                            loggedInAuthor = {loggedInAuthor}
                            commentsId = {post.comments}
                            commentCount = {commentCount}
                            postAuthorId = {postAuthor.id}/>
                    }

                    
                </Popup>

                <PopupSmall trigger = {buttonSmallPopupForLike} setTrigger = {setButtonSmallPopupForLike}>
                    
                    {(likeObjects.length !== 0) && // Fetched data is being displayed here, if likeObjects array isnt empty
                          likeObjects.map((liker) => (
                            <div className="createPostOption">
              
                            <PersonIcon htmlColor="blue" className="createPostIcon" />
                             
                            <span className="createPostOptionText">{liker.author.displayName}</span>
                        </div>
                          ))
                          }
                    {(likeObjects.length === 0) && 
                     <div>
                        <SentimentVeryDissatisfiedIcon 
                         htmlColor = "Red"/>
                     <span>
                         You have no likes!
                     </span>
                    </div>
                    
                    }
              
                   
                </PopupSmall>

                <PopupSmall style = {{height: "20px !important"}} trigger = {buttonSmallPopupForShare} setTrigger = {setButtonSmallPopupForShare}>
                    
                
                     <div style = {{display: "flex"}}>
                     <span>
                         Share this post?
                     </span>
                     <span>{post.id}</span>
                     <Button onClick={()=>{shareHandler()}}>Share</Button>
                    </div>
                    
                </PopupSmall>

                <PopupSmall trigger = {buttonSmallPopupForEdit} setTrigger = {setButtonSmallPopupForEdit}>
                    <span>Edit Post</span>

                    <label htmlFor="postTitle">Title:</label>
                    <input name = "postTitle"
                        value = {postTitle}
                        onChange = {(e) => {setPostTitle(e.target.value)}}
                    />
                    <label htmlFor="postDescription">Description:</label>
                    <input name = "postDescription"
                        value = {postDescription}
                        onChange = {(e) => {setPostDescription(e.target.value)}}
                    />
                    <label htmlFor="postContent">Content:</label>
                    <textarea name = "postContent"
                        value = {postContent}
                        onChange = {(e) => {setPostContent(e.target.value)}}
                    />
                    <label htmlFor="postTags">Tags:</label>
                    <input name = "postTags"
                        value = {postTags}
                        onChange = {(e) => {setPostTags(e.target.value)}}
                    />

                    <Button onClick={()=>{editHandler()}}>Update</Button>

                </PopupSmall>
        </div>
    )

}

export default Post;