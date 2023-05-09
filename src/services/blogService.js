import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAllBlogs = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const createBlog = async (blogObj) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, blogObj, config);
  const response = await request;
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAllBlogs, createBlog, setToken };