import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, isOwner, onDelete, showCreateButton }) => {
  const navigate = useNavigate();

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>
        <strong>Created:</strong> {new Date(project.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Author:</strong> {project.author_name || "Unknown"}
      </p>
      {isOwner && (
        <div className="card-actions">
            console.log("Navigating to", `/projects/${project.id}/edit`);
          {/* Navigate to edit page */}
          <button onClick={() => navigate(`/projects/${project.id}/edit`)}>Edit</button>
          <button onClick={() => onDelete(project.id)}>Delete</button>
          {/* Cancel just goes back */}
          <button onClick={() => navigate(-1)}>Cancel</button>
        </div>
      )}
      {showCreateButton && (
        <button onClick={() => navigate("/projectform")}>Create Project</button>
      )}
    </div>
  );
};

export default ProjectCard;
