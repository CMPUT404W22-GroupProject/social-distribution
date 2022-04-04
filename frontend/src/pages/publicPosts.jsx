import React, { useContext, useEffect } from 'react';
import Feed from '../components/feed/Feed';
import UserContext from '../context/userContext';
import {useParams} from 'react-router-dom';


function PublicPosts({feedType}){
    const {loggedIn} = useContext(UserContext);
    const params = useParams();

    return (
        <div>
            <Feed id = {JSON.stringify(params)} feedType = {feedType}/>
        </div>
    )
}

export default PublicPosts;
