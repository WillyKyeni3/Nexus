import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); // go back
  };

  return (
    <div className="edit-project">
      <h2>Edit Project {id}</h2>
      {/* Your edit form goes here */}
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default EditProject;
