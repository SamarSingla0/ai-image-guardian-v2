import React, { useEffect, useState } from 'react';
import api from '../api';
import ImageCard from '../components/ImageCard';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get('gallery/');
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching gallery", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="container">
      <h2>Your Gallery</h2>
      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <ImageCard key={img.id} image={img} />
          ))}
        </div>
      )}
    </div>
  );
};
export default Gallery;