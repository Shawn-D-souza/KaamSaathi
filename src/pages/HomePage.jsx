import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <h1>Loading...</h1>;

  if (!user) {
    return (
      <div>
        <h1>Welcome to KaamSaathi!</h1>
        <p>Your one-stop solution for local help.</p>
        <p>
          <Link to="/login">Log In</Link> or <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>What can we help you with today?</p>
      <button onClick={handleLogout} className="secondary">
        Log Out
      </button>
    </div>
  );
};

export default HomePage;