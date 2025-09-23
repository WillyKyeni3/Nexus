
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

// Mock project data based on the provided structure
const mockProject = {
  id: 1,
  title: "My Cool App",
  description: "A full-stack app for managing student projects and mentor feedback",
  date_created: "2024-09-23T15:30:00",
  user_id: 5,
  author: {
    id: 5,
    username: "student_dev"
  },
  votes: [
    {
      id: 10,
      status: "approved",
      mentor_id: 3,
      mentor_username: "tech_mentor_amy"
    },
    {
      id: 11,
      status: "approved",
      mentor_id: 4,
      mentor_username: "tech_mentor_bob"
    },
    {
      id: 12,
      status: "declined",
      mentor_id: 5,
      mentor_username: "tech_mentor_charlie"
    }
  ]
};

function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project] = useState(mockProject); // In real app, fetch project data

  const handleVote = (status) => {
    console.log("Vote submitted:", status, "for project id:", id);
  };

  // Calculate vote counts
  const approvedCount = project.votes.filter(vote => vote.status === 'approved').length;
  const declinedCount = project.votes.filter(vote => vote.status === 'declined').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Project Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <div className="text-gray-600 mb-4">
          <p>Created by: {project.author.username}</p>
          <p>Date: {new Date(project.date_created).toLocaleDateString()}</p>
        </div>
        <p className="text-gray-800">{project.description}</p>
      </div>

      {/* Voting Section */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Project Votes</h2>
        
        {/* Vote Status Display */}
        <div className="mb-6 text-lg">
          <p>
            Approved by {approvedCount} mentors, Declined by {declinedCount} mentors
          </p>
        </div>

        {/* Voting Buttons - Only visible to mentors */}
        {user?.role === 'mentor' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleVote('approved')}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleVote('declined')}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Decline
            </button>
          </div>
        )}

        {/* Vote History */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Vote History</h3>
          <div className="space-y-2">
            {project.votes.map(vote => (
              <div key={vote.id} className="flex items-center gap-2 text-gray-700">
                <span className={`w-2 h-2 rounded-full ${
                  vote.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span>{vote.mentor_username} - {vote.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;