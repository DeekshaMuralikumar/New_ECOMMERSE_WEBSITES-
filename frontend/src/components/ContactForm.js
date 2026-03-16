import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

function ContactForm() {
  const formRef = useRef();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    emailjs.sendForm(
      "service_erm1l9c",
      "template_8rfsxok",
      formRef.current,
      "9Kar6mYU-LPN4cP4T"
    ).then(
      () => {
        setStatus("Message sent successfully!");
        formRef.current.reset();
        setIsLoading(false);
      },
      () => {
        setStatus("Failed to send message. Please try again.");
        setIsLoading(false);
      }
    );
  };

  return (
    <form 
      ref={formRef} 
      onSubmit={sendEmail}
      className={`contact-form ${isLoading ? 'loading' : ''}`}
    >
      <label htmlFor="name">Enter your name:</label>
      <input 
        id="name"
        name="from_name" 
        placeholder="Your name" 
        required 
        disabled={isLoading}
      />
      
      <label htmlFor="email">Enter your email:</label>
      <input 
        id="email"
        name="from_email" 
        type="email"
        placeholder="your.email@example.com" 
        required 
        disabled={isLoading}
      />
      
      <label htmlFor="message">Your message:</label>
      <textarea 
        id="message"
        name="message" 
        placeholder="Type your message here..." 
        required 
        disabled={isLoading}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>

      {status && (
        <p className={`status-message ${status.includes('successfully') ? 'success' : 'error'}`}>
          {status}
        </p>
      )}
    </form>
  );
}

export default ContactForm;