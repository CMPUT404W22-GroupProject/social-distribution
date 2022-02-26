import React, {useContext, useEffect, useState} from 'react' ;
import {useSelector} from 'react-redux';
import  {selectUser} from '../../features/userSlice';
import axios from 'axios';

function Profile(){

    const user = useSelector(selectUser);

    const [userData, setUserData] = useState({user: []})
    

    useEffect(async () => {
        const result = await axios.get(`http://localhost:3000/authors/1/`);

        setUserData(result.data)

        console.log(userData)
    }, [])

    return (
        <div>
           <h1>{user.email}</h1>
           <h1>{user.id}</h1>
        </div>
    )
}

export default Profile;