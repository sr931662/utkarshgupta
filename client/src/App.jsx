import './App.css';
import Footer from './components/Footer/Footer';
import Contact from './components/Home/Contacts/Contact';
import CV from './components/Home/CV/CV';
import Hero from './components/Home/Hero/Hero';
import Publications from './components/Home/Publications/Publications';
import ResearchInterest from './components/Home/ResearchInterests/ResearchInterests';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import PublicationsDetail from './components/Home/Publications/publications_detail/Publications_detail';
import Login from './components/Login/Login';
import ProtectedRoute from './context/protectedRoute';
import Dashboard from './components/dashboard/dashboard'; // Fixed: component names should be capitalized
import Admin from './components/admin/admin'; // Fixed: component names should be capitalized
import { AuthProvider } from './context/authContext';
import LiteratureUploader from './components/uploadPubs/uploadPubs';
import UploadPublications from './components/dashboard/Publishings/uploadPubs';
// import ResetPassword from './components/Login/OTPVerify/Reset';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route exact path='/publications-detail' element={<PublicationsDetail />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/publish-new' element={<LiteratureUploader />} />
            <Route exact path='/upload-publications' element={<UploadPublications />} />
            <Route exact 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route exact 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ResearchInterest />
      <Publications />
      <CV />
      <Contact />
    </div>
  );
}

export default App;