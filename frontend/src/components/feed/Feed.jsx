import "./feed.css"
import CreatePost from '../createPost/CreatePost'
import { useParams } from "react-router-dom"
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
import { useContext } from "react";
import PaginationControlled from "../paginationFeed";
import ClearIcon from '@mui/icons-material/Clear';
import Github from "../github/Github"


function Feed({id, feedType}){
    //This is the main feed of the application, will house the createPost and other inbox related components
    console.log("ID", id)
    const params = useParams();
    const profileId = params.id.replace(":","")
    console.log("Profile ID", profileId)
    const [posts, setPosts] = useState([]);
    const [like, setLike] = useState([]);
    const [followerReq, setFollowerReq] = useState([]);
    const [likes, setLikes] = useState([]);
    const [recievedData, setRecievedData] = useState([]);
    const [inbox, setInbox] = useState([]);
    const loggedInAuthorId = JSON.parse(localStorage.getItem('user')).user.uuid //logged in user's uuid (gurjog - 4039f6a5-ab83-4a16-a0eb-377653be1937)
    //const loggedInAuthorId = "9170ef2f-501c-47c7-a8b2-99480fb49216"; //MOE AUTHOR
    //const loggedInAuthorId = "fe231d46-a216-4208-b806-8a064d9e7323"; //GOJO AUTHOR
    const [loggedInAuthor, setLoggedInAuthor] = useState([]);
    const [loggedInAuthorFollowers, setLoggedInAuthorFollowers] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    const [urlAuthorId, setUrlAuthorId] = useState(params.id.replace(":",""))//authorId from URL
    const [urlAuthor, setUrlAuthor] = useState([]);
    const [urlAuthorFollowers, setUrlAuthorFollowers] = useState([]);
    const emptyObject = {}// temporary for Follow
    const [teamServer, setTeamServer] = useState("");
    const [team10Authors, setTeam10Authors] = useState([]);
    const [team9Authors, setTeam9Authors] = useState([]);
    const [team4Authors, setTeam4Authors] = useState([]);
    const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token

    
    //const {id, setId} = useContext(UserContext); use this to get user object once authentication is sorted
    console.log("HUH WHAT: ", JSON.parse(localStorage.getItem('user')).user.uuid)
    //console.log("HUH WHAT: ", localStorage.getItem('user'))
    
    useEffect(() => {

        const followTestSend = async () => {

        var followTest = {
            "type": "follow",
            "summary": "I wanna follow you",
            "actor": "http://backend-404.herokuapp.com/authors/044a48a4-36e4-4fa3-a9ee-c63b216fb8b2",
            "object": "https://cmput-404-w22-group-10-backend.herokuapp.com/authors/4039f6a5-ab83-4a16-a0eb-377653be1937"
            }
        try {
            await axios.post("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/4039f6a5-ab83-4a16-a0eb-377653be1937" + "/inbox/", followTest, {
                headers: {
                  //'Authorization': 'token ' + team10token
                  'Authorization': 'Basic ' + team10Authorization
                }
              })
            .then((response) => {
                //console.log("THIS IS THE DATA",response.data);
                console.log("POSTED TO INBOX", response)
            });
        } catch (error) {
            //console.log(error)
        }
    }
        //followTestSend()
    





        const getAuthorServer = async () => {
            
            //getting authors from team 10, and storing
            //await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/service/authors/")
            await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/", {
                headers: {
                  'Authorization': 'token ' + team10token
                  //'Authorization': 'Basic ' + team10Authorization
                }
              })
            .then((response) => {
                console.log("TEAM 10 RESPONSE: ", response.data);
                //setTeam10Authors(response.data); 
                const team10data = response.data.items; 
                team10data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ urlAuthorId === foreignAuthorPath) {
                        console.log("TEM10 AUTHOR")
                        setTeamServer("team10");
                        feedLoader("team10");
                        fetchUrlAuthorFollowers("team10");
                        setUrlAuthor(foreignAuthor);
                    }
                })
                //if author page has more pages then do same process as above on other pages too, to find appropriate author
                const authorPages = Math.ceil(response.data.count/5)
                if (authorPages > 1){
                    for (let i = 2; i<= authorPages; i++){
                        getAuthorsPagination(i, "team10")
                    }
                }
            });
            
            //getting authors from team 9, and storing
            await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors", {
                headers: {
                  'Authorization': 'Basic ' + team9Authorization
                }
              })
            .then((response) => {
                //console.log("TEAM 9 RESPONSE: ", response);
                //setTeam9Authors(response.data); //authors in response.data.result
                const team9data = response.data.items;
                team9data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/service/authors/"+ urlAuthorId === foreignAuthorPath) {
                       setTeamServer("team9");
                       feedLoader("team9");
                       fetchUrlAuthorFollowers("team9");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
                 //if author page has more pages then do same process as above on other pages too, to find appropriate author
                 const authorPages = Math.ceil(response.data.count/5)
                 if (authorPages > 1){
                     for (let i = 2; i<= authorPages; i++){
                         getAuthorsPagination(i, "team9")
                     }
                 }
            });


            //getting authors from team 4, and storing 
            await axios.get("https://backend-404.herokuapp.com/authors/", {
                headers: {
                  'authorization': 'Basic ' + team4Authorization
                }
              })
            .then((response) => {
                console.log("TEAM 4 RESPONSE: ", response);
                //setTeam9Authors(response.data); //authors in response.data.result
                const team4data = response.data.items;
                team4data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ urlAuthorId === foreignAuthorPath) {
                        //console.log("TEAM 4 AUTHOR FOUND")
                       setTeamServer("team4");
                       feedLoader("team4");
                       fetchUrlAuthorFollowers("team4");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
                 //if author page has more pages then do same process as above on other pages too, to find appropriate author
                 const authorPages = Math.ceil(response.data.count/5)
                 if (authorPages > 1){
                     for (let i = 2; i<= authorPages; i++){
                         getAuthorsPagination(i, "team4")
                     }
                 }
            });
            
            // Team 0
            await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/9d090d84-0501-4a5b-9ce3-259a46a0ea0e/posts/", {
                headers: {
                  'authorization': 'Basic ' + team0Authorization
                }
              })
            .then((response) => {
                console.log("TEAM 0 RESPONSE: ", response);
                const team0data = response.data.items;
                team0data.forEach((foreignAuthor) => {

                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ urlAuthorId === foreignAuthorPath) {
                        //console.log("TEAM 4 AUTHOR FOUND")
                       setTeamServer("team0");
                       feedLoader("team0");
                       fetchUrlAuthorFollowers("team0");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
                 //if author page has more pages then do same process as above on other pages too, to find appropriate author
                 const authorPages = Math.ceil(response.data.count/5)
                 if (authorPages > 1){
                     for (let i = 2; i<= authorPages; i++){
                         getAuthorsPagination(i, "team0")
                     }
                 }
            });
            //checking if author ID from url is in team10 or team9
            //declaring what server to use then 
        }

        const getAuthorsPagination = async (page, team) => {
            if (team === "team10"){
                await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/?page=" + page, {
                    headers: {
                      
                      'Authorization': 'token ' + team10token
                      //'Authorization': 'Basic ' + team10Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 10 RESPONSE: ", response.data);
                    //setTeam10Authors(response.data);
                    const team10data = response.data.items; 
                    team10data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/authors/"+ urlAuthorId === foreignAuthorPath) {
                            
                            setTeamServer("team10");
                            feedLoader("team10");
                            fetchUrlAuthorFollowers("team10");
                            setUrlAuthor(foreignAuthor);
                        }
                    })
                });
            } else if (team === "team9"){
                await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/?page=" + page, {
                    headers: {
                      'Authorization': 'Basic ' + team9Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 9 RESPONSE: ", response);
                    //setTeam9Authors(response.data); //authors in response.data.result
                    const team9data = response.data.items;
                    team9data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/service/authors/"+ urlAuthorId === foreignAuthorPath) {
                           setTeamServer("team9");
                           feedLoader("team9");
                           fetchUrlAuthorFollowers("team9");
                           setUrlAuthor(foreignAuthor);
                            
                        }
                    })
                });
    
    
            } else if (team === "team4"){
                await axios.get("https://backend-404.herokuapp.com/authors/?page=" + page, {
                    headers: {
                      'authorization': 'Basic ' + team4Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 4 RESPONSE: ", response);
                    //setTeam9Authors(response.data); //authors in response.data.result
                    const team4data = response.data.items;
                    team4data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/authors/"+ urlAuthorId === foreignAuthorPath) {
                            //console.log("TEAM 4 AUTHOR FOUND")
                           setTeamServer("team4");
                           feedLoader("team4");
                           fetchUrlAuthorFollowers("team4");
                           setUrlAuthor(foreignAuthor);
                            
                        }
                    })
                });
    
            } else if (team === "team0"){
                await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/?page=" + page, {
                    headers: {
                      'authorization': 'Basic ' + team0Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 0 RESPONSE: ", response);
                    const team0data = response.data.items;
                    team0data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/authors/"+ urlAuthorId === foreignAuthorPath) {
                            //console.log("TEAM 4 AUTHOR FOUND")
                           setTeamServer("team0");
                           feedLoader("team0");
                           fetchUrlAuthorFollowers("team0");
                           setUrlAuthor(foreignAuthor);
                            
                        }
                    })
                });
    
            }
    
        }
        
        //get data from inbox here
        //if type is post, then put to post, if type is like then add to like and so on
        const fetchPosts = async (team) => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                var result;
                if (team === "team10"){
                    //result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/4039f6a5-ab83-4a16-a0eb-377653be1937/posts/22d3a908-b956-41e8-b894-b9e11fba356f/image", {
                        result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/"+ urlAuthorId +"/posts/", {
                        headers: {
                          
                          'Authorization': 'token ' + team10token
                          //'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                      console.log("IMAGEPOST: ", result)
                    setCount(result.data.count);
                } else if (team === "team9"){
                    result = await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/" + urlAuthorId + "/posts", {
                        headers: {
                          'authorization': 'Basic ' + team9Authorization
                        }
                      });
                    setCount(result.data.items.length);
                } else if (team === "team4"){
                    console.log("COMESHERE")
                    result = await axios.get("https://backend-404.herokuapp.com/authors/" + urlAuthorId + "/posts/", {
                        headers: {
                          'authorization': 'Basic ' + team4Authorization
                        }
                      });
                    setCount(result.data.count);
                } else if (team === "team0"){
                    result = await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/" + urlAuthorId + "/posts/", {
                        headers: {
                          'authorization': 'Basic ' + team0Authorization
                        }
                      });
                    setCount(result.data.count);
                } 
                setRecievedData(result);
                //console.log("FUJFVSUFSPUVFBVF: ", result.data)
                
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.items.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
                //return new Date(p1.published) - new Date(p2.published)
            }));
            } else {
                var result;
                if (team === "team10"){
                    result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + urlAuthorId + "/posts?page=" + page, {
                        headers: {
                          
                          'Authorization': 'token ' + team10token
                          //'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                      setCount(result.data.count);
                } else if (team === "team9"){
                    result = await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/" + urlAuthorId + "/posts?page=" + page, {
                        headers: {
                          'authorization': 'Basic ' + team9Authorization
                        }
                      });
                    setCount(result.data.items.length);
                } else if (team === "team4"){
                    result = await axios.get("https://backend-404.herokuapp.com/authors/" + urlAuthorId + "/posts?page=" + page, {
                        headers: {
                          'authorization': 'Basic ' + team4Authorization
                        }
                      });
                    setCount(result.data.count);
                } else if (team === "team0"){
                    result = await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/" + urlAuthorId + "/posts?page=" + page, {
                        headers: {
                          'authorization': 'Basic ' + team0Authorization
                        }
                      });
                    setCount(result.data.count);
                } 
                
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.items.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
                //return new Date(p1.published) - new Date(p2.published)
            }));
            }
        }

            const fetchInbox = async () => {
                //ONLY FOR TEAM 10
                //fetch inbox from user/author id
                if (page === 1){
                    const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + urlAuthorId + "/inbox/", {
                        headers: {
                          
                          'Authorization': 'token ' + team10token
                          //'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                    setRecievedData(result);
                    //console.log("RESULT: ", result)
                    setCount(result.data.count);
                     //puts objects in array + sorts from newest to oldest
                    setInbox(result.data.items.sort((p1, p2) => {
                    return new Date(p2.published) - new Date(p1.published)
                }));
                } else {
                    const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + urlAuthorId + "/inbox/?page=" + page, {
                        headers: {
                          
                          'Authorization': 'token ' + team10token
                          //'Authorization': 'Basic ' + team10Authorization
                        }
                      });
                    setCount(result.data.count);
                    setRecievedData(result);
                    //puts objects in array + sorts from newest to oldest
                    setInbox(result.data.items.sort((p1, p2) => {
                    return new Date(p2.published) - new Date(p1.published)
                }));
                }
            }   

            const fetchUrlAuthorFollowers = async (team) => {
                var result;

                if (team === "team10"){
                    result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + urlAuthorId + "/followers/", {
                  headers: {
                    
                    'Authorization': 'token ' + team10token
                    //'Authorization': 'Basic ' + team10Authorization
                    }
                    })
                } else if (team === "team9"){
                    result = await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/" + urlAuthorId + "/followers", {
                  headers: {
                    'Authorization': 'Basic ' + team9Authorization
                    }
                    })
                } else if (team === "team4"){
                    result = await axios.get("https://backend-404.herokuapp.com/authors/" + urlAuthorId + "/followers/", {
                  headers: {
                    'authorization': 'Basic ' + team4Authorization
                    }
                    })
                } else if (team === "team0"){
                    result = await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/" + urlAuthorId + "/followers/", {
                  headers: {
                    'authorization': 'Basic ' + team0Authorization
                    }
                    })
                }

                setUrlAuthorFollowers(result.data.items)

            }

            const feedLoader = (team) => {
                if (feedType === "posts"){
                    if  (team === "team9"){
                        fetchPosts(team);
                        fetchUrlAuthorFollowers(team);
                        //fetchAuthor("team9")
                    } 
                    if (team === "team10"){
                        fetchPosts(team);
                        //fetchAuthor("team10")
                        if (loggedInAuthor.id === urlAuthor.id){
                            setUrlAuthorFollowers(loggedInAuthorFollowers)
                        } else {
                            fetchUrlAuthorFollowers(team);
                        }
                        
                    }
                    if (team === "team4"){
                        fetchPosts(team);
                        //fetchAuthor("team4")
                        //fetchUrlAuthorFollowers(team);
                    }
                    if (team === "team0"){
                        fetchPosts(team);
                        //fetchAuthor("team4")
                        //fetchUrlAuthorFollowers(team);
                    }
                }
                if (feedType === "inbox"){
                    if  (team === "team10"){
                        fetchInbox();
                        //fetchAuthor("team10")
                        //fetchUrlAuthorFollowers("team10");
                    }
                }
            }

            const fetchLoggedInAuthor = async () => {
                const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + loggedInAuthorId + "/", {
                    headers: {
                      
                      'Authorization': 'token ' + team10token
                      //'Authorization': 'Basic ' + team10Authorization
                    }
                  });
                  console.log(result.data)
                setLoggedInAuthor(result.data);
            }
         
            const fetchLoggedInAuthorFollowers = async () => {
                const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + loggedInAuthorId + "/followers/", {
                  headers: {
                    
                    'Authorization': 'token ' + team10token
                    //'Authorization': 'Basic ' + team10Authorization
                  }
                })
                console.log("FOLLOWER GET: ", result.data)
                setLoggedInAuthorFollowers(result.data["items"]);
            }
        fetchLoggedInAuthor();
        fetchLoggedInAuthorFollowers();    
        getAuthorServer();
          
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

    const inboxBuilder = (object, team) => {
        
        if (object.type === "post") {
            return <Post
                    key = {object.id}
                    post = {object}
                    team = {team}
                    loggedInAuthor = {loggedInAuthor}/>

        } else if (object.type === "like" || object.type === "Like"){
            return <Like
                    key = {object.id}
                    like = {object}
                    team = {team}
                    loggedInAuthor = {loggedInAuthor}/>
            
        } else if (object.type === "comment"){
            return <InboxComment
                    key = {object.id}
                    inboxComment = {object}
                    team = {team}
                    loggedInAuthor = {loggedInAuthor}/>

        } else if (object.type === "follower" || object.type === "follow" ){
                return <Follow
                    key = {object.id}
                    follow = {object}
                    team = {team}
                    loggedInAuthor = {loggedInAuthor}/>
        } 
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

            <Github githubURL={"https://api.github.com/gurjogsingh"}/>
            <Github githubURL={"https://github.com/moenuma"}/> 

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
                        inboxBuilder(object, "team10")
                    )
                    ) 
            }
            {//TEMPORARY 
                (posts.length !== 0) && 
                    posts.map((object) => (
                        inboxBuilder(object, teamServer)
                    )
                    )
            }
            
            {/*popup with createPost component in it, called when button is clicked*/}
            <Popup 
                trigger = {buttonPopup} 
                setTrigger = {setButtonPopup}
                >
                    <CreatePost loggedInAuthor = {loggedInAuthor} loggedInAuthorId = {loggedInAuthorId} loggedInAuthorFollowers = {loggedInAuthorFollowers}/>
            </Popup>
        </div>
    )
    }



export default Feed;