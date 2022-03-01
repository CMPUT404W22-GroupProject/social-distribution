import "./feed.css"
import CreatePost from '../createPost/CreatePost'
import Post from '../Post'
import { useEffect, useState } from "react";
import axios from "axios"

function Feed(){

    const [posts, setPosts] = useState([]);
    const [recievedData, setRecievedData] = useState([]);
    const userId = 1;


    useEffect(() => {

        const fetchPosts = async () => {
            const result = await axios.get("authors/1/posts");
            setRecievedData(result);
            setPosts(result.data.results);
        }

        fetchPosts();
        
    },[])

    return (

        <div>
        <CreatePost/>
        {posts.map((post) => (
            <Post key = {post.id} post = {post}/>
        ))}
        
        {/* <Post/>
        <Post/>
        <Post/>
        <Post/>
        <Post/>
        <Post/> */}



        </div>
    )

}

export default Feed;