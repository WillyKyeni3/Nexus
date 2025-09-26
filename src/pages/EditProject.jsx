// src/pages/EditProject.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Services/Api";

function EditProject() {
  const { id } = useParams(); // project id from URL
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch project details for editing
  useEffect(() => {
    Api.get(`/projects/${id}`)
      .then((res) => {
        setProject({
          title: res.data.title,
          description: res.data.description,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        setLoading(false);
      });
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = (e) => {
    e.preventDefault();
    Api.patch(`/projects/${id}`, project)
      .then(() => {
        navigate(`/projects/${id}`); // Go back to project detail after save
      })
      .catch((err) => {
        console.error("Error updating project:", err);
      });
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/projects/${id}`); // Go back without saving
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-project">
      <h2>Edit Project</h2>
      <form onSubmit={handleSave}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditProject;
