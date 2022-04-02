import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import PaginationControlled from '../../components/paginationFeed'
import CreatePost from '../../components/createPost/CreatePost';



//Components
import AvatarPhoto from '../../components/avatar/avatar'
import FollowerList from '../../components/followerList/followerList';



function Profile(){
    
    const {id, setId} = useContext(UserContext); // current users id
    const [authorData, setAuthorData] = useState('')
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const params = useParams();
    const profileId = params.id.replace(":","")
    console.log("PROFILE", profileId)
    const [count, setCount] = useState(1);
    const [recievedData, setRecievedData] = useState([]);

    const location = useLocation()

    console.log(location.state)

    const user = JSON.parse(location.state.state)
    console.log('USER', user)
    
    const [showFollowers, setShowFollowers] = useState(false)
    

    const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
<<<<<<< HEAD
=======
    const team10token = JSON.parse(localStorage.getItem('user')).token
    const [loggedInAuthor, setLoggedInAuthor] = useState([]);
    const [loggedInAuthorFollowers, setLoggedInAuthorFollowers] = useState([]);

>>>>>>> a4d3d84473d07ad59a8aa16266d36289c9c71781
    useEffect(() => {

        

        fetchAuthor()    

        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                const result = await axios.get(URL10 + "/authors/" + profileId + "/posts", {
                    headers: {
                      'Authorization': 'token ' + team10token
                      //'Authorization': 'Basic ' + team10Authorization
                    }});
                setRecievedData(result);
                setCount(result.data.count);
                console.log("RESULTS",result.data)
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.items.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));

            } else {


                const result = await axios.get(URL10 + "/authors/" + profileId + "/posts?page=" + page, {
                    headers: {
                      'Authorization': 'token ' + team10token
                      //'Authorization': 'Basic ' + team10Authorization
                    }});
                setCount(result.data.count);
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }}
        fetchPosts()
    }, [page, profileId, showFollowers])



    async function fetchAuthor() {
        const res = await axios.get(URL10 + `/authors/${profileId}`, {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }});
        setAuthorData(res.data)
    }

    const handleCallBack = (childData) => {
        //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
        setPage(childData);
    }
    
    return (
        <div>
            <AvatarPhoto id={profileId}/>
            <h2>{authorData.displayName}</h2>

            <PaginationControlled count = {count} parentCallBack = {handleCallBack}/>

            {showFollowers && 
                <div>
                    <button onClick={(e) => setShowFollowers(true)}>Followers</button>
                    <ul>
                        {posts.map(post => (<li><Post post={post} team="cmput-404-w22-group-10" loggedInAuthor={profileId}/></li>))}
                    </ul>

                </div>
                }
            {showFollowers && 

            <div>
                <button onClick={(e) => setShowFollowers(false)}>Posts</button>
                <FollowerList profileId={profileId}/>
            </div>
            }
        </div>
    )
}

/*<CreatePost loggedInAuthorId={profileId} loggedInAuthor={loggedInAuthor} loggedInAuthorFollowers={loggedInAuthorFollowers}/>*/
export default Profile;