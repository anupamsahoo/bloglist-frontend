const LoginForm = ({ handleLogin, username, password }) => {
  return (
    <>
      <div className="blogList">
        <form onSubmit={handleLogin}>
          <p>
            Username: <input type="text" id="username" onChange={username} />
          </p>
          <p>
            Password:{" "}
            <input type="password" id="password" onChange={password} />
          </p>
          <p>
            <button id="loginButton">Submit</button>
          </p>
        </form>
      </div>
    </>
  )
}
export default LoginForm
