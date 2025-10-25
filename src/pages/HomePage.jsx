import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useMode } from '../context/ModeContext'; 

const HomePage = () => {
  const { user, loading } = useAuth();
  const { mode } = useMode();

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
      {mode === 'posting' ? (
        <div>
          <h1>Find Help</h1>
          <p>What can we help you with today?</p>
        </div>
      ) : (
        <div>
          <h1>Find Work</h1>
          <p>You are in "Working" mode. Look for jobs!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;