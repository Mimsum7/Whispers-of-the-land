import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Common/ProtectedRoute';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import SubmitStoryPage from './pages/SubmitStoryPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/story/:id" element={<StoryPage />} />
              <Route path="/submit" element={<SubmitStoryPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;