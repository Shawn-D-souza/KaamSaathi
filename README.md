# **KaamSaathi**

**The fastest, simplest way to book help for any local task.**

KaamSaathi is a modern, reliable platform that connects individuals with trusted local people for on-demand help with everyday offline tasks and short-term jobs.

This repository contains the complete frontend application built with React and Vite, powered by a Supabase backend.

## **Core Features**

The platform is a dual-sided marketplace serving two distinct user roles:

**For Customers (Posters):**

* **Post a Job:** Easily describe any task, set a budget, and post it to the local job board.  
* **View Applicants:** Review profiles of interested providers who have applied for the job.  
* **Book with Confidence:** Select and book a provider based on their bio and, most importantly, their history of user-verified reviews.  
* **Manage Jobs:** A personal dashboard to track the status of all open, booked, and completed jobs.  
* **Build Trust:** Leave ratings and reviews for providers after a job is completed, contributing to the community's trust system.

**For Local Help (Providers):**

* **Activate a Profile:** Any user can become a provider by adding a bio and profile picture.  
* **Find Work:** Browse a real-time job board of all 'OPEN' jobs in the area.  
* **Apply in Seconds:** Instantly apply for any job that fits their skills and schedule.  
* **Manage Gigs:** A provider-specific dashboard to track the status of all booked and completed gigs.  
* **Build Reputation:** Complete jobs to earn ratings and reviews, building a public reputation that leads to more bookings.

## **Tech Stack**

This project is built with a modern, scalable tech stack:

* **Frontend:** [React 19](https://react.dev/) (with Hooks & Context)  
* **Build Tool:** [Vite](https://vitejs.dev/)  
* **Backend:** [Supabase](https://supabase.com/)  
  * **Database:** Supabase Postgres  
  * **Authentication:** Supabase Auth (Email/Pass & JWT)  
  * **Storage:** Supabase Storage (for user avatars)  
  * **Security:** Row Level Security (RLS) policies  
* **Routing:** [React Router v6](https://reactrouter.com/)  
* **Styling:** Plain CSS with CSS Variables

## **Getting Started**

Follow these instructions to get the project up and running on your local machine for development and testing.

### **Prerequisites**

* **Node.js:** v18.x or higher  
* **npm:** v9.x or higher  
* **Supabase Account:** A free Supabase project to act as the backend.

### **Local Installation**

1. **Clone the repository:**  
   git clone \[https://github.com/shawn-D-souza/kaamsaathi.git\](https://github.com/shawn-D-souza/kaamsaathi.git)  
   cd kaamsaathi

2. **Install dependencies:**  
   npm install

3. Set up your environment:  
   Create a new file named .env in the root of the project. You will get these keys from your Supabase project's "API Settings" page.  
   VITE\_SUPABASE\_PROJECT\_URL="https"//YOUR\_PROJECT\_URL.supabase.co  
   VITE\_SUPABASE\_ANON\_KEY="YOUR\_PROJECT\_ANON\_KEY"

### **Database Setup**

This project relies on a specific database schema and Row Level Security (RLS) policies to function.

1. **Enable RLS:** Go to your Supabase project's "Authentication" \-\> "Policies" section and ensure RLS is enabled for all tables.  
2. Run SQL Scripts: The SQL scripts used to create the tables (profiles, jobs, applications, reviews), ENUM types (job\_status), database triggers (handle\_new\_user), and all RLS policies must be run.  
   (Note: These scripts can be found in the project's /supabase directory \- you can add this later).

## **Running the Application**

Once your environment is configured, you can run the app in development mode.

npm run dev

This will start the Vite development server, typically at http://localhost:5173.

### **Other Scripts**

* **Build for production:**  
  npm run build

* **Run linter:**  
  npm run lint  
