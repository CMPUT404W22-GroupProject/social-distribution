import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import PaginationControlled from '../../components/paginationFeed'
import CreatePost from '../../components/createPost/CreatePost';

function Profile({user}){
    
    const {id, setId} = useContext(UserContext); // current users id
    const [authorData, setAuthorData] = useState('')
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const params = useParams();
    const profileId = params.id.replace(":","")
    const [count, setCount] = useState(1);
    const [recievedData, setRecievedData] = useState([]);

    useEffect(() => {
        fetchAuthor()    

        const fetchPosts = async () => {
            //fetch posts from user/author id, these are posts created by the user/author
            if (page === 1){
                const result = await axios.get("/authors/" + profileId + "/posts");
                setRecievedData(result);
                setCount(result.data.count);
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            } else {
                const result = await axios.get("/authors/" + profileId + "/posts?page=" + page);
                setCount(result.data.count);
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }}
        fetchPosts()
    }, [page])

    /*
    function getPosts (cursor, data){
        return axios.get(cursor)
            .then(response => {
                if(response.data.next == null){
                    console.log("data", response.data)
                    
                    return data
                }
                data.push(response.data.results)
                return getPosts(response.data.next, data)
            })
    }*/

    async function fetchAuthor() {
        const res = await axios.get(`http://127.0.0.1:8000/authors/${params.id}`);
        setAuthorData(res.data)
    }

    async function fetchPosts(){
        const next = null
        axios.get(`http://127.0.0.1:8000/authors/${params.id}/posts`).then((res) => {
            setPosts(res.data.results)
            setPage(res.data.next)

        });
    }
    
    const handleCallBack = (childData) => {
        //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
        setPage(childData);
    }
    
    return (
        <div>
            <h1>{authorData.displayName}</h1>
            {id == profileId ? <CreatePost/> : null}

            <PaginationControlled count = {count} parentCallBack = {handleCallBack}/>

            {posts && 
                <ul>
                    {posts.map(post => (<li><Post post={post}/></li>))}
                </ul>
            }
        
        </div>
    )
}

/*
<h1>{authorData.displayName}</h1>
{posts && 
    <ul>
        {posts.map(post => (<li><Post post={post}/></li>))}
    </ul>

        {posts && 
                <ul>
                    {posts.map(post => (<li><Post post={post}/></li>))}
                </ul>
            }
}
*/

export default Profile;