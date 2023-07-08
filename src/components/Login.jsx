const Login = ({handleGetStudent, studentId, setStudentId}) => {

    return (
        <div>
            <h1>Student Login</h1>
            <label htmlFor="studentId">Student ID</label>
            <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            />
            <button onClick={handleGetStudent}>Login</button>
        </div>  
    )
}

export default Login;