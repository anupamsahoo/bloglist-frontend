import { useState, useRef } from "react"
import Togglable from "./togglable"

//import PropTypes from "prop-types"

const BlogList = (props) => {
  const [blogTitle, setBlogTitle] = useState("")
  const [blogContent, setBlogContent] = useState("")
  const [blogUrl, setBlogUrl] = useState("")
  const blogformRef = useRef()
  const blogContentRef = useRef()

  const createBlog = async (event) => {
    event.preventDefault()
    console.log("Blog Title: ", blogTitle)
    console.log("Blog Content: ", blogContent)
    console.log("Blog Url: ", blogUrl)
    const blogObj = {
      title: blogTitle,
      content: blogContent,
      author: "Anupam Sahoo",
      blog_url: blogUrl,
    }
    props.saveBlog(blogObj)
    setBlogTitle("")
    setBlogContent("")
    setBlogUrl("")
    blogformRef.current.toggleVisibility()
  }

  const deleteBlog = (item) => {
    if (
      window.confirm(
        `Remove blog You're not gonna need it! by ${item.author} and ID: ${item.id}`
      )
    ) {
      props.deleteBlog(item.id)
    }
  }

  return (
    <>
      <Togglable
        buttonLabelShow="Create New Blog"
        buttonLabelHide="Hide Hide Form"
        ref={blogformRef}
      >
        <h2>Create New Blog</h2>
        <form onSubmit={createBlog}>
          <p>
            Title:
            <br />
            <input
              type="text"
              onChange={(event) => setBlogTitle(event.target.value)}
              value={blogTitle}
              placeholder="title"
              id="blogTitle"
            />
          </p>
          <p>
            Content:
            <br />
            <textarea
              onChange={(event) => setBlogContent(event.target.value)}
              value={blogContent}
              placeholder="content"
              id="blogContent"
            />
          </p>
          <p>
            Url:
            <br />
            <input
              type="text"
              onChange={(event) => setBlogUrl(event.target.value)}
              value={blogUrl}
              placeholder="blog_url"
              id="blogUrl"
            />
          </p>
          <p>
            <button className="createBlog" id="createBlog" role="button">
              Save Blog
            </button>
          </p>
        </form>
      </Togglable>
      <h2>Blog List</h2>
      <button onClick={() => props.sortBlogAsc()}>Sort ASC Blog</button>
      <button onClick={() => props.sortBlogDesc()}>Sort DESC Blog</button>
      <button onClick={() => props.resetBlog()}>Reset Sort</button>
      {props.blogs.map((blog) => {
        const itemUserName = blog.username ? blog.username : blog.user.username
        return (
          <div className="blogList" key={blog.id}>
            <h3>{blog.title}</h3>
            <Togglable
              buttonLabelShow="Show Content"
              buttonLabelHide="Hide Content"
              ref={blogContentRef}
            >
              <p>{blog.content}</p>
              <p>
                <strong>Author:</strong> {blog.author}, <strong>URL:</strong>
                <span className="blogUrl">{blog.blog_url}</span>
                <br />
                <strong>Likes:</strong>{" "}
                <span className="blogLikes" id="likesCount">
                  {blog.likes}
                </span>
                ,
                <button id="likeButton" onClick={() => props.likeBlog(blog.id)}>
                  Like
                </button>
              </p>
              {itemUserName === props.currentUser.username ? (
                <button id="deleteBlog" onClick={() => deleteBlog(blog)}>
                  Delete This Blog
                </button>
              ) : null}
            </Togglable>
          </div>
        )
      })}
    </>
  )
}

/* BlogList.propTypes = {
  saveBlog: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  sortBlogAsc: PropTypes.func.isRequired,
  sortBlogDesc: PropTypes.func.isRequired,
  resetBlog: PropTypes.func.isRequired,
} */

export default BlogList
