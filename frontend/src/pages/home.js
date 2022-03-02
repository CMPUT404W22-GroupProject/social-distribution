import React, { useContext, useEffect, useState } from 'react' 
import Feed from '../components/feed/Feed'
import UserContext from '../context/userContext';
import axios from "axios"
import Post from '../components/Post';


function Home(){

    const {id, setId} = useContext(UserContext);
    const [authorData, setAuthorData] = useState('')

    useEffect(() => {
        fetchAuthor()
        fetchPosts()
    }, [null])


    async function fetchAuthor() {
        const res = await axios.get('authors/3');
        setAuthorData(res.data)
    }

    async function fetchPosts(){
        const res = await axios.get('authors/3/posts')
        console.log(res.data)
    }

    return (
        <div>
            <h1>{authorData.displayName}</h1>
            <h1>{authorData.host}</h1>
            <Post/>
            <Post/>
            <Post/>
            <Post/>

        </div>
    )
}

export default Home;

