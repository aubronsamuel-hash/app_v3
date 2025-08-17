import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useMe } from '../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useLogin();
  const meQuery = useMe({ enabled: false });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    setError(null);
    try {
      await login.mutateAsync({ username, password });
      await meQuery.refetch();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = (err as { message?: string }).message ?? 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-80 p-6 bg-white rounded shadow space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {login.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

