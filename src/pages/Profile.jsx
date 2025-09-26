// profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Api from "../Services/Api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [votedProjects, setVotedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      Promise.all([
        Api.get(`/users/${user.id}`),
        user.role === "mentor" ? Api.get("/votes/mentor") : Promise.resolve({ data: [] })
      ])
        .then(([profileRes, votesRes]) => {
          setProfile(profileRes.data);
          setVotedProjects(votesRes.data || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile data");
          setLoading(false);
        });
    }
  }, [user]);

  const handleVoteChange = async (projectId, newStatus) => {
    try {
      await Api.post("/votes", {
        project_id: projectId,
        status: newStatus,
      });

      // ✅ Update the local state immediately
      setVotedProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, vote_status: newStatus } : p
        )
      );
    } catch (err) {
      console.error("Failed to update vote", err);
      alert("Could not update vote.");
    }
  };

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

        {user.role === "mentor" && (
          <div className="voted-projects mt-8">
            <h3 className="text-xl font-semibold mb-4">Voted Projects</h3>
            <div className="grid gap-4">
              {votedProjects.map((project) => (
                <div key={project.id} className="voted-project p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-indigo-600">
                      {project.title}
                    </h4>
                    <select
                      value={project.vote_status || "pending"}
                      onChange={(e) => handleVoteChange(project.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
                onClick={() => navigate(`/projects/${p.id}`)}
                style={{ cursor: "pointer" }}
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
