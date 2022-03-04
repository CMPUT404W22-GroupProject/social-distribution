/*
try{
    axios({
      method: 'post',
      url: `http://127.0.0.1:8000/authors/${id}/posts/`,
      data: {
        "type": "post",
        "title": `title`,
        "source": "",
        "origin": "",
        "description": "description",
        "contentType": "text/plain",
        "content": `${postBody}`,
        "author": `${id}`,
        "categories": "catagories",
        "count": 0,
        "commentsSrc": {},
        "published": "2022-03-04T06:56:48Z",
        "visibility": "PUBLIC",
        "unlisted": false
      }
    }).then((res)=> {
      console.log(res)
    })
  }catch(err){
    console.log(err)
  }

*/
