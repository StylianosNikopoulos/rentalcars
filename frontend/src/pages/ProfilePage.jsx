import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>My Profile</h1>
            <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', display: 'inline-block' }}>
                <p><strong>Role:</strong> {user?.role || 'User'}</p>
            </div>
        </div>
    );
};

export default ProfilePage;