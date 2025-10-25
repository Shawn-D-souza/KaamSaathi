import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { supabase } from '../supabaseClient';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  const { mode, toggleMode } = useMode();
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(true);

  // We need to fetch the user's profile to know if they are a provider
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_provider')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setIsProvider(data.is_provider);
      } catch (error) {
        console.error('Error fetching profile for header:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Re-run when the user logs in or out

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    // Don't show a header if user is not logged in (on login/signup page)
    return null; 
  }

  return (
    <header className="app-header">
      <div className="header-brand">
        <Link to="/">KaamSaathi</Link>
      </div>

      {!loading && isProvider && (
        <div className="mode-toggle">
          <span>Posting</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={mode === 'working'}
              onChange={toggleMode}
            />
            <span className="slider"></span>
          </label>
          <span>Working</span>
        </div>
      )}

      <nav className="header-nav">
        <Link to="/profile">My Profile</Link>
        <button onClick={handleLogout} className="secondary-link">
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Header;