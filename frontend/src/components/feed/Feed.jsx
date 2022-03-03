import "./feed.css"
import CreatePost from '../createPost/CreatePost'
import Post from '../Post'
import Follow from "../follow/follow"
import Like from '../like/like'
import { useEffect, useState } from "react";
import axios from "axios"
import Popup from '../popup/Popup'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Feed(){

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [recievedData, setRecievedData] = useState([]);
    const userId = 1;
    const [buttonPopup, setButtonPopup] = useState(false);


    useEffect(() => {

        //if type is post, then put to post, if type is like then add to like and so on

        const fetchPosts = async () => {
            const result = await axios.get("/authors/1/posts");
            setRecievedData(result);
            setPosts(result.data.results);
        }

        fetchPosts();
        
    },[])

    return (

        <div>
            <div className="feedCreatePost" >
                        <AddCircleOutlineIcon htmlColor="blue" className="feedCreatePostIcon" onClick={() => setButtonPopup(true)}/>
                        <span className="feedCreatePostText">Create Post!</span>
                    </div>
        
        <Follow/>
        <Like/>
        {posts.map((post) => (
            <Post key = {post.id} post = {post}/>
        ))}
        
        {/* <Post/>
        <Post/>
        <Post/>
        <Post/>
        <Post/>
        <Post/> */}

<Popup trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                <CreatePost/>
            </Popup>

        </div>
    )

}

export default Feed;