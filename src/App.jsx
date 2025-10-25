import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProviderActivationPage from './pages/ProviderActivationPage';
import PosterDashboardPage from './pages/PosterDashboardPage';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Header /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/activate" element={<ProviderActivationPage />} />
        <Route path="/dashboard/poster" element={<PosterDashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;