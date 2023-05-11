const LoginForm = ({ handleLogin, username, password }) => {
  return (
    <>
      <div className="blogList">
        <form onSubmit={handleLogin}>
          <p>
            Username: <input type="text" onChange={username} />
          </p>
          <p>
            Password: <input type="password" onChange={password} />
          </p>
          <p>
            <button>Submit</button>
          </p>
        </form>
      </div>
    </>
  )
}
export default LoginForm
