import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to home if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="gradient-text">Welcome to NEXUS</h1>
          <p className="hero-description">
            Join our community of innovative developers showcasing and collaborating on groundbreaking projects. 
            Get feedback from mentors, connect with peers, and take your coding journey to the next level.
          </p>
          <div className="cta-buttons">
            <button className="btn-hero" onClick={() => navigate('/signup')}>
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
