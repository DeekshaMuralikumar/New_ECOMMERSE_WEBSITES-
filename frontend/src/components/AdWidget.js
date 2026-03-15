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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axiosInstance.get('/ads/active');
        setAds(res.data || []);
      } catch (err) {
        console.error('Failed to fetch ads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

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

  if (!visible || loading || ads.length === 0) return null;

  const ad = ads[0]; // show first ad

  return (
    <div className="ad-widget">
      <button onClick={() => setVisible(false)} className="ad-close">
        <X size={13} />
      </button>
      <div className="ad-sponsored">
        <Megaphone size={12} /> Sponsored
      </div>
      <div className="ad-title">{ad.name}</div>
      <div className="ad-description">{ad.description}</div>
      <button onClick={() => handleAdClick(ad.id)} className="ad-button">
        Shop Now
      </button>
    </div>
  );
};

export default AdWidget;