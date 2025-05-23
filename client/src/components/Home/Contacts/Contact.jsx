import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapLocation, faPhone, faTimeline } from '@fortawesome/free-solid-svg-icons'
import { FaGithub, FaGoogle, FaLinkedinIn, FaResearchgate, FaTwitter } from "react-icons/fa";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { darkMode } = useTheme();
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const formRef = useRef();
  const infoRef = useRef();
  const mapRef = useRef();
  const profileLinksRef = useRef([]);

  // Add profile link to ref array
  const addToProfileLinksRef = (el) => {
    if (el && !profileLinksRef.current.includes(el)) {
      profileLinksRef.current.push(el);
    }
  };

  useEffect(() => {
    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Initial setup
    gsap.set([titleRef.current, subtitleRef.current, formRef.current, infoRef.current, mapRef.current, ...profileLinksRef.current], {
      opacity: 0,
      y: 30
    });

    // Animation sequence
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }
    )
    .fromTo(infoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" },
      "-=0.3"
    )
    .fromTo(profileLinksRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        stagger: 0.05,
        ease: "power2.out"
      },
      "-=0.4"
    )
    .fromTo(mapRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );

    // Form input focus animations
    const inputs = formRef.current?.querySelectorAll('input, textarea');
    if (inputs) {
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          gsap.to(input, {
            boxShadow: darkMode ? '0 0 0 3px rgba(96, 165, 250, 0.3)' : '0 0 0 3px rgba(47, 220, 232, 0.3)',
            duration: 0.3
          });
        });
        
        input.addEventListener('blur', () => {
          gsap.to(input, {
            boxShadow: 'none',
            duration: 0.3
          });
        });
      });
    }

    // Submit button hover animation
    const submitButton = formRef.current?.querySelector('button');
    if (submitButton) {
      submitButton.addEventListener('mouseenter', () => {
        gsap.to(submitButton, {
          y: -2,
          duration: 0.2
        });
      });
      
      submitButton.addEventListener('mouseleave', () => {
        gsap.to(submitButton, {
          y: 0,
          duration: 0.2
        });
      });
    }

    // Profile links hover animations
    profileLinksRef.current.forEach(link => {
      const icon = link.querySelector('i');
      
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          y: -3,
          duration: 0.2
        });
        gsap.to(icon, {
          scale: 1.2,
          duration: 0.2
        });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          y: 0,
          duration: 0.2
        });
        gsap.to(icon, {
          scale: 1,
          duration: 0.2
        });
      });
    });

    // Map load animation
    const map = mapRef.current?.querySelector('iframe');
    if (map) {
      map.addEventListener('load', () => {
        gsap.fromTo(map,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 }
        );
      });
    }

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, [darkMode]);

  // Dark mode transition animation
  useEffect(() => {
    // Section background transition
    gsap.to(sectionRef.current, {
      backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
      duration: 0.8,
      ease: 'power2.inOut'
    });

    // Title and subtitle transitions
    gsap.to(titleRef.current, {
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    gsap.to(subtitleRef.current, {
      color: darkMode ? '#94a3b8' : '#4b5563',
      duration: 0.6
    });

    // Form container transition
    const formContainer = formRef.current;
    if (formContainer) {
      gsap.to(formContainer, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });

      // Form elements
      const formTitle = formContainer.querySelector('h3');
      const formLabels = formContainer.querySelectorAll('label');
      const formInputs = formContainer.querySelectorAll('input, textarea');
      
      if (formTitle) gsap.to(formTitle, { color: darkMode ? '#f8fafc' : '#1f2937', duration: 0.6 });
      
      formLabels.forEach(label => {
        gsap.to(label, {
          color: darkMode ? '#e2e8f0' : '#374151',
          duration: 0.6
        });
      });
      
      formInputs.forEach(input => {
        gsap.to(input, {
          backgroundColor: darkMode ? '#334155' : '#ffffff',
          borderColor: darkMode ? '#475569' : '#d1d5db',
          color: darkMode ? '#f8fafc' : '#1f2937',
          duration: 0.6
        });
      });
      
      // Submit button
      const submitButton = formContainer.querySelector('button');
      if (submitButton) {
        gsap.to(submitButton, {
          backgroundColor: darkMode ? '#60a5fa' : '#2fdce8',
          color: darkMode ? '#0f172a' : '#ffffff',
          duration: 0.6
        });
      }
    }

    // Info container transition
    const infoContainer = infoRef.current?.querySelector(`.${styles.infoContainer}`);
    if (infoContainer) {
      gsap.to(infoContainer, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });

      // Info elements
      const infoTitle = infoContainer.querySelector('h3');
      const infoItems = infoContainer.querySelectorAll(`.${styles.infoItem}`);
      
      if (infoTitle) gsap.to(infoTitle, { color: darkMode ? '#f8fafc' : '#1f2937', duration: 0.6 });
      
      infoItems.forEach(item => {
        const heading = item.querySelector('h4');
        const text = item.querySelector('p');
        const iconContainer = item.querySelector(`.${styles.infoIcon}`);
        
        if (heading) gsap.to(heading, { color: darkMode ? '#e2e8f0' : '#1f2937', duration: 0.6 });
        if (text) gsap.to(text, { color: darkMode ? '#94a3b8' : '#4b5563', duration: 0.6 });
        if (iconContainer) {
          gsap.to(iconContainer, {
            backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)',
            duration: 0.6
          });
        }
      });
    }

    // Profiles container transition
    const profilesContainer = infoRef.current?.querySelector(`.${styles.profilesContainer}`);
    if (profilesContainer) {
      gsap.to(profilesContainer, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });

      // Profiles elements
      const profilesTitle = profilesContainer.querySelector('h3');
      if (profilesTitle) gsap.to(profilesTitle, { color: darkMode ? '#f8fafc' : '#1f2937', duration: 0.6 });
      
      const profileLinks = profilesContainer.querySelectorAll('a');
      profileLinks.forEach(link => {
        gsap.to(link, {
          backgroundColor: darkMode ? '#334155' : '#f3f4f6',
          color: darkMode ? '#e2e8f0' : '#1f2937',
          duration: 0.6
        });
      });
    }

    // Map container transition
    if (mapRef.current) {
      gsap.to(mapRef.current, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });
    }

    // Decorative elements transition
    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)',
        duration: 0.8
      });
    }
  }, [darkMode]);

  return (
    <section id="contact" className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle} ref={titleRef}>Get in Touch</h2>
        <p className={styles.sectionSubtitle} ref={subtitleRef}>
          Feel free to reach out for research collaborations, speaking engagements, or academic inquiries.
        </p>
        
        <div className={styles.grid}>
          {/* Contact Form */}
          <div className={styles.formContainer} ref={formRef}>
            <h3 className={styles.formTitle}>Send a Message</h3>
            
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className={styles.formInput}
                  placeholder="Your name"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className={styles.formInput}
                  placeholder="Your email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.formLabel}>Phone</label>
                <input 
                  type="phone" 
                  id="phone" 
                  className={styles.formInput}
                  placeholder="Your phone address"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="organization" className={styles.formLabel}>Organization Name</label>
                <input 
                  type="name" 
                  id="org" 
                  className={styles.formInput}
                  placeholder="Your organization name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className={styles.formInput}
                  placeholder="Message subject"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  className={styles.formTextarea}
                  placeholder="Your message"
                ></textarea>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div ref={infoRef}>
            <div className={styles.infoContainer}>
              <h3 className={styles.infoTitle}>Contact Information</h3>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faMapLocation} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 className={styles.infoHeading}>Office Address</h4>
                    <p className={styles.infoText}>
                      Department of Neuroscience<br />
                      Stanford University<br />
                      290 Jane Stanford Way<br />
                      Stanford, CA 94305
                    </p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 className={styles.infoHeading}>Email</h4>
                    <p className={styles.infoText}>emily.richardson@stanford.edu</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faPhone} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 className={styles.infoHeading}>Phone</h4>
                    <p className={styles.infoText}>+1 (650) 723-4000</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faTimeline} className={styles.fIcon} />
                  </div>
                  <div>
                    <h4 className={styles.infoHeading}>Office Hours</h4>
                    <p className={styles.infoText}>
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      By appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Academic Profiles */}
            <div className={styles.profilesContainer}>
              <h3 className={styles.profilesTitle}>Academic Profiles</h3>
              
              <div className={styles.profilesList}>
                <a href="#" className={styles.profileLink} ref={addToProfileLinksRef}>
                  <FaGoogle />
                  <i className="ri-google-fill mr-2"></i>
                  <span>Google Scholar</span>
                </a>
                
                <a href="https://www.linkedin.com/in/utkarshgupta8/" className={styles.profileLink} ref={addToProfileLinksRef}>
                  <FaLinkedinIn />
                  <i className="ri-linkedin-fill mr-2"></i>
                  <span>LinkedIn</span>
                </a>
                
                <a href="#" className={styles.profileLink} ref={addToProfileLinksRef}>
                  <FaGithub />
                  <i className="ri-github-fill mr-2"></i>
                  <span>GitHub</span>
                </a>
                
                <a href="#" className={styles.profileLink} ref={addToProfileLinksRef}>
                  <FaTwitter />
                  <i className="ri-twitter-x-fill mr-2"></i>
                  <span>Twitter</span>
                </a>
                
                <a href="#" className={styles.profileLink} ref={addToProfileLinksRef}>
                  <FaResearchgate />
                  <i className="ri-research-line mr-2"></i>
                  <span>ResearchGate</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className={styles.mapContainer} ref={mapRef}>
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