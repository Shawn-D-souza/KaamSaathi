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
        // Add a timestamp to bust cache when user updates profile
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
  }, [user]); // Re-fetch when user object changes (though id won't)

  // A simple function to force re-fetch after activation
  const refreshProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(); 

    if (error) setError(error.message);
    else setProfile(data);
    setLoading(false);
  };
  
  useEffect(() => {
    window.addEventListener('focus', refreshProfile);
    return () => {
      window.removeEventListener('focus', refreshProfile);
    };
  }, [user.id]);


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
          
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '10px'
              }}
            />
          )}
          
          <p>
            <strong>Bio:</strong> {profile.bio || 'Not set'}
          </p>
        </div>
      ) : (
        <div>
          <h2>Become a Provider</h2>
          <p>You are not a provider yet. Activate your provider profile to start working.</p>
          <Link to="/profile/activate" className="button" style={{ 
            display: 'inline-block',
            marginTop: '10px',
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            padding: '10px 15px', 
            textDecoration: 'none', 
            borderRadius: '6px'
          }}>
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