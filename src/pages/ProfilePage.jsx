import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p>
        <strong>Username:</strong> {profile.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <hr style={{ margin: '20px 0' }} />

      {profile.is_provider ? (
        <div>
          <h2>Provider Dashboard</h2>
          <p>
            <strong>Bio:</strong> {profile.bio || 'Not set'}
          </p>
          {/* We will display the avatar image here in Task 5 */}
        </div>
      ) : (
        <div>
          <h2>Become a Provider</h2>
          <p>You are not a provider yet. Activate your provider profile to start working.</p>
          {/* This Link will point to the activation form in Task 5 */}
          <Link to="/profile/activate" className="button">
            Become a Provider
          </Link>
        </div>
      )}

      <br />
      <Link to="/" style={{ marginTop: '20px', display: 'inline-block' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default ProfilePage;