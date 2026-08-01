import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FindJobs from './pages/FindJobs'
import JobDetails from './pages/JobDetails'
import VerifyEmail from './pages/VerifyEmail'
import VerifySuccess from './pages/VerifySuccess'
import VerifyFailed from './pages/VerifyFailed'
import ResendVerification from './pages/ResendVerification'
import PostJob from './pages/PostJob'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PosterDashboard from './pages/PosterDashboard'
import Applications from './pages/Applications'
import ApplicationDetails from './pages/ApplicationDetails'
import AdminDashboard from './pages/AdminDashboard'
import { useAuth } from './context/authContext'
import Footer from './components/Footer'

// Adds the site-wide footer to every page.
const Layout = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/signin" replace />
  return children
}

const PosterRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/signin" replace />
  if (user.role !== "admin" && user.accountType !== "poster")
    return <Navigate to="/jobs" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/signin" replace />
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/jobs" element={<Layout><FindJobs /></Layout>} />
      <Route path="/jobs/:id" element={<Layout><JobDetails /></Layout>} />
      <Route path="/verify-email/:token?" element={<Layout><VerifyEmail /></Layout>} />
      <Route path="/verify-success" element={<Layout><VerifySuccess /></Layout>} />
      <Route path="/verify-failed" element={<Layout><VerifyFailed /></Layout>} />
      <Route path="/resend-verification" element={<Layout><ResendVerification /></Layout>} />
      <Route path="/signin" element={<Layout><SignIn /></Layout>} />
      <Route path="/signup" element={<Layout><SignUp /></Layout>} />
      <Route
        path="/post-job"
        element={
          <ProtectedRoute>
            <Layout><PostJob /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PosterRoute>
            <PosterDashboard />
          </PosterRoute>
        }
      />
      <Route
        path="/dashboard/applications/:jobId"
        element={
          <PosterRoute>
            <Applications />
          </PosterRoute>
        }
      />
      <Route
        path="/dashboard/applications/:jobId/:applicationId"
        element={
          <PosterRoute>
            <ApplicationDetails />
          </PosterRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route path="/signupadd" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
