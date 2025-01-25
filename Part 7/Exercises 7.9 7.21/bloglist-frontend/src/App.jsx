import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import login from './services/login'
import CreateBlogForm from "./components/CreateBlogForm"
import Toggable from "./components/Toggable"
import Notification from './components/Hello'
import { turnOnNotification } from './reducers/notificationReducer'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user,setUser] = useState(null)
  const [newBlog,setNewBlog] = useState({tittle:" ",author:" ",url:"" })
  const [errorMessage, setErrorMessage] = useState(null)
  const notification = useSelector(state => state.notification)
  const [notificationStatus,setNotificationStatus] = useState(notification) 
  const dispatch = useDispatch()
 
  useEffect(() => {
    blogService.getAll().then(blogs => blogs.sort((a,b)=>b.likes-a.likes)).then(blogs =>

      setBlogs( blogs )
    )  
  }, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
   
    }
  }, [])

  
  if(notification){
    setTimeout(() => {
      dispatch(turnOnNotification(false))
    }, 3000);
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const LoggedUser = await login.login({username,password})
      setUser(LoggedUser)
      window.localStorage.setItem(
      'loggedUser', JSON.stringify(LoggedUser)
    ) 
    } catch(exception){
      setErrorMessage('Wrong credentials')
     
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
    
    
  }

  const handleLogOUt = () =>{
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

 

  const sortBlogs = () =>{
    blogs.sort((a,b)=>a.likes-b.likes)
  }

  

  if(user == null){
    return (
      <div>
        <h2>Log into the application</h2>
        {errorMessage == "Wrong credentials" ? <p style={{color:'red'}}>Wrong crendentials</p> : ""}
        <form  onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  return (
    <>
      <Toggable buttonLabel="New blog">
      <CreateBlogForm ></CreateBlogForm>
      </Toggable>      
        
        <div>
          {notification && 
          <Notification styleViaProps={{borderColor:'green',border: 'solid',marginTop:'1%', backgroundColor:'rgb(255, 255, 128)'}} message={'New Anecdote Created'}></Notification> }
          <h2>blogs</h2>
          <button onClick={handleLogOUt}>log out</button>
          {blogs.map(blog =>
            <Blog key={blog._id} blog={blog} /> 
          )}
        </div>
    </>

  )
}

export default App