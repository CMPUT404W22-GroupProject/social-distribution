import React, { useContext, useEffect } from 'react';
import Feed from '../components/feed/Feed';
import UserContext from '../context/userContext';
import {useParams} from 'react-router-dom';


function Home({feedType}){
    const {loggedIn} = useContext(UserContext);
    const params = useParams();

    return (
        <div>
            {console.log('home', loggedIn)}
            <Feed id = {JSON.stringify(params)} feedType = {feedType}/>
        </div>
    )
}

export default Home;
