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

  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    Api.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...projects];
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(project => {
        const projectStatus = (project.vote_status || 'pending').toLowerCase();
        return projectStatus === filters.status;
      });
    }
    
    // Filter by cohort
    if (filters.cohort.trim()) {
      const searchTerm = filters.cohort.toLowerCase().trim();
      filtered = filtered.filter(project => {
        const projectCohort = (project.cohort || '').toLowerCase();
        return projectCohort.includes(searchTerm);
      });
    }
    
    setFilteredProjects(filtered);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-feed fade-in">
      <div className="feed-header">
        <h2>Project Feed</h2>
        {user && user.role !== "mentor" && (
          <button className="btn-accent" onClick={() => navigate("/projectform")}>
            <i className="ri-add-line"></i>Create Project
          </button>
        )}
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {filteredProjects.length === 0 ? (
        <div className="no-projects">No projects found.</div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <Link to={`/projects/${project.id}`}>
                <h3>{project.title}</h3>
              </Link>
              <p>{project.description}</p>
              <div className="project-meta">
                <div>By: {project.author_name || "Unknown Author"}</div>
                {/* <div className="vote-count">
                  <span className="votes approved">
                    ✓ {project.votes?.filter((v) => v.status === "approved").length || 0}
                  </span>
                  <span className="votes declined">
                    ✗ {project.votes?.filter((v) => v.status === "declined").length || 0}
                  </span>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
