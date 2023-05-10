import { useState, useRef } from "react";
import Togglable from "./togglable";
const BlogList = (props) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const blogformRef = useRef();
  const blogContentRef = useRef();
  const createBlog = async (event) => {
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
    props.saveBlog(blogObj);
    setBlogTitle("");
    setBlogContent("");
    setBlogUrl("");
    blogformRef.current.toggleVisibility();
  };

  const deleteBlog = (item) => {
    if (
      window.confirm(
        `Remove blog You're not gonna need it! by ${item.author} and ID: ${item.id}`
      )
    ) {
      props.deleteBlog(item.id);
    }
  };

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
            />
          </p>
          <p>
            Content:
            <br />
            <textarea
              onChange={(event) => setBlogContent(event.target.value)}
              value={blogContent}
            />
          </p>
          <p>
            Url:
            <br />
            <input
              type="text"
              onChange={(event) => setBlogUrl(event.target.value)}
              value={blogUrl}
            />
          </p>
          <p>
            <button>Save Blog</button>
          </p>
        </form>
      </Togglable>
      <h2>Blog List</h2>
      <button onClick={() => props.sortBlogAsc()}>Sort ASC Blog</button>
      <button onClick={() => props.sortBlogDesc()}>Sort DESC Blog</button>
      <button onClick={() => props.resetBlog()}>Reset Sort</button>
      {props.blogs.map((item, i) => (
        <div className="blogList" key={item.id}>
          <h3>{item.title}</h3>
          <Togglable
            buttonLabelShow="Show Content"
            buttonLabelHide="Hide Content"
            ref={blogContentRef}
          >
            <p>{item.content}</p>
            <p>
              <strong>Author:</strong> {item.author}, <strong>URL: </strong>
              {item.blog_url}
              <br />
              <strong>Likes:</strong> {item.likes},{" "}
              <button onClick={() => props.likeBlog(item.id)}>Like</button>
            </p>
            {item.user.id === props.currentUser.user_id ? (
              <button onClick={() => deleteBlog(item)}>Delete This Blog</button>
            ) : null}
          </Togglable>
        </div>
      ))}
    </>
  );
};
export default BlogList;
