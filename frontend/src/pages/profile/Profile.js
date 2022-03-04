import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';

import CreatePost from '../../components/createPost/CreatePost';

function Profile({user}){
    
    const {id, setId} = useContext(UserContext); // current users id
    const [authorData, setAuthorData] = useState('')
    const [posts, setPosts] = useState([]);
    const [pages, setPage] = useState()
    const params = useParams();
    const profileId = params.id.replace(":","")

    useEffect(() => {
        fetchAuthor()
        fetchPosts()
        //getPosts(`http://127.0.0.1:8000/authors/${profileId}/posts`, data).then(data => console.log(data[0]))
        
    }, [])

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
        const res = await axios.get(`http://127.0.0.1:8000/authors/${profileId}`);
        setAuthorData(res.data)
    }

    async function fetchPosts(){
        const next = null
        axios.get(`http://127.0.0.1:8000/authors/${profileId}/posts`).then((res) => {
            setPosts(res.data.results)
            setPage(res.data.next)

        });
    }
    
    
    return (
        <div>
            <h1>{authorData.displayName}</h1>
            {id == profileId ? <CreatePost/> : null}
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