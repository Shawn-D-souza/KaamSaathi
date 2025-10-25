import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useMode } from '../context/ModeContext'; 
import PostJobForm from '../components/PostJobForm';

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
        // Render the PostJobForm when in 'posting' mode
        <PostJobForm />
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