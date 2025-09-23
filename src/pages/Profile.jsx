
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Api from "../Services/Api";

function Profile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            Api.get(`/users/${user.user}`)
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
        <div className="profile-container">
            <h2>Profile</h2>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Cohort:</strong> {profile.cohort || "N/A"}</p>
            <h3>Projects</h3>
            {profile.projects.length === 0 ? (
                <div>No projects found.</div>
            ) : (
                <ul>
                    {profile.projects.map((p) => (
                        <li key={p.id}>
                            <strong>{p.title}</strong> - {p.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Profile;