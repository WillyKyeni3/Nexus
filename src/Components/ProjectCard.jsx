import React from "react";
import { useNavigate } from "react-router-dom";


const ProjectCard = ({ project, isOwner, onEdit, onDelete, showCreateButton }) => {
  const navigate = useNavigate();
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>
        <strong>Created:</strong> {new Date(project.date_created).toLocaleString()}
      </p>
      <p>
        <strong>Author:</strong> {project.author_name || "Unknown"}
      </p>
      {isOwner && (
        <div className="card-actions">
          <button onClick={() => onEdit(project.id)}>Edit</button>
          <button onClick={() => onDelete(project.id)}>Delete</button>
        </div>
      )}
      {showCreateButton && (
        <button onClick={() => navigate("/projectform")}>Create Project</button>
      )}
    </div>
  );
};

export default ProjectCard;
