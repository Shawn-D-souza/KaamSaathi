import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

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
        <p>You are not logged in.</p>
        <p>
          <a href="/login">Log In</a> or <a href="/signup">Sign Up</a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default HomePage;