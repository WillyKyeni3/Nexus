import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, isOwner, onDelete, showCreateButton }) => {
  const navigate = useNavigate();

  const getVoteStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'declined':
        return 'text-red-600';
      default:
        return 'text-orange-500';
    }
  };

  const handleTitleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <span className="author-name">{project.author_name || "Unknown"}</span>
        <span className={`vote-status ${project.vote_status?.toLowerCase() || "pending"}`}>
          {project.vote_status || "Pending"}
        </span>
      </div>
      
      <h3 
        onClick={handleTitleClick}
        className="project-title"
      >
        {project.title}
      </h3>
      
      <p className="project-description">{project.description}</p>
      <p className="project-date">
        Created: {new Date(project.created_at).toLocaleString()}
      </p>
      
      {isOwner && (
        <div className="card-actions">
          <button 
            onClick={() => navigate(`/projects/${project.id}/edit`)}
            className="btn-primary"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(project.id)}
            className="btn-destructive"
          >
            Delete
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}
      {showCreateButton && (
        <button 
          onClick={() => navigate("/projectform")}
          className="btn-accent"
        >
          Create Project
        </button>
      )}
    </div>
  );
};

export default ProjectCard;
