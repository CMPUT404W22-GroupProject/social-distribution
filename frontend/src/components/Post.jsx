import {Card, Button} from 'react-bootstrap'
import './post.css'
import PersonIcon from '@mui/icons-material/Person'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import CommentIcon from '@mui/icons-material/Comment'
import ShareIcon from '@mui/icons-material/Share'
import {useState} from 'react'
import Popup from '../components/popup/Popup'
import CommentSection from './commentSection/CommentSection'

function Post(){

    const [buttonPopup, setButtonPopup] = useState(false);
    const [like, setLike] = useState(6); //initial like value obtained from server
    const [isLiked, setIsLiked] = useState(false);
    const commentCount = 5; //comment counter obtained from server

    const likeHandler = () => {

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
                    <span className="postUsername">Bob</span>
                    <span className="postDate">1 hour ago</span>
                     </div> 
                </Card.Header>
                <Card.Body className="text-center">
                        <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                     
                </Card.Body>
                <Card.Img className = "postImage" variant="bottom" src="holder.js/100px180" />
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
                {/* passing in current user id */}
                <CommentSection currentUserId = "1"/>
            </Popup>

        </div>


    )


}

export default Post;