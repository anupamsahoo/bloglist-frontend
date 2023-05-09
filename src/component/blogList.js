const BlogList = ({
  blogs,
  saveBlog,
  blogTitle,
  blogContent,
  blogUrl,
  titleValue,
  contentValue,
  urlValue,
}) => {
  return (
    <>
      <h2>Create New Blog</h2>
      <form onSubmit={saveBlog}>
        <p>
          Title:
          <br />
          <input type="text" onChange={blogTitle} value={titleValue} />
        </p>
        <p>
          Content:
          <br />
          <textarea onChange={blogContent} value={contentValue} />
        </p>
        <p>
          Url:
          <br />
          <input type="text" onChange={blogUrl} value={urlValue} />
        </p>
        <p>
          <button>Save Blog</button>
        </p>
      </form>
      <h2>Blog List</h2>
      {blogs.map((item, i) => (
        <div className="blogList" key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <p>
            <strong>Author:</strong> {item.author}, <strong>URL: </strong>
            {item.blog_url}, <strong>Likes:</strong> {item.likes},
          </p>
        </div>
      ))}
    </>
  );
};
export default BlogList;
