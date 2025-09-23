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
    <div className="project-feed">
      <h2>Project Feed</h2>

      {/* Filter bar */}
      <FilterBar />

      {/* Create project button (hidden for mentors) */}
      {user && user.role !== "mentor" && (
        <button onClick={() => navigate("/projectform")}>Create Project</button>
      )}

      {/* Project list */}
      {projects.length === 0 ? (
        <div>No projects found.</div>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} style={{ marginBottom: "1rem" }}>
              <Link to={`/projects/${project.id}`}>
                <h3>{project.title}</h3>
              </Link>
              <p>{project.description}</p>
              <small>By: {project.author_name || "Unknown Author"}</small>
              <div>
                Votes:{" "}
                {project.votes?.filter((v) => v.status === "approved").length ||
                  0}{" "}
                approved,{" "}
                {project.votes?.filter((v) => v.status === "declined").length ||
                  0}{" "}
                declined
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
