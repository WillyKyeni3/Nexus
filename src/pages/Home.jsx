import React, { useEffect, useState } from "react";
import Api from "../Services/Api";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import FilterBar from "../Components/FilterBar";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Api.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-feed fade-in">
      <div className="feed-header">
        <h2>Project Feed</h2>
        {user && user.role !== "mentor" && (
          <button className="btn-accent" onClick={() => navigate("/projectform")}>
            Create Project
          </button>
        )}
      </div>

      <FilterBar />

      {projects.length === 0 ? (
        <div className="no-projects">No projects found.</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <Link to={`/projects/${project.id}`}>
                <h3>{project.title}</h3>
              </Link>
              <p>{project.description}</p>
              <div className="project-meta">
                <div>By: {project.author_name || "Unknown Author"}</div>
                <div className="vote-count">
                  <span className="votes approved">
                    ✓ {project.votes?.filter((v) => v.status === "approved").length || 0}
                  </span>
                  <span className="votes declined">
                    ✗ {project.votes?.filter((v) => v.status === "declined").length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
