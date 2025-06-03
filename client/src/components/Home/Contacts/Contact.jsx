import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapLocation, faPhone, faTimeline } from '@fortawesome/free-solid-svg-icons'
import { FaGithub, FaGoogle, FaLinkedinIn, FaResearchgate, FaTwitter } from "react-icons/fa";
import { authAPI } from '../../../context/authAPI';

const Contact = () => {
  const { darkMode } = useTheme();
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await authAPI.getPublicContactInfo();
        setContactInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch contact information');
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });

    try {
      const response = await authAPI.sendContactEmail(formData);
      if (response.status === 200) {
        setFormStatus({ submitting: false, submitted: true, error: null });
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setFormStatus({
        submitting: false,
        submitted: false,
        error: err.message || 'Failed to send message. Please try again later.'
      });
    }
  };
  if (loading) {
    return (
      <section 
        id="contact" 
        className={styles.section}
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
          '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)'
        }}
      >
        <div className={styles.container}>
          <p style={{ color: darkMode ? '#f8fafc' : '#1f2937' }}>Loading contact information...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        id="contact" 
        className={styles.section}
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
          '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)'
        }}
      >
        <div className={styles.container}>
          <p style={{ color: darkMode ? '#f8fafc' : '#1f2937' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="contact" 
      className={styles.section}
      style={{
        backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
        '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)'
      }}
    >
      <div className={styles.container}>
        <h2 
          className={styles.sectionTitle}
          style={{ color: darkMode ? '#f8fafc' : '#1f2937' }}
        >
          Get in Touch
        </h2>
        <p 
          className={styles.sectionSubtitle}
          style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}
        >
          Feel free to reach out for research collaborations, speaking engagements, or academic inquiries.
        </p>
        
        <div className={styles.grid}>
          {/* Contact Form */}
          <div 
            className={styles.formContainer}
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 
              className={styles.formTitle}
              style={{ color: darkMode ? '#f8fafc' : '#1f2937' }}
            >
              Send a Message
            </h3>
            
            <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label 
          htmlFor="name" 
          className={styles.formLabel}
          style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
        >
          Name
        </label>
        <input 
          type="text" 
          id="name" 
          name="name"
          className={styles.formInput}
          placeholder="Your name"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={{
            backgroundColor: darkMode ? '#334155' : '#ffffff',
            borderColor: darkMode ? '#475569' : '#d1d5db',
            color: darkMode ? '#f8fafc' : '#1f2937'
          }}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label 
          htmlFor="email" 
          className={styles.formLabel}
          style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
        >
          Email
        </label>
        <input 
          type="email" 
          id="email" 
          name="email"
          className={styles.formInput}
          placeholder="Your email address"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={{
            backgroundColor: darkMode ? '#334155' : '#ffffff',
            borderColor: darkMode ? '#475569' : '#d1d5db',
            color: darkMode ? '#f8fafc' : '#1f2937'
          }}
        />
      </div>

      <div className={styles.formGroup}>
        <label 
          htmlFor="phone" 
          className={styles.formLabel}
          style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
        >
          Phone
        </label>
        <input 
          type="tel" 
          id="phone" 
          name="phone"
          className={styles.formInput}
          placeholder="Your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          style={{
            backgroundColor: darkMode ? '#334155' : '#ffffff',
            borderColor: darkMode ? '#475569' : '#d1d5db',
            color: darkMode ? '#f8fafc' : '#1f2937'
          }}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label 
          htmlFor="organization" 
          className={styles.formLabel}
          style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
        >
          Organization Name
        </label>
        <input 
          type="text" 
          id="organization" 
          name="organization"
          className={styles.formInput}
          placeholder="Your organization name"
          value={formData.organization}
          onChange={handleInputChange}
          style={{
            backgroundColor: darkMode ? '#334155' : '#ffffff',
            borderColor: darkMode ? '#475569' : '#d1d5db',
            color: darkMode ? '#f8fafc' : '#1f2937'
          }}
        />
      </div>

      <div className={styles.formGroup}>
        <label 
          htmlFor="subject" 
          className={styles.formLabel}
          style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
        >
          Subject
        </label>
        <input 
          type="text" 
          id="subject" 
          name="subject"
          className={styles.formInput}
          placeholder="Message subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
          style={{
            backgroundColor: darkMode ? '#334155' : '#ffffff',
            borderColor: darkMode ? '#475569' : '#d1d5db',
            color: darkMode ? '#f8fafc' : '#1f2937'
          }}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label 
          htmlFor="message" 
          className={styles.formLabel}
          style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
        >
          Message
        </label>
        <textarea 
          id="message" 
          name="message"
          rows="5" 
          className={styles.formTextarea}
          placeholder="Your message"
          value={formData.message}
          onChange={handleInputChange}
          required
          style={{
            backgroundColor: darkMode ? '#334155' : '#ffffff',
            borderColor: darkMode ? '#475569' : '#d1d5db',
            color: darkMode ? '#f8fafc' : '#1f2937'
          }}
        ></textarea>
      </div>
      
      {formStatus.error && (
        <p className={styles.errorMessage} style={{ color: '#ef4444' }}>
          {formStatus.error}
        </p>
      )}
      
      {formStatus.submitted && (
        <p className={styles.successMessage} style={{ color: darkMode ? '#4ade80' : '#16a34a' }}>
          Thank you! Your message has been sent successfully.
        </p>
      )}
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={formStatus.submitting}
        style={{
          backgroundColor: darkMode ? '#60a5fa' : '#2fdce8',
          color: darkMode ? '#0f172a' : '#ffffff',
          opacity: formStatus.submitting ? 0.7 : 1
        }}
      >
        {formStatus.submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <div 
              className={styles.infoContainer}
              style={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 
                className={styles.infoTitle}
                style={{ color: darkMode ? '#f8fafc' : '#1f2937' }}
              >
                Contact Information
              </h3>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div 
                    className={styles.infoIcon}
                    style={{ backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)' }}
                  >
                    <FontAwesomeIcon icon={faMapLocation} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 
                      className={styles.infoHeading}
                      style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}
                    >
                      Office Address
                    </h4>
                    <p 
                      className={styles.infoText}
                      style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}
                    >
                      {contactInfo?.affiliation?.department || ''}<br />
                      {contactInfo?.affiliation?.institution || ''}<br />
                      {contactInfo?.location?.address || ''}<br />
                      {contactInfo?.location?.city ? `${contactInfo.location.city}, ${contactInfo.location.state || ''} ${contactInfo.location.postalCode || ''}` : ''}
                    </p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div 
                    className={styles.infoIcon}
                    style={{ backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)' }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 
                      className={styles.infoHeading}
                      style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}
                    >
                      Email
                    </h4>
                    <p 
                      className={styles.infoText}
                      style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}
                    >
                      {contactInfo?.email || 'utkarsh.gupta@uconn.edu'}
                    </p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div 
                    className={styles.infoIcon}
                    style={{ backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)' }}
                  >
                    <FontAwesomeIcon icon={faPhone} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 
                      className={styles.infoHeading}
                      style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}
                    >
                      Phone
                    </h4>
                    <p 
                      className={styles.infoText}
                      style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}
                    >
                      {contactInfo?.phoneNumber || '+1 (860) 818-6602'}
                    </p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div 
                    className={styles.infoIcon}
                    style={{ backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)' }}
                  >
                    <FontAwesomeIcon icon={faTimeline} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 
                      className={styles.infoHeading}
                      style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}
                    >
                      Office Hours
                    </h4>
                    <p 
                      className={styles.infoText}
                      style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}
                    >
                      {contactInfo?.affiliation?.officeHours || 'Monday - Friday: 9:00 AM - 5:00 PM'}<br />
                      By appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Academic Profiles */}
            <div 
              className={styles.profilesContainer}
              style={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 
                className={styles.profilesTitle}
                style={{ color: darkMode ? '#f8fafc' : '#1f2937' }}
              >
                Academic Profiles
              </h3>
              
              <div className={styles.profilesList}>
                {contactInfo?.socialMedia?.linkedin && (
                  <a 
                    href={contactInfo.socialMedia.linkedin} 
                    className={styles.profileLink}
                    style={{
                      backgroundColor: darkMode ? '#334155' : '#f3f4f6',
                      color: darkMode ? '#e2e8f0' : '#1f2937'
                    }}
                  >
                    <span><FaLinkedinIn /> LinkedIn</span>
                  </a>
                )}
                {contactInfo?.socialMedia?.twitter && (
                  <a 
                    href={contactInfo.socialMedia.twitter} 
                    className={styles.profileLink}
                    style={{
                      backgroundColor: darkMode ? '#334155' : '#f3f4f6',
                      color: darkMode ? '#e2e8f0' : '#1f2937'
                    }}
                  >
                    <span><FaTwitter /> Twitter</span>
                  </a>
                )}
                {contactInfo?.socialMedia?.github && (
                  <a 
                    href={contactInfo.socialMedia.github} 
                    className={styles.profileLink}
                    style={{
                      backgroundColor: darkMode ? '#334155' : '#f3f4f6',
                      color: darkMode ? '#e2e8f0' : '#1f2937'
                    }}
                  >
                    <span><FaGithub /> GitHub</span>
                  </a>
                )}
                {contactInfo?.socialMedia?.researchGate && (
                  <a 
                    href={contactInfo.socialMedia.researchGate} 
                    className={styles.profileLink}
                    style={{
                      backgroundColor: darkMode ? '#334155' : '#f3f4f6',
                      color: darkMode ? '#e2e8f0' : '#1f2937'
                    }}
                  >
                    <span><FaResearchgate /> ResearchGate</span>
                  </a>
                )}
                {contactInfo?.socialMedia?.googleScholar && (
                  <a 
                    href={contactInfo.socialMedia.googleScholar} 
                    className={styles.profileLink}
                    style={{
                      backgroundColor: darkMode ? '#334155' : '#f3f4f6',
                      color: darkMode ? '#e2e8f0' : '#1f2937'
                    }}
                  >
                    <span><FaGoogle /> Google Scholar</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div 
          className={styles.mapContainer}
          style={{
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120254.58161449396!2d-74.06157091765019!3d40.68999594905293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e1!3m2!1sen!2sin!4v1746984266291!5m2!1sen!2sin" 
            allowFullScreen 
            className={styles.map} 
            loading="lazy"
            title="Office Location"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;