import React, { useState } from 'react';
import { FaEye, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import './ImageCard.css';

const ImageCard = ({ image }) => {
  const [reveal, setReveal] = useState(false);
  // image.image is a path like /media/uploads/...
  // Use it directly so Vite's /media proxy sends it to the backend.
  const imageUrl = image.image;
  const isBlurred = !image.is_safe && !reveal;
  const apiError =
    image.ai_tags === 'API Error' || image.ai_tags === 'System Error';
  const confidenceDisplay = apiError || image.confidence_score === 0
    ? 'N/A'
    : `${(image.confidence_score * 100).toFixed(1)}%`;

  return (
    <div className="card">
      <div className="image-container">
        <img 
          src={imageUrl} 
          alt="Upload"
          className={`card-img ${isBlurred ? 'blurred' : ''}`}
        />

        {/* Warning Overlay */}
        {!image.is_safe && !reveal && (
          <div className="overlay">
            <FaExclamationTriangle size={30} color="#fc8181" />
            <h3>Content Warning</h3>
            <p>AI Detected: {image.ai_tags}</p>
            <button onClick={() => setReveal(true)} className="btn-reveal">
              <FaEye /> View Anyway
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-header">
          <span className="date">{new Date(image.uploaded_at).toLocaleDateString()}</span>
          {image.is_safe ? (
            <span className="badge safe"><FaShieldAlt /> Safe</span>
          ) : (
            <span className="badge unsafe"><FaExclamationTriangle /> Unsafe</span>
          )}
        </div>
        <div className="meta-info">
          <p>Confidence: {confidenceDisplay}</p>
          <p>
            Tags:{' '}
            {apiError
              ? 'Not available (AI error)'
              : image.ai_tags || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;