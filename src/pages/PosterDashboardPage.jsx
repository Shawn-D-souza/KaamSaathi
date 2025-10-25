import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const PosterDashboardPage = () => {
  const { user } = useAuth();
  const [openJobs, setOpenJobs] = useState([]);
  const [otherJobs, setOtherJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('poster_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOpenJobs(data.filter((job) => job.status === 'OPEN'));
        setOtherJobs(
          data.filter(
            (job) => job.status === 'BOOKED' || job.status === 'COMPLETED'
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  const JobCard = ({ job }) => (
    <div className="job-card">
      <h3>{job.task_description.substring(0, 60)}...</h3>
      <p>
        <strong>Status:</strong> <span className={`status ${job.status}`}>{job.status}</span>
      </p>
      <p><strong>Budget:</strong> ₹{job.price}</p>
      <p className="location-coords">
        <strong>Location:</strong> ({job.latitude}, {job.longitude})
      </p>
      {job.status === 'OPEN' && (
        <Link to={`/job/${job.id}/applicants`} className="button-link">
          View Applicants
        </Link>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <h1>My Posted Jobs</h1>

      <section className="job-list-section">
        <h2>Open Jobs</h2>
        {openJobs.length > 0 ? (
          <div className="job-list">
            {openJobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <p>You have no open jobs. Post one from the homepage!</p>
        )}
      </section>

      <section className="job-list-section">
        <h2>Booked & Completed Jobs</h2>
        {otherJobs.length > 0 ? (
          <div className="job-list">
            {otherJobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <p>You have no booked or completed jobs yet.</p>
        )}
      </section>
    </div>
  );
};

export default PosterDashboardPage;