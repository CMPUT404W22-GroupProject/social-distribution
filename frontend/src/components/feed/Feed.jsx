import "./feed.css"
import CreatePost from '../createPost/CreatePost'
import Post from '../Post'
import Follow from "../follow/follow"
import Like from '../like/like'
import { useEffect, useState } from "react";
import axios from "axios"
import Popup from '../popup/Popup'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserContext from '../../context/userContext';
import { useContext } from "react"
import PaginationControlled from "../paginationFeed"

function Feed(){
    //This is the main feed of the application, will house the createPost and other inbox related components

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [recievedData, setRecievedData] = useState([]);
    const userId = "01a96c4b-8ca3-421e-b2ea-feeb2744f8e5";
    const [buttonPopup, setButtonPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    

    //const {id, setId} = useContext(UserContext); use this to get user object once authentication is sorted

    useEffect(() => {
        //get data from inbox here
        //if type is post, then put to post, if type is like then add to like and so on
        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                const result = await axios.get("/authors/" + userId + "/posts");
                setRecievedData(result);
                setCount(result.data.count);
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            } else {
                const result = await axios.get("/authors/" + userId + "/posts?page=" + page);
                setCount(result.data.count);
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }
            
        }
        fetchPosts();
    },[page])

    function refreshPage(){
        //https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
        window.location.href = window.location.href;
        return false;
    }

    const handleCallBack = (childData) => {
        //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
        setPage(childData);
    }

    
    return (
        //returning feed that will have createPost + other appropriate components shown to user form their inbox

        <div>
            {/*createPost button here, when clicked popup will popup*/}
            <div className="feedCreatePost" >
                <AddCircleOutlineIcon 
                    htmlColor="blue" 
                    className="feedCreatePostIcon" 
                    onClick={() => setButtonPopup(true)}
                    />
                <span 
                    className="feedCreatePostText">
                        Create Post!
                </span>
            </div>

            <PaginationControlled count = {count} parentCallBack = {handleCallBack}/>

            {(posts.length === 0) && //display message if post array is empty
            <div className="feedNoPostMessage">
                <SentimentVeryDissatisfiedIcon 
                    htmlColor = "Red"
                    className="feedNoPostImage"/>
                <span
                    className="feedNoPostText">
                    No new posts!
                </span>
                <RefreshIcon
                    className="feedNoPostRefresh"
                    onClick = {refreshPage}/>
            </div>}
 
           {(posts.length !== 0) && // Fetched data is being displayed here, if post array isnt empty
            posts.map((post) => (
                <Post 
                    key = {post.id} 
                    post = {post}
                />
            ))}

            

            {/*popup with createPost component in it, called when button is clicked*/}
            <Popup 
                trigger = {buttonPopup} 
                setTrigger = {setButtonPopup}
                >
                    <CreatePost/>
            </Popup>
        </div>
    )

}

export default Feed;