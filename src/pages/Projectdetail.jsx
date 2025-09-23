


import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Api from "../Services/Api";



function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        Api.get(`/projects/${id}`)
            .then((res) => {
                setProject(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load project.");
                setLoading(false);
            });
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!project) return <div>Project not found.</div>;

    const isOwner = user && user.id === project.user_id;

    return (
        <div className="project-detail styled-card">
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
                <span><strong>Created:</strong> {new Date(project.date_created).toLocaleString()}</span>
                <span><strong>Author:</strong> {project.author_name || "Unknown"}</span>
                <span><strong>Status:</strong> {project.status || "Pending"}</span>
            </div>
            {isOwner && (
                <div className="owner-actions">
                    <button className="edit-btn" onClick={handleEdit}>Edit</button>
                    <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    {deleteError && <div className="error">{deleteError}</div>}
                </div>
            )}
            {/* Mentor controls for approving/declining project */}
            {user && user.role === "mentor" && (
                <div className="mentor-actions">
                    <button className="approve-btn" onClick={() => Api.patch(`/projects/${id}`, { status: "approved" }).then(() => setProject({ ...project, status: "approved" }))}>Approve</button>
                    <button className="decline-btn" onClick={() => Api.patch(`/projects/${id}`, { status: "declined" }).then(() => setProject({ ...project, status: "declined" }))}>Decline</button>
                </div>
            )}
        </div>
    );
}

export default ProjectDetail;