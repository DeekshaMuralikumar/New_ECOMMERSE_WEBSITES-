import React, { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import './AdWidget.css';

const AdWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axiosInstance.get('/ads/active');
        setAds(res.data || []);
        if (res.data.length > 0) {
          // Select a random ad initially
          const randomIndex = Math.floor(Math.random() * res.data.length);
          setCurrentAd(res.data[randomIndex]);
        }
      } catch (err) {
        console.error('Failed to fetch ads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Cycle ads every 15 seconds
  useEffect(() => {
    if (!ads.length || !visible) return;

    const intervalId = setInterval(() => {
      // Select a random ad (could be same as current, that's fine)
      const randomIndex = Math.floor(Math.random() * ads.length);
      setCurrentAd(ads[randomIndex]);
    }, 15000); // 15 seconds

    return () => clearInterval(intervalId);
  }, [ads, visible]);

  const handleAdClick = async (adId) => {
    if (user?.id) {
      try {
        await axiosInstance.post(`/ads/click/${adId}?userId=${user.id}`);
      } catch (err) {
        console.error('Failed to record ad click', err);
      }
    }
    navigate(`/product/${adId}`);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible || loading || ads.length === 0 || !currentAd) return null;

  return (
    <div className="ad-widget">
      <button onClick={handleClose} className="ad-close">
        <X size={13} />
      </button>
      <div className="ad-sponsored">
        <Megaphone size={12} /> Sponsored
      </div>
      <div className="ad-title">{currentAd.name}</div>
      <div className="ad-description">{currentAd.description}</div>
      <button onClick={() => handleAdClick(currentAd.id)} className="ad-button">
        Shop Now
      </button>
    </div>
  );
};

export default AdWidget;