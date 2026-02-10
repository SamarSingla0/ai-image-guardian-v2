import React, { useRef, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      await api.post('upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Image analyzed successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error(error);
      alert('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-card">
        <h1>Analyze Image</h1>
        <p>Upload an image to detect sensitive content using AI.</p>

        <div className="upload-area" onClick={handleBoxClick}>
          <FaCloudUploadAlt size={50} color="#94a3b8" />
          <p style={{ marginTop: '12px', color: '#64748b' }}>
            Click anywhere in this box to choose a file
          </p>
          {file && (
            <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              Selected: <strong>{file.name}</strong>
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-primary"
          style={{ padding: '15px', fontSize: '1.1rem' }}
        >
          {loading ? 'AI is Analyzing...' : 'Upload & Check Safety'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;