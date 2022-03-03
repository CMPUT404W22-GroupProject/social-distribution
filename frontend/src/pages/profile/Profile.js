import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'


function Profile(){

    const {id, setId} = useContext(UserContext);
    const [authorData, setAuthorData] = useState('')

    useEffect(() => {
        fetchAuthor()
    }, [null])


    async function fetchAuthor() {
        const res = await axios.get('authors/2');
        setAuthorData(res.data)
    }

    async function fetchPosts(){
        const res = await axios.get('authors/2/posts')
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

export default Profile;
