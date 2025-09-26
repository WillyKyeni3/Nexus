import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Api from "../Services/Api";
import { useNavigate } from "react-router-dom";   // ✅ added

function Profile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();   // ✅ added

    useEffect(() => {
        if (user) {
            Api.get(`/users/${user.id}`)
                .then((res) => {
                    setProfile(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load profile");
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) return <div>Please log in to view your profile.</div>;
    if (loading) return <div>Loading profile...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="profile-container fade-in">
            <div className="profile-header">
                <h2>Profile</h2>
            </div>
            
            <div className="profile-info">
                <div className="info-group">
                    <label className="info-label">Username</label>
                    <div className="info-value">{profile.username}</div>
                </div>
                <div className="info-group">
                    <label className="info-label">Email</label>
                    <div className="info-value">{profile.email}</div>
                </div>
                <div className="info-group">
                    <label className="info-label">Role</label>
                    <div className="info-value">{profile.role}</div>
                </div>
                <div className="info-group">
                    <label className="info-label">Cohort</label>
                    <div className="info-value">
                        {profile.cohort
                            ? typeof profile.cohort === "object"
                                ? profile.cohort.name
                                : profile.cohort
                            : "N/A"}
                    </div>
                </div>
            </div>
            
            <div className="profile-section">
                <h3>My Projects</h3>
                {profile.projects.length === 0 ? (
                    <div className="no-projects">No projects found.</div>
                ) : (
                    <div className="projects-grid">
                        {profile.projects.map((p) => (
                            <div 
                                key={p.id} 
                                className="project-card"
                                onClick={() => navigate(`/projects/${p.id}`)}   // ✅ navigate to ProjectDetail
                                style={{ cursor: "pointer" }}   // ✅ make it clickable
                            >
                                <h3>{p.title}</h3>
                                <div className="project-meta">
                                    <span className={`status-badge status-${p.status}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
