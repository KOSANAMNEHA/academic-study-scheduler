import React, { useEffect, useState } from "react";
import axios from "axios";

function Subjects() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.log("Error fetching subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/subjects", {
        name,
        hours
      });

      setName("");
      setHours("");
      fetchSubjects();
    } catch (err) {
      console.log("Error adding subject");
    }
  };

  return (
    <div>
      <h2>Subjects</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Study hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <br /><br />

        <button type="submit">Add Subject</button>
      </form>

      <br />

      <h3>Subjects List</h3>
      <ul>
        {subjects.map((subject) => (
          <li key={subject._id}>
            {subject.name} - {subject.hours} hours
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Subjects;
