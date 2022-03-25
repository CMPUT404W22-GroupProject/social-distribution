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

    //const userId = "53f89145-c0bb-4a01-a26a-5a3332e47156"; // JACK SPARROW AUTHOR
    const userId = "9170ef2f-501c-47c7-a8b2-99480fb49216"; //MOE AUTHOR
    const [buttonPopup, setButtonPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    const [authorId, setAuthorId] = useState(JSON.parse(id)["id"]); //authorId from URL
    const [urlAuthor, setUrlAuthor] = useState({});
    const emptyObject = {}// temporary for Follow
    const [teamServer, setTeamServer] = useState("");
    const [team10Authors, setTeam10Authors] = useState([]);
    const [team9Authors, setTeam9Authors] = useState([]);
    const [team4Authors, setTeam4Authors] = useState([]);
    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");

    //const {id, setId} = useContext(UserContext); use this to get user object once authentication is sorted

    useEffect(() => {
        const getAuthorServer = async () => {
            
            //getting authors from team 10, and storing
            //await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/service/authors/")
            await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/", {
                headers: {
                  'Authorization': 'Basic ' + team10Authorization
                }
              })
            .then((response) => {
                //console.log("TEAM 10 RESPONSE: ", response.data);
                setTeam10Authors(response.data); //authors in response.data.result
                const team10data = response.data.items; // set to response.data.results when using heroku
                team10data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ authorId === foreignAuthorPath) {
                        console.log("TEM10 AUTHOR")
                        setTeamServer("team10");
                        feedLoader("team10");
                        setUrlAuthor(foreignAuthor);
                    }
                })
            });
            
            //getting authors from team 9, and storing
            await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors", {
                headers: {
                  'Authorization': 'Basic ' + team9Authorization
                }
              })
            .then((response) => {
                //console.log("TEAM 9 RESPONSE: ", response);
                setTeam9Authors(response.data); //authors in response.data.result
                const team9data = response.data.items;
                team9data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/service/authors/"+ authorId === foreignAuthorPath) {
                       setTeamServer("team9");
                       feedLoader("team9");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
            });


            //getting authors from team 4, and storing 
            await axios.get("https://backend-404.herokuapp.com/authors/", {
                headers: {
                  'authorization': 'Basic ' + team4Authorization
                }
              })
            .then((response) => {
                //console.log("TEAM 4 RESPONSE: ", response);
                setTeam9Authors(response.data); //authors in response.data.result
                const team4data = response.data.items;
                team4data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ authorId === foreignAuthorPath) {
                        console.log("TEAM 4 AUTHOR FOUND")
                       setTeamServer("team4");
                       feedLoader("team4");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
            });
            //checking if author ID from url is in team10 or team9
            //declaring what server to use then 
        }
        //get data from inbox here
        //if type is post, then put to post, if type is like then add to like and so on
        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                var result;
                if (team === "team10"){
                    result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + authorId + "/posts", {
                        headers: {
                          'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                    setCount(result.data.count);
                } else if (team === "team9"){
                    result = await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/" + authorId + "/posts", {
                        headers: {
                          'authorization': 'Basic ' + team9Authorization
                        }
                      });
                    setCount(result.data.items.length);
                } else if (team === "team4"){
                    result = await axios.get("https://backend-404.herokuapp.com/authors/" + authorId + "/posts", {
                        headers: {
                          'authorization': 'Basic ' + team4Authorization
                        }
                      });
                } 
                setRecievedData(result);
                console.log("FUJFVSUFSPUVFBVF: ", result.data)
                
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            } else {
                var result;
                if (team === "team10"){
                    result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + authorId + "/posts?page=" + page, {
                        headers: {
                          'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                      setCount(result.data.count);
                } else if (team === "team9"){
                    result = await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/" + authorId + "/posts?page=" + page, {
                        headers: {
                          'authorization': 'Basic ' + team9Authorization
                        }
                      });
                    setCount(result.data.items.length);
                } else if (team === "team4"){
                    result = await axios.get("https://backend-404.herokuapp.com/authors/" + authorId + "/posts?page=" + page, {
                        headers: {
                          'authorization': 'Basic ' + team4Authorization
                        }
                      });
                } 
                
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
                    const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + authorId + "/inbox/", {
                        headers: {
                          'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                    setRecievedData(result);
                    setCount(result.data.count);
                     //puts objects in array + sorts from newest to oldest
                    setInbox(result.data.items.sort((p1, p2) => {
                    return new Date(p2.published) - new Date(p1.published)
                }));
                } else {
                    const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + authorId + "/inbox?page=" + page, {
                        headers: {
                          'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                    setCount(result.data.count);
                    setRecievedData(result);
                    //puts objects in array + sorts from newest to oldest
                    setInbox(result.data.results.sort((p1, p2) => {
                    return new Date(p2.published) - new Date(p1.published)
                }));
                }
        }

        const feedLoader = (team) => {
            if (feedType === "posts"){
                if  (team === "team9"){
                    fetchPosts(team);
                    //fetchAuthor("team9")
                } 
                if (team === "team10"){
                    fetchPosts(team);
                    //fetchAuthor("team10")
                }
                if (team === "team4"){
                    fetchPosts(team);
                    //fetchAuthor("team4")
                }
            }
            if (feedType === "inbox"){
                if  (team === "team10"){
                    fetchInbox();
                    //fetchAuthor("team10")
                }
            }
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

            <div><Follow follow = {emptyObject}/></div>

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