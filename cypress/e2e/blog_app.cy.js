describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`)
    const user = {
      name: "Anupam Sahoo",
      username: "anupam",
      password: "12345",
    }
    const user2 = {
      name: "Mithu",
      username: "mithu",
      password: "12345",
    }
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user)
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user2)
    cy.visit("")
  })
  it("Login form is shown", function () {
    cy.contains("Show Login Form").click()
  })
  it("succeeds with correct credentials", function () {
    cy.contains("Show Login Form").click()
    cy.get("#username").type("anupam")
    cy.get("#password").type("12345")
    cy.get("#loginButton").click()
    cy.contains("Anupam Sahoo logged in")
  })
  it("fails with wrong credentials", function () {
    cy.contains("Show Login Form").click()
    cy.get("#username").type("anupam")
    cy.get("#password").type("1234")
    cy.get("#loginButton").click()
    //cy.login({ username: "mluukkai", password: "salainen" })
    cy.get(".error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid")
  })
  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "anupam", password: "12345" })
    })

    it("A blog can be created", function () {
      cy.contains("Create New Blog").click()
      cy.get("#blogTitle").type("100+ Instructors Available For You!")
      cy.get("#blogContent").type(
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more."
      )
      cy.get("#blogUrl").type("https://hwa.zmotpro.com/experts/")
      cy.get("#createBlog").click()

      cy.contains("100+ Instructors Available For You!")
    })
    describe("savarel blogs exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "The meeting with the client is scheduled",
          content:
            "Practice the guitar chords for at least 30 minutes every day to improve your skills.",
          author: "Anupam Sahoo",
          blog_url: "http://anupamsahoo.com/blogs/1",
          likes: 3,
        })
        cy.createBlog({
          title: "The meeting with the client is scheduled 2",
          content:
            "Make a to-do list for the weekend: clean the house, do the laundry, and organize your closet.",
          author: "Anupam Sahoo",
          blog_url: "http://anupamsahoo.com/blogs/2",
          likes: 2,
        })
        cy.createBlog({
          title: "The meeting with the client is scheduled 3",
          content:
            "Check the oil level and tire pressure in your car before going on a long trip.",
          author: "Anupam Sahoo",
          blog_url: "http://anupamsahoo.com/blogs/1",
          likes: 1,
        })
      })
      it("confirms users can like a blog", function () {
        cy.contains("The meeting with the client is scheduled")
          .parent()
          .contains("Show Content")
          .click()
        cy.get("#likeButton").click()
        cy.get("#likesCount").should("contain", 4)
      })
      it("user who created a blog can delete it", function () {
        cy.contains("The meeting with the client is scheduled")
          .parent()
          .contains("Show Content")
          .click()
        cy.get("#deleteBlog").click()
      })
      it("only the creator can see the delete button of a blog", function () {
        cy.login({ username: "mithu", password: "12345" })
        cy.contains("The meeting with the client is scheduled 2")
          .parent()
          .contains("Show Content")
          .click()
        cy.get("#deleteBlog").should("not.exist")
      })
      it("blogs are ordered according to likes", function () {
        cy.get(".blogList")
          .eq(0)
          .should("contain", "The meeting with the client is scheduled")
        cy.get(".blogList")
          .eq(1)
          .should("contain", "The meeting with the client is scheduled 2")
        cy.get(".blogList")
          .eq(2)
          .should("contain", "The meeting with the client is scheduled 3")
      })
    })
  })
})
