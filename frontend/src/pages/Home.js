import React, { useContext, useEffect } from 'react' 
import Feed from '../components/feed/Feed'
import UserContext from '../context/userContext'


function Home(){
    const {loggedIn} = useContext(UserContext)

    return (
        <div>
            {console.log('home', loggedIn)}
            <Feed/>
        </div>
    )
}

export default Home;
