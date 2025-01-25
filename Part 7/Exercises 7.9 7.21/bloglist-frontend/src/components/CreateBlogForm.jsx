import { useState } from "react"
import { turnOnNotification } from "../reducers/notificationReducer.js"
import { useDispatch } from "react-redux"
import blogService from "../services/blogs.js"
import App from "../App.jsx"
const CreateBlogForm = (props) =>{
    const [newBlog,setNewBlog] = useState({tittle:" ",author:" ",url:"" })
    const dispatch = useDispatch()
    const handleNewBlog = async () =>{
      event.preventDefault()
      let auth = JSON.parse(window.localStorage.getItem( 'loggedUser')).token
      const CreatedBlog = await blogService.CreateBlog({...newBlog,likes:0},auth)
      setNewBlog({tittle:" ",author:" ",url:"" })
      //CreatedBlog != null ? setErrorMessage("new blog created") : setErrorMessage(null)
      console.log(CreatedBlog)
      dispatch(turnOnNotification(true))
    }
    
    return(
        <>
        <h1>Create blog</h1>
       
        <div>
        <form onSubmit={handleNewBlog}>
          <div>
          title
                  <input
                  type="text"
                  value={newBlog.tittle}
                  name="tittle"
                  onChange={( event ) => setNewBlog({...newBlog,tittle:event.target.value})}
                />
          </div>
          <div>
          author
                  <input
                  type="text"
                  value={newBlog.author}
                  name="tittle"
                  onChange={( event ) => setNewBlog({...newBlog,author:event.target.value})}
                />
          </div>
          <div>
          url
                  <input
                  type="text"
                  value={newBlog.url}
                  name="tittle"
                  onChange={( event ) => setNewBlog({...newBlog,url:event.target.value})}
                />
          </div>
          <button type="submit">Create</button>
        </form>
        </div>
        </>
    )
}

export default CreateBlogForm