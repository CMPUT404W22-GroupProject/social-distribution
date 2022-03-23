import "./feed.css"
import CreatePost from '../createPost/CreatePost'
import Post from '../Post'
import Follow from "../follow/follow"
import Like from '../like/like'
import InboxComment from "../inboxComment/inboxComment"
import { useEffect, useState } from "react";
import axios from "axios"
import Popup from '../popup/Popup'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserContext from '../../context/userContext';
import { useContext } from "react"
import PaginationControlled from "../paginationFeed"


function Feed({id, feedType}){
    //This is the main feed of the application, will house the createPost and other inbox related components

    const [posts, setPosts] = useState([]);
    const [like, setLike] = useState([]);
    const [followerReq, setFollowerReq] = useState([]);
    const [likes, setLikes] = useState([]);
    const [recievedData, setRecievedData] = useState([]);
    const [inbox, setInbox] = useState([]);
    const userId = "3db7243e-0822-45bb-b3ce-28ff9e378e16";
    const [buttonPopup, setButtonPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    const [authorId, setAuthorId] = useState(JSON.parse(id)["id"]); //authorId from URL
    const [urlAuthor, setUrlAuthor] = useState({});
    

    //const {id, setId} = useContext(UserContext); use this to get user object once authentication is sorted

    useEffect(() => {
        //get data from inbox here
        //if type is post, then put to post, if type is like then add to like and so on
        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                const result = await axios.get("/authors/" + authorId + "/posts");
                setRecievedData(result);
                setCount(result.data.count);
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            } else {
                const result = await axios.get("/authors/" + authorId + "/posts?page=" + page);
                setCount(result.data.count);
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }
            
        }
            const fetchInbox = async () => {
                //fetch inbox from user/author id
                if (page === 1){
                    const result = await axios.get("/authors/" + authorId + "/inbox/");
                    setRecievedData(result);
                    setCount(result.data.count);
                     //puts objects in array + sorts from newest to oldest
                    setInbox(result.data.items.sort((p1, p2) => {
                    return new Date(p2.published) - new Date(p1.published)
                }));
                } else {
                    const result = await axios.get("/authors/" + authorId + "/inbox?page=" + page);
                    setCount(result.data.count);
                    setRecievedData(result);
                    //puts objects in array + sorts from newest to oldest
                    setInbox(result.data.results.sort((p1, p2) => {
                    return new Date(p2.published) - new Date(p1.published)
                }));
                }
        }
        if (feedType === "posts"){
            fetchPosts();
        }
        if (feedType === "inbox"){
            fetchInbox();
        }
        const fetchAuthor = async () => {
            //fetches auhor
            const result = await axios.get("/authors/" + authorId);
            setUrlAuthor(result.data)
        }
        fetchAuthor();
        
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

    const inboxBuilder = (object) => {
        if (object.type === "post") {
            return <Post
                    key = {object.id}
                    post = {object}/>

        } else if (object.type === "like"){
            return <Like
                    key = {object.id}
                    like = {object}/>
            
        } else if (object.type === "comment"){
            return <InboxComment
                    key = {object.id}
                    inboxComment = {object}/>

        } else if (object.type === "follower"){
                return <Follow
                    key = {object.id}
                    follow = {object}/>
        } 
    }

    return (
        //returning feed that will have createPost + other appropriate components shown to user form their inbox

        <div>
            {/*createPost button here, when clicked popup will popup*/}
            <div>USER ID: {userId}</div>
            <div>URL ID: {authorId}</div>
            <div>URL Author Name: {urlAuthor.displayName}</div>
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

            {(feedType === "inbox") && (inbox.length === 0) && //display message if inbox array is empty
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
            
            {(feedType === "posts") && (posts.length === 0) && //display message if post array is empty
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

 
           {/* {(posts.length !== 0) && // Fetched data is being displayed here, if post array isnt empty
            posts.map((post) => (
                <Post 
                    key = {post.id} 
                    post = {post}
                />
            ))} */}
            {
                (inbox.length !== 0) && 
                    inbox.map((object) => (
                        inboxBuilder(object)
                    )
                    ) 
            }
            {//TEMPORARY 
                (posts.length !== 0) && 
                    posts.map((object) => (
                        inboxBuilder(object)
                    )
                    )
            }
            
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