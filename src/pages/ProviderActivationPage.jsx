import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ProviderActivationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      setMessage('Please upload an avatar image.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // 1. Upload Avatar
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;

      // 3. Update Profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_provider: true,
          bio: bio,
          avatar_url: publicUrl,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Activation successful! Redirecting...');
      setTimeout(() => navigate('/profile'), 2000);
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Become a Provider</h1>
      <p>Complete your profile to start accepting jobs.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Profile Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            placeholder="Tell clients a bit about yourself..."
            style={{ fontFamily: 'inherit', fontSize: '0.9rem', padding: '10px' }}
          />
        </label>
        
        <label>
          Avatar Image
          <input
            type="file"
            onChange={handleFileChange}
            required
            accept="image/png, image/jpeg"
            style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Activating...' : 'Activate Profile'}
        </button>
      </form>

      {message && (
        <p className={`message ${isError ? 'error' : ''}`}>{message}</p>
      )}

      <p style={{ marginTop: '16px' }}>
        <Link to="/profile">Back to Profile</Link>
      </p>
    </div>
  );
};

export default ProviderActivationPage;