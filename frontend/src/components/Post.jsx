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

    const [buttonPopup, setButtonPopup] = useState(false);
    const [like, setLike] = useState(6); //initial like value obtained from server
    const [isLiked, setIsLiked] = useState(false);
    const hasImage = false;
    const commentCount = post.count; //comment counter obtained from server
    const postId = post.id;
    const authorId = post.author;
    const [author, setAuthor] = useState({});
    const commentsSrc = post.commentsSrc;
    const currentUserId = 1;
    const currentUserName = "Gurjog Singh"
    const [likeId, setLikeId] = useState(0);

    //console.log("THIS IS POST", post);

   

     useEffect(() => {
        const fetchAuthor = async () => {
            const result = await axios.get("authors/" + authorId + "/");
            setAuthor(result.data);
        }
        const fetchLikeCount = async () => {
            const result = await axios.get("/authors/f9d6c844-b5d7-4b7f-b84b-d623e3dedf85/posts/0640839f-698a-420b-8c25-ef1422832b76/likes");
            setLike(result.data.length);
        }
        fetchLikeCount();
        fetchAuthor();
    },[])
 
    const likeHandler = async () => {

        var newLike = {
            "author": post.author,
        }

        
        if (!isLiked){
            console.log("LIKE OBJECT: ",newLike);
            try {
                await axios.post("/authors/f9d6c844-b5d7-4b7f-b84b-d623e3dedf85/posts/0640839f-698a-420b-8c25-ef1422832b76/likes", newLike)
                .then((response) => {
                    console.log("THIS IS THE DATA",response.data);
                    setLikeId(response.data.id);
                });
            } catch (error) {
                console.log(error)
            }
        }  else {
            console.log("DELETED LIKE");
            try {
                await axios.delete("/authors/f9d6c844-b5d7-4b7f-b84b-d623e3dedf85/posts/0640839f-698a-420b-8c25-ef1422832b76/likes/" + likeId)
            } catch (error) {
                console.log(error)
            }

        } 

        setLike(isLiked ? like - 1: like + 1); //if user has already liked it and called, will decrement. if user hasnt liked, will increment. 
        setIsLiked(!isLiked) //changes isliked state of user

        console.log("like changed!: ", like, isLiked);

        



    }

    const shareHandler = () => {
        console.log("share the post!");
    }

    return(

        <div className='postCard'>
            <Card >
                <Card.Header>
                    <div className="postTopLeft">
                    {/* <img className="postProfileImg" /> */}
                    <PersonIcon className="postProfileImg"/>
                    <span className="postUsername">{author.displayName}</span>
                    <span className="postDate">{format(post.published)}</span>
                     </div> 
                </Card.Header>
                <Card.Body className="text-center">
                        <Card.Text>
                            {post.description}
                        </Card.Text>
                     
                </Card.Body>
                {hasImage && <Card.Img className = "postImage" variant="bottom" src="holder.js/100px180" /> }
    
                <Card.Footer className="text-muted">
                    <div className="postOptions">
                {/* <Button variant="primary" onClick={() => setButtonPopup(true)} >Comment Section</Button> */}
                    
                    { !isLiked && <div className="postOption" onClick={likeHandler}>
                        <ThumbUpIcon htmlColor="blue" className="postIcon" />
                        <span className="postLikeCounter">{like}</span>
                    </div>}

                    { isLiked && <div className="postOption" onClick={likeHandler}>
                        <ThumbUpIcon htmlColor="red" className="postIcon" />
                        <span className="postLikeCounter">{like}</span>
                    </div>}


                    <div className="postOption" onClick={() => setButtonPopup(true)}>
                        <CommentIcon htmlColor="green" className="postIcon" />
                        <span className="postCommentCounter">{commentCount}</span>
                    </div>
                    <div className="postOption" onClick={shareHandler}>
                        <ShareIcon htmlColor="red" className="postIcon" />
                    </div>
                    </div>
                    
                </Card.Footer>

            </Card>

            <Popup trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                {/* passing in current user id and  sending in post link */}
                <CommentSection currentUserId = {currentUserId} commentsId = {post.comments}/>
            </Popup>

        </div>


    )


}

export default Post;