import React from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../Components/FilterBar';

// Mock projects data
const mockProjects = [
  {
    id: 1,
    title: "Cool React App",
    description: "A React application for managing tasks",
    author: { username: "student_charlie" },
    votes: [
      { status: "approved" },
      { status: "approved" },
      { status: "declined" }
    ]
  },
  {
    id: 2,
    title: "Python CLI Tool",
    description: "A command-line interface tool built with Python",
    author: { username: "student_charlie" },
    votes: []
  }
];

function Home() {
  return (
    <div className="space-y-6">
      <FilterBar />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map(project => (
          <Link 
            key={project.id}
            to={`/projects/${project.id}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500">
              <p>By: {project.author.username}</p>
              <p>
                Votes: {project.votes.filter(v => v.status === "approved").length} approved, {" "}
                {project.votes.filter(v => v.status === "declined").length} declined
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;