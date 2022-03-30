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

function Post({post}){
    //This is the main post card that handles post events, and houses the like, comment and share events too

    const [buttonPopup, setButtonPopup] = useState(false);
    const [like, setLike] = useState(0); //initial like value obtained from server and set in useEffect bellow
    const [isLiked, setIsLiked] = useState(false);
    const postUrl = new URL(post.id); //this is full url that includes http://localhost:8000/ stuff
    const postPath = postUrl.pathname; //this is path of post e.g. authors/{authorid}/posts/{postid}
    const hasImage = false;
    const postAuthorId = post.author;//this is just the ID of POST author, NOT entire object,
    const commentCount = post.count; //comment counter obtained from server
    const myAuthorId = "01a96c4b-8ca3-421e-b2ea-feeb2744f8e5"; // this is my user author id, get from Context
    const [author, setAuthor] = useState({});
    const commentsSrc = post.commentsSrc;
    const [likeId, setLikeId] = useState(0);


     useEffect(() => {
         //fetches data from the server
        const fetchAuthor = async () => {
            const result = await axios.get("authors/" + postAuthorId + "/");
            setAuthor(result.data);
        }
        const fetchLikeCount = async () => {
            const result = await axios.get(postPath + "/likes");

            if (result.data.length !== undefined){
                setLike(result.data.length);
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
        fetchAuthor();
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
                  'Authorization': 'Basic ' + team10Authorization
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
            'Authorization': 'Basic ' + team10Authorization
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
                              'Authorization': 'Basic ' + team10Authorization
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
                          await axios.post(follower.id + "/inbox", sharedPost, {
                            headers: {
                              'authorization': 'Basic ' + team4Authorization
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
                            {author.displayName}
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
                    {(post.contentType !== "image/base64") &&
                        <Card.Text>
                            {post.content}

                        </Card.Text>}
                    {
                        (post.contentType === "image/base64") &&
                        <Card.Img src = {post.content} ></Card.Img>
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
                            <div className="postOption" onClick={likeHandler}>
                                <ThumbUpIcon htmlColor="red" className="postIcon" />
                                <span data-testid = "likeCount" className="postLikeCounter">
                                    {like}
                                </span>
                            </div>}


                        <div className="postOption" onClick={() => setButtonPopup(true)}>
                            <CommentIcon htmlColor="green" className="postIcon" />
                            <span data-testid = "commentCount" className="postCommentCounter">
                                {commentCount}
                            </span>
                        </div>
                    
                        <div className="postOption" onClick={shareHandler}>
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
                        commentCount = {commentCount}/>
                </Popup>
        </div>
    )

}

export default Post;