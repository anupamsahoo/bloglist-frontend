import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogList from "./blogList"

test("renders content", () => {
  const blogs = [
    {
      id: "1234",
      title: "Component testing is done with react-testing-library",
      content: true,
      author: "Aashirya",
      blog_url:
        "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
      likes: 200,
      user: "aSDasdaSD",
    },
  ]
  const currentUser = { user: { user_id: "aSDasdaSD" } }

  const { container } = render(
    <BlogList blogs={blogs} currentUser={currentUser} />
  )
  //screen.debug()
  const element = screen.getByText(
    "Component testing is done with react-testing-library"
  )
  //screen.debug(element)
  expect(element).toBeDefined()
  const div = container.querySelector(".blogList")
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  )
})
test("clicking the button and check like and url", async () => {
  const blogs = [
    {
      id: "1234",
      title: "Component testing",
      content: "is done with react-testing-library",
      author: "Aashirya",
      blog_url:
        "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
      likes: 200,
      user: "aSDasdaSD",
    },
  ]
  const currentUser = { user: { user_id: "aSDasdaSD" } }

  //const mockHandler = jest.fn()

  const { container } = render(
    <BlogList blogs={blogs} currentUser={currentUser} />
  )

  const button = screen.getByText("Show Content")
  await userEvent.click(button)

  expect(container).toHaveTextContent(
    "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16"
  )

  expect(container).toHaveTextContent("200")
})

test("like button is clicked twice", async () => {
  const blogs = [
    {
      id: "1234",
      title: "Component testing",
      content: "is done with react-testing-library",
      author: "Aashirya",
      blog_url:
        "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
      likes: 200,
      user: "aSDasdaSD",
    },
  ]
  const currentUser = { user: { user_id: "aSDasdaSD" } }
  const handleLike = jest.fn()

  render(
    <BlogList blogs={blogs} currentUser={currentUser} likeBlog={handleLike} />
  )

  const viewContentButton = screen.getByText("Show Content")
  await userEvent.click(viewContentButton)

  const likeButton = screen.getByText("Like")
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(handleLike).toHaveBeenCalledTimes(2)
})
test("form calls the event handler it received as props with the right details", async () => {
  const blogs = [
    {
      id: "1234",
      title: "Component testing",
      content: "is done with react-testing-library",
      author: "Aashirya",
      blog_url:
        "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
      likes: 200,
      user: "aSDasdaSD",
    },
  ]
  const currentUser = { user: { user_id: "aSDasdaSD" } }
  const handleNewBlog = jest.fn()
  const user = userEvent.setup()
  render(
    <BlogList
      blogs={blogs}
      currentUser={currentUser}
      saveBlog={handleNewBlog}
    />
  )

  const title = screen.getByPlaceholderText("title")
  const content = screen.getByPlaceholderText("content")
  const blog_url = screen.getByPlaceholderText("blog_url")
  const createButton = screen.getByText("Save Blog")

  await user.type(title, "Component testing")
  await user.type(content, "is done with react-testing-library")
  await user.type(
    blog_url,
    "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16"
  )
  await user.click(createButton)

  expect(handleNewBlog.mock.calls).toHaveLength(1)
  expect(handleNewBlog.mock.calls[0][0].title).toBe("Component testing")
})
