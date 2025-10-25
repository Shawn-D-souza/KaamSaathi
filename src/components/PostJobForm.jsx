// src/components/PostJobForm.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './PostJobForm.css';

const PostJobForm = () => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { error } = await supabase.from('jobs').insert({
        poster_id: user.id,
        task_description: description,
        price: parseFloat(price),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: 'OPEN',
      });

      if (error) throw error;

      setMessage('Success! Your job has been posted.');
      setIsError(false);
      // Clear the form
      setDescription('');
      setPrice('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <h2>What can we help you with today?</h2>
      <form onSubmit={handleSubmit} className="post-job-form">
        <label>
          Task Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="e.g., I need help moving a sofa this Saturday."
          />
        </label>
        
        <label>
          Budget (₹)
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="e.g., 500"
            step="0.01"
          />
        </label>
        
        <p className="location-info">
          For now, please provide coordinates. We'll add a map soon!
          <br/>(Tip: Right-click on Google Maps to get coordinates)
        </p>
        
        <div className="form-row">
          <label className="form-group-half">
            Latitude
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              placeholder="e.g., 12.935"
              step="any"
            />
          </label>
          <label className="form-group-half">
            Longitude
            <input
              type="number"
              value={longitude}
              // THIS WAS THE LINE WITH THE ERROR
              onChange={(e) => setLongitude(e.target.value)}
              required
              placeholder="e.g., 77.614"
              step="any"
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
      {message && (
        <p className={`message ${isError ? 'error' : ''}`}>{message}</p>
      )}
    </div>
  );
};

export default PostJobForm;