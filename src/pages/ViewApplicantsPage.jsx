import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const ViewApplicantsPage = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      if (!user || !jobId) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch the job details
        // We also check poster_id for security, ensuring this user posted the job.
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .eq('poster_id', user.id) 
          .single();

        if (jobError) throw new Error(`Job fetch error: ${jobError.message}`);
        if (!jobData) throw new Error('Job not found or access denied.');
        setJob(jobData);

        // 2. Fetch applicants for this job
        // This query "joins" applications with profiles based on your schema
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select(
            `
            id,
            provider_id,
            profiles ( id, username, bio, avatar_url )
          `
          )
          .eq('job_id', jobId);

        if (appError) throw new Error(`Applicants fetch error: ${appError.message}`);
        
        // Supabase returns profiles nested, so we flatten it for easier use
        const formattedApplicants = appData.map(app => ({
          application_id: app.id,
          ...app.profiles
        }));

        setApplicants(formattedApplicants);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicants();
  }, [jobId, user]);

  if (loading) return <div>Loading applicants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <p>
        <Link to="/dashboard/poster">&larr; Back to Dashboard</Link>
      </p>
      <h1>Applicants for:</h1>
      <h2 className="job-title">{job?.task_description}</h2>

      {job?.status !== 'OPEN' && (
        <div className="message">
          This job is no longer open. Status: {job?.status}
        </div>
      )}

      <section className="job-list-section">
        {applicants.length > 0 ? (
          <div className="job-list">
            {applicants.map((applicant) => (
              <ApplicantCard 
                key={applicant.id} 
                applicant={applicant}
                job={job}
              />
            ))}
          </div>
        ) : (
          <p>There are no applicants for this job yet.</p>
        )}
      </section>
    </div>
  );
};

// A sub-component for displaying a single applicant
const ApplicantCard = ({ applicant, job }) => {
  return (
    <div className="job-card applicant-card">
      <div className="applicant-header">
        <img 
          src={applicant.avatar_url || 'https://i.imgur.com/S8Wf2yF.png'} // A generic placeholder
          alt={`${applicant.username}'s avatar`}
          className="applicant-avatar"
        />
        <div>
          <h3 style={{marginTop: 0, marginBottom: '4px'}}>{applicant.username}</h3>
        </div>
      </div>
      <p><strong>Bio:</strong> {applicant.bio || 'No bio provided.'}</p>
      
      {job.status === 'OPEN' && (
        <button className="button-link" style={{border: 'none'}}>
          Book {applicant.username}
        </button>
      )}
    </div>
  );
}

export default ViewApplicantsPage;