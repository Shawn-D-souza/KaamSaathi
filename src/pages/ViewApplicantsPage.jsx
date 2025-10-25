import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const [bookingLoading, setBookingLoading] = useState(null); 

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      if (!user || !jobId) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch the job details
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
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select(
            `
            profiles ( id, username, bio, avatar_url )
            `
          )
          .eq('job_id', jobId);

        if (appError) throw new Error(`Applicants fetch error: ${appError.message}`);
        
        const formattedApplicants = appData.map(app => app.profiles);

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
                setJob={setJob}
                bookingLoading={bookingLoading === applicant.id}
                setBookingLoading={setBookingLoading}
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

const ApplicantCard = ({ applicant, job, setJob, bookingLoading, setBookingLoading }) => {
  const navigate = useNavigate();

  const handleBook = async () => {
    // 1. Confirm the action
    if (!window.confirm(`Are you sure you want to book ${applicant.username}? This job will be assigned to them.`)) {
      return;
    }

    setBookingLoading(applicant.id); // Set loading state for this specific card
    try {
      // 2. Update the job in Supabase
      const { data, error } = await supabase
        .from('jobs')
        .update({
          status: 'BOOKED',
          booked_provider_id: applicant.id, // 'applicant.id' is the provider's ID from profiles
        })
        .eq('id', job.id)
        .select() // Ask Supabase to return the updated row
        .single();

      if (error) throw error;

      // 3. Update the local job state to instantly refresh the UI
      setJob(data); 

      // Optional: uncomment this line to redirect after booking
      // navigate('/dashboard/poster');

    } catch (error) {
      alert(`Error booking provider: ${error.message}`);
    } finally {
      setBookingLoading(null); // Clear loading state
    }
  };

  return (
    <div className="job-card applicant-card">
      <div className="applicant-header">
        <img 
          src={applicant.avatar_url || 'https://i.imgur.com/S8Wf2yF.png'} 
          alt={`${applicant.username}'s avatar`}
          className="applicant-avatar"
        />
        <div>
          <h3 style={{marginTop: 0, marginBottom: '4px'}}>{applicant.username}</h3>
        </div>
      </div>
      <p><strong>Bio:</strong> {applicant.bio || 'No bio provided.'}</p>
      
      {job.status === 'OPEN' && (
        <button 
          onClick={handleBook}
          disabled={bookingLoading}
          className="button-link" 
          style={{border: 'none', cursor: 'pointer'}}
        >
          {bookingLoading ? 'Booking...' : `Book ${applicant.username}`}
        </button>
      )}

      {/* Show a clear "Booked" status on the card of the chosen provider */}
      {job.status === 'BOOKED' && job.booked_provider_id === applicant.id && (
         <p className="status BOOKED" style={{marginTop: '1rem'}}>✅ BOOKED</p>
      )}
    </div>
  );
}

export default ViewApplicantsPage;