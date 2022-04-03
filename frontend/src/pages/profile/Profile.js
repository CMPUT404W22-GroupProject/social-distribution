import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import PaginationControlled from '../../components/paginationFeed'
import CreatePost from '../../components/createPost/CreatePost';
import Popup from '../../components/popup/Popup';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
//Components
import AvatarPhoto from '../../components/avatar/avatar'
import FollowerList from '../../components/followerList/followerList';
import FollowerCard from '../../components/followerCard/followerCard';


function Profile(){
    

    const [authorData, setAuthorData] = useState('')
    const [followers, setFollowers] = useState([])
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [buttonPopup, setButtonPopup] = useState(false);
    const params = useParams();
    const profileId = params.id.replace(":","")
    const [count, setCount] = useState(1);
    const [btnCount, setBtnCount] = useState(1)
    const [recievedData, setRecievedData] = useState([]);
    const location = useLocation()
    const user = JSON.parse(location.state.state)
    const [userState, setUserState] = useState(user)
    const currentUser = JSON.parse(localStorage.getItem('user'))

    const [hostName, setHostName] = useState("https://cmput-404-w22-group-10-backend.herokuapp.com")

    const [showFollowers, setShowFollowers] = useState(false)
    const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const [showFollowBtn, setShowFollowBtn] = useState(true)
    const [showCreatePost, setShowCreatePost] = useState(false)
    const team10token = JSON.parse(localStorage.getItem('user')).token

 

    useEffect(() => {

        fetchAuthor(user)
        if(currentUser.user.uuid == user.user.uuid){
            setShowCreatePost(true)

        }else{
            setHostName("foreignHost")
        }
        const checkFollowing = async () => {
            if (currentUser.user.uuid != user.user.uuid){
                try{
                    const res = await axios.get(URL10 + "/authors/" + user.user.uuid + '/followers/', {
                        headers: {
                            'Authorization': 'Basic ' + team10Authorization
                        }
                    })
                    const data = res.data.items
                    for (var i=0; i < data.length; i++){
                        if (currentUser.user.displayName == data[i].displayName){
                            setShowFollowBtn(false)
                        }
               }
                }catch (err){
                    console.error(err.response)
                    console.log('error')

                }

            }else{
                setShowFollowBtn(false)
            }
        }

        const fetchLocalFollowers = async () => {
            const result = await axios.get(URL10 + "/authors/" + user.user.uuid + "/followers", {
                headers: {
                  'Authorization': 'token ' + team10token
                  //'Authorization': 'Basic ' + team10Authorization
                }});
            setFollowers(result.data.items)
            return 0     
        }

        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                const result = await axios.get(URL10 + "/authors/" + user.user.uuid + "/posts", {
                    headers: {
                      'Authorization': 'Basic ' + team10Authorization
                    }});
                setRecievedData(result);
                setCount(result.data.count);
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.items.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));

            } else {
                const result = await axios.get(URL10 + "/authors/" + user.user.uuid+ "/posts?page=" + page, {
                    headers: {
                      'Authorization': 'Basic ' + team10Authorization
                    }});
                setCount(result.data.count);
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }}

        
        
        fetchPosts()
        checkFollowing()
        fetchLocalFollowers()
    },[])



    async function fetchAuthor(user) {
        const res = await axios.get(URL10 + `/authors/${user.user.uuid}`, {
            headers: {
              'Authorization': 'Basic ' + team10Authorization
            }});
        setAuthorData(res.data)
    }

    const handleCallBack = (childData) => {
        //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
        setPage(childData);
    }



    //current user will make follow request to current users profile
    const handleFollow = () => {
        console.log("button pressed")
        console.log("AUTHOR DATA ID", authorData.id)
        console.log("currentUser ID", currentUser.user.uuid)
        //this isnt working right now 
        var followRequest = { //the json file that will be sent
            "type": "follow",
            "summary": currentUser.user.displayName + "wants to follow you",
            "actor":{
                "type": "author",
                "id": URL10 + "/authors/" + currentUser.user.uuid,
                "url": URL10 + "/authors/" + currentUser.user.uuid,
                "host": URL10 + "/",
                "displayName": currentUser.user.displayName,
                "github": '',
                "profileImage": authorData.profileImage
            },
            "object":{
                "type":"author",
                "id": URL10 + "/authors/" + user.user.uuid,
                "host": URL10 + "/",
                "displayName": user.user.uuid,
                "url":URL10 + "/authors/" + user.user.uuid,
                "github": " ",
                "profileImage": authorData.profileImage
            }      
        }

        axios.post(URL10 + '/authors/' + user.user.uuid + '/inbox/', followRequest, {
            headers: {
              'Authorization': 'token ' + currentUser.token
            }
          }).then( res => {
              console.log(res)
          });
    }
    
    function showFollowersButton(e){
        setShowFollowers(false)

    }

    function showPostsButton(e){
        setShowFollowers(true)
    }

    return (
        <div>
            <AvatarPhoto id={user.user.uuid}/>
            <h2>{user.user.displayName}</h2>

            <PaginationControlled count = {count} parentCallBack = {handleCallBack}/>
         
            {!showFollowers &&
                <button onClick={showPostsButton}>Followers</button>
            }

            {showFollowers &&
                <button onClick={showFollowersButton}>Posts</button>
            }

            {showCreatePost &&  
                <div>
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
                    <Popup 
                    trigger = {buttonPopup} 
                    setTrigger = {setButtonPopup}
                    >
                        <CreatePost loggedInAuthor = {authorData} loggedInAuthorId = {authorData.id} loggedInAuthorFollowers={followers}/>
                    </Popup>
                </div>
            }

            {!showFollowers && 
                <div key={user.user.uuid}>
                    <ul> 
                        {posts.map(post => (<li ><Post key={post.id} post={post} team="cmput-404-w22-group-10" loggedInAuthor={currentUser.user.uuid}/></li>))}
                    </ul>

                </div>
                }


            {showFollowers && 
                <div>
                    <ul>
                        {followers.map(follower => (<li key={follower.id}><FollowerCard follower={follower} 
                        posts={posts} setPosts={setPosts} /></li>))}
                    </ul>
                </div>
            }


        </div>
    )
}

/*<CreatePost loggedInAuthorId={profileId} loggedInAuthor={loggedInAuthor} loggedInAuthorFollowers={loggedInAuthorFollowers}/>*/
export default Profile;