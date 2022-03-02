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
    const author = post.author;
    const commentsSrc = post.commentsSrc;
    const currentUserId = 1;
    const currentUserName = "Gurjog Singh"

    //console.log("THIS IS POST", post);

   

    /* useEffect(() => {

        const fetchAuthor = async () => {
            const result = await axios.get("authors/1");
           
        }

        fetchAuthor();
        
    },[])
 */
    const likeHandler = () => {

        var newLike = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": currentUserName + " likes your post",
            "type": "Like",
            "author": post.author,
            "object": post.id
        }
        {!isLiked && console.log("LIKE OBJECT: ",newLike)}

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