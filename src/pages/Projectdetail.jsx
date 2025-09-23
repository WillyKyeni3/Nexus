
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const handleVote = (status) => {
    console.log("Vote submitted:", status, "for project id:", id);
    // Your teammate will implement project fetching
    // You'll implement the actual vote submission here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Voting Section - Your responsibility */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Project Votes</h2>
        
        {/* Vote Status Display */}
        <div className="mb-6 text-lg">
          <p>Loading vote counts...</p>
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
          <p>Loading vote history...</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;