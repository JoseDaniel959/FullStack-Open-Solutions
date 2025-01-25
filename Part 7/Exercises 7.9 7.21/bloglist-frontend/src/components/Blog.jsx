import { useState } from "react"
import blogs from "../services/blogs"
const Blog = ({ blog }) => {
  
  const [visible,setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const [blogLikes,setBlogLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const handleView = () =>{
    setVisible(!visible)
  }

  const addLike = ()=>{
    let auth = JSON.parse(window.localStorage.getItem('loggedUser')).token

    blog.likes = blog.likes +1 
    blogs.IncreaseLikes(blog._id,{newLikes:blog.likes},auth)
    
    setBlogLikes( blog.likes)
  }

  const removeblog = () =>{
    let auth = JSON.parse(window.localStorage.getItem('loggedUser')).token
    blogs.EliminateBlog(blog._id,auth)
  }
  
  return(
    <div style={blogStyle}>
       {blog.title} {blog.author} 
      <button onClick={handleView}>View</button>
      <div className="toggable" style={showWhenVisible}>
       <strong>url:</strong>{blog.url} 
       <strong>likes:</strong>{blogLikes} 
       <button onClick={addLike}>like</button>
        <div>
        <button onClick={handleView}>hide</button>  
        </div>
        <div>
        <button onClick={removeblog}>remove blog</button>  
        </div>
        
      </div>
    </div>   
  )
  
}

export default Blog