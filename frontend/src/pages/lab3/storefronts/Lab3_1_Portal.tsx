import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureShop from './SecureShop';
import VaultMart from './VaultMart';
import AlphaCart from './AlphaCart';

interface PortalProps {
  variantId: string;
  instanceId: string;
}

export default function Lab3_1_Portal({ variantId, instanceId }: PortalProps) {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'profile'>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [userRole, setUserRole] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    // Clear session on mount to ensure fresh start as requested
    handleLogout();
    
    return () => {
      // Clear session on unmount
      handleLogout();
    };
  }, [variantId, instanceId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`/api/lab3/1/${variantId}/login`, { username, password }, { 
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      const { access_token, role, username: returnedUsername } = res.data;
      
      localStorage.setItem(`token_lab3_1_${variantId}`, access_token);
      localStorage.setItem(`username_lab3_1_${variantId}`, returnedUsername);
      
      setUserRole(role);
      setCurrentUsername(returnedUsername);
      setView('dashboard');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`token_lab3_1_${variantId}`);
    localStorage.removeItem(`username_lab3_1_${variantId}`);
    setUserRole('');
    setCurrentUsername('');
    setProfileData(null);
    setView('landing');
  };

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem(`token_lab3_1_${variantId}`);
      if (!token) return;
      const res = await axios.get(`/api/lab3/1/${variantId}/profile?id=${currentUsername}`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Variant-Session-ID': instanceId },
        withCredentials: true
      });
      setProfileData(res.data);
      setView('profile');
    } catch (err) {
      alert('Failed to load profile.');
    }
  };

  const commonProps = {
    view, setView, username, setUsername, password, setPassword, error, 
    userRole, currentUsername, loading, profileData,
    handleLogin, handleLogout, loadProfile, variantId
  };

  if (variantId === 'a') return <SecureShop {...commonProps} />;
  if (variantId === 'b') return <VaultMart {...commonProps} />;
  if (variantId === 'c') return <AlphaCart {...commonProps} />;
  return <SecureShop {...commonProps} />;
}
