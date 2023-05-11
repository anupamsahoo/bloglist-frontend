import { useEffect, useState, useRef } from "react"
import "./App.css"
import BlogList from "./component/blogList"
import blogService from "./services/blogService"
import LoginForm from "./component/loginForm"
import loginService from "./services/loginService"
import Togglable from "./component/togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [updatedBlogs, setUpdatedBlogs] = useState([])

  const getUpdatedBlogs = updatedBlogs.length > 0 ? updatedBlogs : blogs

  const [notifyMsg, setNotifyMsg] = useState([
    {
      message: null,
      messageClass: null,
    },
  ])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const loginFormRef = useRef()

  const Notification = () => {
    if (notifyMsg.message === null) {
      return null
    }
    return <div className={notifyMsg.messageClass}>{notifyMsg.message}</div>
  }

  useEffect(() => {
    blogService.getAllBlogs().then((blogs) => {
      console.log("fireing it: ", blogs)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("Form Input: ", username, password)
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setNotifyMsg({
        message: "Wrong credentials",
        messageClass: "error",
      })
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: "error" })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
  }

  const saveBlog = async (blogObj) => {
    try {
      const newBlog = await blogService.createBlog(blogObj)
      console.log(newBlog)
      setUpdatedBlogs(getUpdatedBlogs.concat(newBlog))

      setNotifyMsg({
        message: `A new Blog "${newBlog.title}" --- Created Successfully`,
        messageClass: "success",
      })
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: null })
      }, 5000)
    } catch (exception) {
      setNotifyMsg({
        message: "Something went wrong",
        messageClass: "error",
      })
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: null })
      }, 5000)
    }
  }

  const likeBlog = async (blogId) => {
    const updatedBlog = [...getUpdatedBlogs].find((item) => item.id === blogId)
    const blogObj = { ...updatedBlog, likes: updatedBlog.likes + 1 }
    console.log("New Blog: ", blogObj)
    const updateLike = await blogService.increaseLike(blogObj, blogId)
    console.log(updateLike)
    setUpdatedBlogs(
      [...getUpdatedBlogs].map((n) => (n.id !== blogId ? n : updateLike))
    )
  }

  const sortBlogAsc = () => {
    const sortIt = [...getUpdatedBlogs].sort((a, b) => a.likes - b.likes)
    //console.log(sortIt);
    setUpdatedBlogs(sortIt)
  }
  const sortBlogDesc = () => {
    const sortIt = [...getUpdatedBlogs].sort((a, b) => b.likes - a.likes)
    //console.log(sortIt);
    setUpdatedBlogs(sortIt)
  }
  const resetBlog = () => {
    setUpdatedBlogs([])
    console.log(blogs)
    //setUpdatedBlogs(blogs);
    //console.log(getUpdatedBlogs);
  }
  const deleteBlog = async (id) => {
    console.log(id)
    try {
      await blogService.remobeBlog(id)
      const blogListUpdate = getUpdatedBlogs.filter((item) => item.id !== id)
      setUpdatedBlogs(blogListUpdate)
      setNotifyMsg({
        message: `Blog "${id}" Deleted`,
        messageClass: "success",
      })
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: null })
      }, 5000)
    } catch (exception) {
      setNotifyMsg({
        message: "Something went wrong on server",
        messageClass: "error",
      })
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: null })
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <Togglable
        buttonLabelShow="Show Login Form"
        buttonLabelHide="Hide Login Form"
        ref={loginFormRef}
      >
        <LoginForm
          handleLogin={handleLogin}
          username={({ target }) => setUsername(target.value)}
          password={({ target }) => setPassword(target.value)}
        />
      </Togglable>
    </>
  )
  const blogsList = () => (
    <>
      <BlogList
        blogs={getUpdatedBlogs}
        saveBlog={saveBlog}
        likeBlog={likeBlog}
        sortBlogAsc={sortBlogAsc}
        sortBlogDesc={sortBlogDesc}
        resetBlog={resetBlog}
        deleteBlog={deleteBlog}
        currentUser={user}
      />
    </>
  )

  return (
    <>
      <h1>Welcome To Blog List</h1>
      <Notification />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          {blogsList()}
        </div>
      )}
    </>
  )
}

export default App
