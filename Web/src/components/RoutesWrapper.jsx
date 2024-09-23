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

function RoutesWrapper({ setIsAuthPath }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];

  const isAuthPath = (path) => authPaths.includes(path);

  const handleSessionCheck = (session) => {
    if (session) {
      setIsAuthenticated(true);
      if (!isAuthPath(location.pathname) && location.pathname=="/") {
        setIsAuthPath(false);
        navigate('/'); // Redirect to dashboard if logged in AND not on an auth page
      } else {
        setIsAuthPath(true);
      }
    } else {
      setIsAuthenticated(false);
      if (!isAuthPath(location.pathname)) {
        setIsAuthPath(true);
        navigate('/login');
      } else {
        setIsAuthPath(true);
      }
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSessionCheck(session);
      setLoading(false);
    };

    // Handle password recovery event
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsAuthPath(true);
        navigate('/reset-password'); // Redirect to reset password page
      }
    });

    checkUserSession();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
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
  );
}

export default RoutesWrapper;
