import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard, Shield, Truck, Clock } from 'lucide-react';
import './Footer.css';
import ContactForm from './ContactForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main Footer */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">ShopEase</h3>
            <p className="footer-description">
              Your one-stop destination for quality products from verified sellers. Shop with confidence and enjoy secure payments.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-info">
              <li>
                <MapPin size={16} />
                <span>123 Business Ave, Suite 100<br />New York, NY 10001</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={16} />
                <span>support@shopease.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="footer-features">
          <div className="feature">
            <Truck size={24} />
            <div>
              <h4>Free Shipping</h4>
              <p>On orders over $50</p>
            </div>
          </div>
          <div className="feature">
            <Shield size={24} />
            <div>
              <h4>Secure Payment</h4>
              <p>100% secure transactions</p>
            </div>
          </div>
          <div className="feature">
            <Clock size={24} />
            <div>
              <h4>24/7 Support</h4>
              <p>Round the clock assistance</p>
            </div>
          </div>
          <div className="feature">
            <CreditCard size={24} />
            <div>
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>

        {/* Payment Methods
        <div className="footer-payment">
          <h3 className="footer-title">We Accept</h3>
          <div className="payment-methods">
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png" alt="Visa" />
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/mastercard.png" alt="Mastercard" />
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/amex.png" alt="American Express" />
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/discover.png" alt="Discover" />
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/paypal.png" alt="PayPal" />
          </div>
        </div> */}

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3 className="footer-title">Contact Through Email</h3>
          <p>Queries and grievances are accepted</p>
          <ContactForm />
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} ShopEase. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/sitemap">Sitemap</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;