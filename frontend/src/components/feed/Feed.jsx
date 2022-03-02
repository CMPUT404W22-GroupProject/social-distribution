import "./feed.css"
import CreatePost from '../createPost/CreatePost'
import Post from '../Post'
import Follow from "../follow/follow"
import Like from '../like/like'
import { useEffect, useState } from "react";
import axios from "axios"

function Feed(){

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [recievedData, setRecievedData] = useState([]);
    const userId = 1;


    useEffect(() => {

        //if type is post, then put to post, if type is like then add to like and so on

        const fetchPosts = async () => {
            const result = await axios.get("/authors/1/posts");
            setRecievedData(result);
            setPosts(result.data.results);
        }

        fetchPosts();
        
    },[])

    return (

        <div>
        <CreatePost/>
        <Follow/>
        <Like/>
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