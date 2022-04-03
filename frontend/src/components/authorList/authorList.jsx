import React, { useState } from 'react'

function AuthorsList({host}) {

  const [showLocalAuthors, setShowLocalAuthors] = useState(false) 
  const [showRemoteAuthors, setShowRemoteAuthors] = useState(false) 

  const URL0 = "http://tik-tak-toe-cmput404.herokuapp.com/authors/"
  const URL4 = "http://backend-404.herokuapp.com"
  const URL9 = "https://cmput-404-w22-project-group09.herokuapp.com/service"
  const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
  const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
  const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
  const team9Authorization = btoa("group10:pwd1010");
  const team4Authorization = btoa("Team10:abcdefg");


  return (
    <div>
        <ul>
            <button>Local Authors</button>
            <button>Remote Authors</button>           
        </ul>


        <ul>

        </ul>

    </div>
  )
}

export default AuthorsList