const Classes = ({selectedClass, setSelectedClass, classes, handleLogin, handleLogout}) => {
    const onClassChange = (e) => {
        // console.log(e.target.value);
        const updatedClass = e.target.value;
        setSelectedClass(updatedClass);
        handleLogin(updatedClass);
    };

    return (
        <div>
            <select
            value={selectedClass}
            onChange={onClassChange}
            >
            <option value="">Select a class</option>
            {classes.map((cls) => (
                <option key={cls} value={cls}>
                {cls}
                </option>
            ))}
            </select>
            {selectedClass && (
            <button onClick={handleLogout}>Logout</button>
            )}
      </div>
    );
};

export default Classes;