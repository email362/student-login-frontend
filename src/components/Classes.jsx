const Classes = ({selectedClass, setSelectedClass, classes, handleLogout}) => {
    return (
        <div>
            <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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