import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import PaginationControlled from '../../components/paginationFeed'
import CreatePost from '../../components/createPost/CreatePost';
import AvatarPhoto from '../../components/avatar/avatar'

function Profile({user}){
    
    const {id, setId} = useContext(UserContext); // current users id
    const [authorData, setAuthorData] = useState('')
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const params = useParams();
    const profileId = params.id.replace(":","")
    const [count, setCount] = useState(1);
    const [recievedData, setRecievedData] = useState([]);

    const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");


    const [loggedInAuthor, setLoggedInAuthor] = useState([]);
    const [loggedInAuthorFollowers, setLoggedInAuthorFollowers] = useState([]);

    useEffect(() => {
        fetchAuthor()    

        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                const result = await axios.get(URL10 + "/authors/" + profileId + "/posts", {
                    headers: {
                      'Authorization': 'Basic ' + team10Authorization
                    }});
                setRecievedData(result);
                setCount(result.data.count);
                console.log(result.data)
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.items.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            } else {
                const result = await axios.get(URL10 + "/authors/" + profileId + "/posts?page=" + page, {
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
    }, [page])



    async function fetchAuthor() {
        const res = await axios.get(URL10 + `/authors/${profileId}`, {
            headers: {
              'Authorization': 'Basic ' + team10Authorization
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

            {posts && 
                <ul>
                    {posts.map(post => (<li><Post post={post} team="cmput-404-w22-group-10" loggedInAuthor={profileId}/></li>))}
                </ul>
            }
        
        </div>
    )
}

/*<CreatePost loggedInAuthorId={profileId} loggedInAuthor={loggedInAuthor} loggedInAuthorFollowers={loggedInAuthorFollowers}/>*/
export default Profile;