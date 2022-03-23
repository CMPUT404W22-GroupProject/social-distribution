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

function Post({post}){
    //This is the main post card that handles post events, and houses the like, comment and share events too
    const [buttonPopup, setButtonPopup] = useState(false);
    const [like, setLike] = useState(0); //initial like value obtained from server and set in useEffect bellow
    const [likeObjects, setLikeObjects] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const postUrl = new URL(post.id); //this is full url that includes http://localhost:8000/ stuff
    const postPath = postUrl.pathname; //this is path of post e.g. authors/{authorid}/posts/{postid}
    const hasImage = false;
    const postAuthor = post.author; //entire author object derived from post
    const postAuthorId = postAuthor.id; //this is just the ID of POST author, NOT entire object,
    const commentCount = post.count; //comment counter obtained from server
    const myAuthorId = "3db7243e-0822-45bb-b3ce-28ff9e378e16"; // this is my user author id, get from Context
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
       
        /* const fetchAuthor = async () => {
            const result = await axios.get("authors/" + postAuthorId + "/");
            setAuthor(result.data);
        } */
        const fetchLikeCount = async () => {
            const result = await axios.get(postPath + "/likes");

            if (result.data.length !== undefined){
                setLike(result.data.length);
                setLikeObjects(result.data);

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
        fetchLikeCount();
        //fetchAuthor();
    },[])
 
    const likeHandler = async () => {
        //handles how a like is sent, and manages likes/dislikes
        var newLike = {
            "author": myAuthorId, //just sending in ID
        }
        if (!isLiked){
            console.log("LIKE OBJECT: ",newLike);
            try {
                await axios.post(postPath + "/likes", newLike)
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
                await axios.delete( postPath + "/likes/" + likeId)
            } catch (error) {
                console.log(error)
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
                    <CommentSection 
                        myAuthorId = {myAuthorId} 
                        commentsId = {post.comments}
                        commentCount = {commentCount}
                        postAuthorId = {postAuthor.id}/>
                </Popup>

                <PopupSmall trigger = {buttonSmallPopupForLike} setTrigger = {setButtonSmallPopupForLike}>
                    
                    {(likeObjects.length !== 0) && // Fetched data is being displayed here, if likeObjects array isnt empty
                          likeObjects.map((liker) => (
                            <div className="createPostOption">
              
                            <PersonIcon htmlColor="blue" className="createPostIcon" />
                             
                            <span className="createPostOptionText">{liker.displayName}</span>
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