import {Card, Button} from 'react-bootstrap'
import './post.css'
import PersonIcon from '@mui/icons-material/Person'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import CommentIcon from '@mui/icons-material/Comment'
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

function Post({post, team}){
    //This is the main post card that handles post events, and houses the like, comment and share events too
    const [buttonPopup, setButtonPopup] = useState(false);
    const [like, setLike] = useState(0); //initial like value obtained from server and set in useEffect bellow
    const [likeObjects, setLikeObjects] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const hasImage = false;
    const postAuthor = post.author; //entire author object derived from post
    const postAuthorId = postAuthor.id; //this is just the ID of POST author, NOT entire object,
    const commentCount = post.count; //comment counter obtained from server
    const myAuthorId = "9230a258-b554-4d6d-b6d8-c8b9440a75c4"; // this is my user author id, get from Context
    const myAuthorIdUrl = "https://cmput-404-w22-group-10-backend.herokuapp.com/authors/9230a258-b554-4d6d-b6d8-c8b9440a75c4"; //this is my user author id path, ideally retrieved from Context
    const [author, setAuthor] = useState({});
    const commentsSrc = post.commentsSrc;
    const [likeId, setLikeId] = useState(0);
    const [buttonSmallPopupForLike, setButtonSmallPopupForLike] = useState(false);
    const [buttonSmallPopupForShare, setButtonSmallPopupForShare] = useState(false);

    
    /* NOTES FOR MYSELF

    right now author info is being fetched, not needed in the future as author info will come in post object

    */


     useEffect(() => {
         //fetches data from the server
       
        const fetchAuthor = async () => {
            const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + myAuthorId + "/");
            setAuthor(result.data);
        } 

        const fetchLikeCount = async () => {

            if (team === "team10") {
                const postUrl = new URL(post.id); //this is full url that includes http://localhost:8000/ stuff
                const postPath = postUrl.pathname; //this is path of post e.g. authors/{authorid}/posts/{postid}
                await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com" + postPath + "/likes")
                .then((response) => {
                const result = response;
                const likeObjectRecieved = response.data;
                hasAuthorAlreadyLiked(likeObjectRecieved);

                if (result.data.length !== undefined){
                    setLike(result.data.length);
                    setLikeObjects(result.data);
                }
            });
            }

            if (team === "team9"){
                await axios.get(post.id + "/likes")
                .then((response) => {
                const result = response;
                //console.log("RECIEVED LIKE: ", response)
                const likeObjectRecieved = response.data.items;
                hasAuthorAlreadyLiked(likeObjectRecieved);
                if (result.data.length !== undefined){
                    setLike(result.data.length);
                    setLikeObjects(result.data.items);
                }
            });
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
                if (like.author.id === myAuthorIdUrl){
                    //console.log("SET TO TRUE")
                    setIsLiked(true);
                    const likeIdUrl = new URL(like.id);
                    const likeIdUrlPath = likeIdUrl.pathname;
                    setLikeId(like.id);
                }
            })
        } 
        fetchLikeCount();
        fetchAuthor();
    },[])

 
    const likeHandler = async () => {
        //handles how a like is sent, and manages likes/dislikes
        var newLike = {
            "author": myAuthorIdUrl, //just sending in ID
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
            "summary": author.displayName + " likes your post",
            "type" : "Like",
            "author": author,
            "object": post.id
        }
       // console.log("REMOTENEWLIKE: ", remoteNewLike)
       
        if (team === "team10"){
        if (!isLiked){
            //console.log("LIKE OBJECT: ",newLike);
                //sending POST req with like object to post object
               try {
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
                    console.log(error)
                } 

                //sending POST req with like object to inbox of post author
                try {
                    await axios.post(postAuthorId + "/inbox/", newLike)
                    .then((response) => {
                        //console.log("THIS IS THE DATA",response.data);
                        //setLikeId(response.data.id);
                    });
                } catch (error) {
                    console.log(error)
                }
                }  else {
                    console.log("DELETED LIKE");
                    try {
                        //await axios.delete( postPath + "/likes/" + likeId)
                        //likeId is already full path
                        await axios.delete(likeId)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            if (team === "team9"){
                if (!isLiked){

                    try {
                        await axios.post(post.author.id + "/inbox", remoteNewLike)
                        .then((response) => {
                            //console.log("THIS IS THE DATA",response.data);
                            //setLikeId(response.data.id);
                        });
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    console.log("DELETED LIKE");
                    try {
                        //await axios.delete( postPath + "/likes/" + likeId)
                        //likeId is already full path
                        //await axios.delete(likeId)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

        //if user has already liked it and called, will decrement. if user hasnt liked, will increment. 
        setLike(isLiked ? like - 1: like + 1); 
        //changes isliked state of user
        setIsLiked(!isLiked) 

        console.log("like changed!: ", like, isLiked);
    }

    const shareHandler = () => {
        
    }

    return(
        <div className='postCard'>
            <Card >
                <Card.Header>
                    <div className="postTopLeft">

                        {/* <img className="postProfileImg" /> */}
                        <PersonIcon className="postProfileImg"/>
                        <span className="postUsername">
                            {postAuthor.displayName}
                        </span>
                        <span className="postDate">
                            {format(post.published)}
                        </span>
                     </div> 
                </Card.Header>
                <Card.Title className='postTitle'>
                    {post.title}
                </Card.Title>
                <Card.Subtitle className='postDesc'>
                    {post.description}
                </Card.Subtitle>
                

                <Card.Body className="text-center">
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
                        <ReactMarkdown children= {post.content} ></ReactMarkdown>
                    }

                </Card.Body>
                <Card.Subtitle className='postTags'>
                    Tags: {post.categories}
                </Card.Subtitle>

                {hasImage && 
                    <Card.Img 
                        className = "postImage" 
                        variant="bottom" 
                        src="holder.js/100px180" 
                    /> }
    
                <Card.Footer className="text-muted">
                    <div className="postOptions">


                        { !isLiked && 
                            <div className="postOption" onClick={likeHandler}>
                                <ThumbUpIcon htmlColor="blue" className="postIcon" />
                                <span data-testid = "likeCount" className="postLikeCounter">
                                    {like}
                                </span>
                            </div>}

                        { isLiked && 
                            <div className="postOption" >
                                <ThumbUpIcon htmlColor="red" className="postIcon" onClick={likeHandler}/>
                                <span data-testid = "likeCount" className="postLikeCounter" onClick={() => setButtonSmallPopupForLike(true)}>
                                    {like}
                                </span>
                            </div>}


                        <div className="postOption" onClick={() => setButtonPopup(true)}>
                            <CommentIcon htmlColor="green" className="postIcon" />
                            <span data-testid = "commentCount" className="postCommentCounter">
                                {commentCount}
                            </span>
                        </div>
                    
                        <div className="postOption" onClick={() => setButtonSmallPopupForShare(true)}>
                            <ShareIcon htmlColor="red" className="postIcon" />
                        </div>
                    </div>
                    
                </Card.Footer>

            </Card>

                <Popup trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                    {/* passing in current user id and  sending in post link */}
                    { (team === "team10") &&
                        <CommentSection
                            team = {team}
                            //myAuthorId = {myAuthorId}
                            myAuthor = {author}
                            commentsId = {post.comments}
                            commentCount = {commentCount}
                            postAuthorId = {postAuthor.id}/>
                    }
                    { (team === "team9") &&
                        <CommentSection 
                            team = {team}
                            //myAuthorId = {myAuthorId}
                            myAuthor = {author}
                            commentsId = {post.id}
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

                <PopupSmall trigger = {buttonSmallPopupForShare} setTrigger = {setButtonSmallPopupForShare}>
                    
                
                     <div>
                     <span>
                         SHARE
                     </span>
                    </div>
                    
                    
              
                   
                </PopupSmall>
        </div>
    )

}

export default Post;