
import React, { useEffect, useState, useContext } from "react";
import Api from "../Services/Api";
import ProjectCard from "../Components/ProjectCard";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        Api.get("/projects")
            .then((res) => {
                setProjects(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load projects");
                setLoading(false);
            });
    }, []);

    const handleEdit = (id) => {
        // Implement navigation to edit page if needed
    };

    const handleDelete = (id) => {
        // Implement delete logic if needed
    };

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-feed" >
            <h2>Project Feed</h2>
            <button onClick={() => navigate("/projectform")}>Create Project</button>
            {projects.length === 0 ? (
                <div>No projects found.</div>
            ) : (
                projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        isOwner={user && user.id === project.user_id}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
}

export default Home;