import { useEffect, useState } from "react";
import "./App.css";
import BlogList from "./component/blogList";
import blogService from "./services/blogService";
import LoginForm from "./component/loginForm";
import loginService from "./services/loginService";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notifyMsg, setNotifyMsg] = useState([
    {
      message: null,
      messageClass: null,
    },
  ]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const Notification = () => {
    if (notifyMsg.message === null) {
      return null;
    }
    return <div className={notifyMsg.messageClass}>{notifyMsg.message}</div>;
  };

  useEffect(() => {
    blogService.getAllBlogs().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Form Input: ", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotifyMsg({
        message: "Wrong credentials",
        messageClass: "error",
      });
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: "error" });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const saveBlog = async (event) => {
    event.preventDefault();
    console.log("Blog Title: ", blogTitle);
    console.log("Blog Content: ", blogContent);
    console.log("Blog Url: ", blogUrl);
    const blogObj = {
      title: blogTitle,
      content: blogContent,
      author: "Anupam Sahoo",
      blog_url: blogUrl,
    };
    try {
      const newBlog = await blogService.createBlog(blogObj);
      console.log(newBlog);
      setBlogs(blogs.concat(newBlog));
      setBlogTitle("");
      setBlogContent("");
      setBlogUrl("");
      setNotifyMsg({
        message: `A new Blog "${newBlog.title}" --- Created Successfully`,
        messageClass: "success",
      });
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: null });
      }, 5000);
    } catch (exception) {
      setNotifyMsg({
        message: "Something went wrong",
        messageClass: "error",
      });
      setTimeout(() => {
        setNotifyMsg({ message: null, messageClass: null });
      }, 5000);
    }
  };

  const loginForm = () => (
    <>
      <LoginForm
        handleLogin={handleLogin}
        username={({ target }) => setUsername(target.value)}
        password={({ target }) => setPassword(target.value)}
      />
    </>
  );
  const blogsList = () => (
    <>
      <BlogList
        blogs={blogs}
        saveBlog={saveBlog}
        blogTitle={({ target }) => setBlogTitle(target.value)}
        titleValue={blogTitle}
        blogContent={({ target }) => setBlogContent(target.value)}
        contentValue={blogContent}
        blogUrl={({ target }) => setBlogUrl(target.value)}
        urlValue={blogUrl}
      />
    </>
  );

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
  );
};

export default App;
