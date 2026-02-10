import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('stats/');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats', err);
        setError('Could not load your stats.');
      }
    };

    fetchStats();
  }, []);

  const username = user?.username || 'Current user';

  return (
    <div className="container">
      <div className="dashboard-card" style={{ maxWidth: '720px' }}>
        <h1 style={{ marginBottom: '8px' }}>User overview</h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Quick summary of your account and moderation activity.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            borderRadius: '999px',
            background: '#f1f5f9',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {username.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{username}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Active AI Guardian user
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>}

        {!stats && !error && (
          <p style={{ marginTop: '16px' }}>Loading stats...</p>
        )}

        {stats && (
          <div
            style={{
              marginTop: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: '#eff6ff',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Total photos scanned
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {stats.total_uploads}
              </div>
            </div>
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: '#ecfdf3',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                Approved (safe)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {stats.safe_images}
              </div>
            </div>
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: '#fef2f2',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
                Flagged photos
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {stats.flagged_images}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
