// src/RoutesWrapper.jsx
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Budget from '../pages/Budget';
import Goals from '../pages/Goals';
import Authentication from '../pages/Authentication';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';


function RoutesWrapper() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

      // Check if the user is logged in when the app loads
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
        // Only redirect to the dashboard if NOT on the password reset page
        if (location.pathname !== '/reset-password' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password') {
          navigate('/'); // Redirect to dashboard if logged in AND not on reset-password page
        }
      } else {
        setIsAuthenticated(false);
        // Allow navigation to login/signup pages if not authenticated
        if (location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password' && location.pathname !== '/reset-password') {
            navigate('/login');
        }
      }
      setLoading(false);
    };

    
    // Handle password recovery event
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password'); // Redirect to reset password page
      }
    });

    checkUserSession();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Authentication />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default RoutesWrapper;
