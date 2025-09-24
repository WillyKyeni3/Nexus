import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Api from "../Services/Api";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
  // Fetch project details
  Api.get(`/projects/${id}`)
    .then((res) => {
      setProject(res.data);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load project.");
      setLoading(false);
    });

  // Fetch vote history
  Api.get(`/projects/${id}/votes`)
    .then((res) => {
      setVotes(res.data.votes || []);   // ✅ pick array
      // optional: store statistics if you want to display them
      // setStats(res.data.statistics || {});
    })
    .catch(() => setVotes([]));
}, [id]);

  const handleEdit = () => {
    navigate(`/edit-project/${id}`);
  };

  const handleDelete = () => {
    setDeleteError(null);
    Api.delete(`/projects/${id}`)
      .then(() => navigate("/"))
      .catch(() => setDeleteError("Delete failed."));
  };

  const handleVote = (status) => {
  Api.post("/votes", { project_id: project.id, status }, { withCredentials: true })
    .then((res) => {
      setVotes((prev) => [...prev, res.data]);
    })
    .catch(() => alert("Failed to submit vote"));
};



  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div>Project not found.</div>;

  const isOwner = user && user.id === project.user_id;

  return (
    <div className="project-detail fade-in">
      <h2 className="project-title">{project.title}</h2>
      <p className="project-description">{project.description}</p>

      <div className="project-meta">
        <span>
          <strong>Created</strong>
          {new Date(project.created_at).toLocaleString()}
        </span>
        <span>
          <strong>Author</strong>
          {project.author_name || "Unknown"}
        </span>
        <span>
          <strong>Status</strong>
          <span className={`status-badge status-${project.status || 'pending'}`}>
            {project.status || "Pending"}
          </span>
        </span>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <div className="owner-actions">
          <button className="edit-btn" onClick={handleEdit}>
            <i className="fas fa-edit"></i> Edit Project
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            <i className="fas fa-trash"></i> Delete Project
          </button>
          {deleteError && <div className="error">{deleteError}</div>}
        </div>
      )}

      {/* Mentor controls */}
      {user && user.role === "mentor" && (
        <div className="mentor-actions">
          <button
            className="approve-btn"
            onClick={() => handleVote("approved")}
          >
            <i className="fas fa-check"></i> Approve
          </button>
          <button
            className="decline-btn"
            onClick={() => handleVote("declined")}
          >
            <i className="fas fa-times"></i> Decline
          </button>
        </div>
      )}

      {/* Vote history */}
      <div className="vote-history">
        <h3>Vote History</h3>
        {votes.length === 0 ? (
          <p className="no-votes">No votes yet.</p>
        ) : (
          <ul>
            {votes.map((v, idx) => (
              <li key={idx}>
                <span>{v.mentor_name || "Mentor"}</span>
                <span className={`status-badge status-${v.status}`}>
                  {v.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
