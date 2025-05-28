import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../../context/ThemeContext';
import styles from './ResearchInterests.module.css';
import { DiGoogleAnalytics } from "react-icons/di";
import { Si365Datascience } from "react-icons/si";
import { GiJourney } from "react-icons/gi";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ResearchInterest = () => {
  const { darkMode } = useTheme();
  const sectionRef = useRef();
  const titleRef = useRef();
  const cardsRef = useRef([]);
  const footerRef = useRef();
  const linkRef = useRef();

  // Add card to ref array
  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // Set initial dark mode state immediately
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.backgroundColor = darkMode ? '#0f172a' : '#ffffff';
      sectionRef.current.style.setProperty(
        '--color-decorative',
        darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)'
      );
    }
    if (titleRef.current) {
      titleRef.current.style.color = darkMode ? '#f8fafc' : '#1f2937';
    }
    cardsRef.current.forEach(card => {
      card.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
      card.style.borderColor = darkMode ? '#334155' : '#f3f4f6';
      card.style.boxShadow = darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const iconContainer = card.querySelector(`.${styles.iconContainer}`);
      const icon = card.querySelector('i');

      if (title) title.style.color = darkMode ? '#f8fafc' : '#1f2937';
      if (desc) desc.style.color = darkMode ? '#94a3b8' : '#4b5563';
      if (iconContainer) iconContainer.style.backgroundColor = darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)';
      if (icon) icon.style.color = darkMode ? '#60a5fa' : '#2fdce8';
    });
    if (footerRef.current) {
      const summary = footerRef.current.querySelector('p');
      const link = footerRef.current.querySelector('a');
      if (summary) summary.style.color = darkMode ? '#94a3b8' : '#4b5563';
      if (link) link.style.color = darkMode ? '#60a5fa' : '#2fdce8';
    }
  }, []);

  useEffect(() => {
    // Set initial colors based on darkMode before animations
    if (sectionRef.current) {
      gsap.set(sectionRef.current, {
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)'
      });
    }
    if (titleRef.current) {
      gsap.set(titleRef.current, { color: darkMode ? '#f8fafc' : '#1f2937' });
    }

    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Initial setup
    gsap.set([titleRef.current, ...cardsRef.current, footerRef.current], {
      opacity: 0,
      y: 30
    });

    // Animation sequence
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(cardsRef.current, 
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.15,
        ease: "back.out(1.2)"
      },
      "-=0.4"
    )
    .fromTo(footerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    // Card hover animations
    cardsRef.current.forEach(card => {
      const icon = card.querySelector('i');
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');

      // Set initial state
      gsap.set(icon, { y: 5 });
      gsap.set(title, { y: 5 });
      gsap.set(desc, { y: 5 });

      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(icon, { 
          y: -5, 
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(title, { 
          y: -3, 
          duration: 0.3,
          ease: "power2.out",
          delay: 0.05
        });
        gsap.to(desc, { 
          y: -3, 
          duration: 0.3,
          ease: "power2.out",
          delay: 0.1
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(icon, { 
          y: 5, 
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to([title, desc], { 
          y: 5, 
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Link hover animation
    const linkArrow = linkRef.current?.querySelector('i');
    if (linkArrow) {
      gsap.set(linkArrow, { x: 0 });

      linkRef.current.addEventListener('mouseenter', () => {
        gsap.to(linkArrow, {
          x: 5,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      linkRef.current.addEventListener('mouseleave', () => {
        gsap.to(linkArrow, {
          x: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    // Continuous subtle animations for icons
    cardsRef.current.forEach(card => {
      const icon = card.querySelector('i');
      gsap.to(icon, {
        y: "+=3",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, [darkMode]);

  // Dark mode transition animation
  useEffect(() => {
    // Section background transition
    gsap.to(sectionRef.current, {
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      duration: 0.8,
      ease: 'power2.inOut'
    });

    // Title color transition
    gsap.to(titleRef.current, {
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    // Cards transition
    cardsRef.current.forEach(card => {
      gsap.to(card, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        borderColor: darkMode ? '#334155' : '#f3f4f6',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });

      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const iconContainer = card.querySelector(`.${styles.iconContainer}`);
      const icon = card.querySelector('i');

      gsap.to(title, {
        color: darkMode ? '#f8fafc' : '#1f2937',
        duration: 0.6
      });

      gsap.to(desc, {
        color: darkMode ? '#94a3b8' : '#4b5563',
        duration: 0.6
      });

      if (iconContainer) {
        gsap.to(iconContainer, {
          backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(47, 220, 232, 0.1)',
          duration: 0.6
        });
      }

      if (icon) {
        gsap.to(icon, {
          color: darkMode ? '#60a5fa' : '#2fdce8',
          duration: 0.6
        });
      }
    });

    // Footer transitions
    if (footerRef.current) {
      const summary = footerRef.current.querySelector('p');
      const link = footerRef.current.querySelector('a');

      if (summary) {
        gsap.to(summary, {
          color: darkMode ? '#94a3b8' : '#4b5563',
          duration: 0.6
        });
      }

      if (link) {
        gsap.to(link, {
          color: darkMode ? '#60a5fa' : '#2fdce8',
          duration: 0.6
        });
      }
    }

    // Decorative elements transition
    const section = sectionRef.current;
    if (section) {
      gsap.to(section, {
        '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)',
        duration: 0.8
      });
    }
  }, [darkMode, styles]);

  return (
    <section id="interests" className={`${styles.section} ${darkMode ? styles.dark : ''}`} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle} ref={titleRef}>Analytical Focus Areas</h2>
        
        <div className={styles.grid}>
          {/* Focus Area 1 */}
          <div className={styles.card} ref={addToCardsRef}>
            <div className={styles.iconContainer}>
              <DiGoogleAnalytics className={styles.riIcon}/>
            </div>
            <h3 className={styles.cardTitle}>Product Analytics</h3>
            <p className={styles.cardDescription}>
              Leveraging user behavior data to optimize product features and enhance customer experiences. 
              Specializing in A/B testing, funnel analysis, and feature prioritization for digital platforms.
            </p>
          </div>
          
          {/* Focus Area 2 */}
          <div className={styles.card} ref={addToCardsRef}>
            <div className={styles.iconContainer}>
              <Si365Datascience className={styles.riIcon} />
            </div>
            <h3 className={styles.cardTitle}>Data-Driven Decision Making</h3>
            <p className={styles.cardDescription}>
              Developing predictive models and business intelligence solutions to transform raw data into 
              actionable insights that drive strategic decisions and operational efficiency.
            </p>
          </div>
          
          {/* Focus Area 3 */}
          <div className={styles.card} ref={addToCardsRef}>
            <div className={styles.iconContainer}>
              <GiJourney className={styles.riIcon} />
            </div>
            <h3 className={styles.cardTitle}>Customer Journey Analysis</h3>
            <p className={styles.cardDescription}>
              Mapping and analyzing end-to-end customer interactions to identify pain points, 
              optimize conversion paths, and improve overall user engagement across digital platforms.
            </p>
          </div>
        </div>
        
        <div className={styles.footer} ref={footerRef}>
          <p className={styles.summary}>
            My approach combines technical analytics expertise with business acumen to deliver measurable impact. 
            I focus on translating complex data into clear strategic recommendations for product and business growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResearchInterest;