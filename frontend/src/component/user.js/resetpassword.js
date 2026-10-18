import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from './InputField';
import '../../css/login.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Erreur serveur (${response.status})`);
      }

      toast.success('Password reset successful. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <InputField
          type="password"
          placeholder="New password"
          icon="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="Confirm password"
          icon="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ResetPassword;