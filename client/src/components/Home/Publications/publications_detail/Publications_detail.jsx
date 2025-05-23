import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../../../context/ThemeContext';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Publications_details.module.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const PublicationsDetail = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const sectionRef = useRef();
  const titleRef = useRef();
  const cardRef = useRef();
  
  // Publication data - in a real app, this would come from an API or context
  const publication = {
    id: 1,
    type: 'Journal Article',
    year: '2024',
    title: 'Neural Mechanisms of Predictive Coding in Visual Cortex',
    authors: 'Richardson, E., Johnson, K., & Martinez, A.',
    journal: 'Nature Neuroscience, 27(4), 512-526',
    abstract: 'This study investigates the neural mechanisms underlying predictive coding in the visual cortex. We combined computational modeling with high-resolution fMRI to demonstrate how the brain generates and updates predictions during visual perception. Our results show distinct patterns of neural activity in early versus higher visual areas, with prediction errors propagating hierarchically through the visual system. These findings provide strong empirical support for predictive coding theories of perception and suggest specific computational roles for different visual areas.',
    tags: ['Predictive Coding', 'Visual Cortex', 'Neural Computation', 'fMRI', 'Computational Modeling'],
    citations: 87,
    doi: '10.1038/s41593-024-01585-8',
    volume: '27',
    issue: '4',
    pages: '512-526',
    publisher: 'Nature Publishing Group',
    url: 'https://www.nature.com/articles/s41593-024-01585-8',
    pdf: '/publications/richardson2024predictive.pdf'
  };

  // Animation setup
  useEffect(() => {
    // Set initial colors based on darkMode before animations
    if (sectionRef.current) {
      gsap.set(sectionRef.current, {
        backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
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
    gsap.set([titleRef.current, cardRef.current], {
      opacity: 0,
      y: 30
    });

    // Animation sequence
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        ease: "back.out(1.2)"
      },
      "-=0.4"
    );

    // Dark mode transition animation
    const handleDarkModeChange = () => {
      // Section background transition
      gsap.to(sectionRef.current, {
        backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
        duration: 0.8,
        ease: 'power2.inOut'
      });

      // Title transition
      gsap.to(titleRef.current, {
        color: darkMode ? '#f8fafc' : '#1f2937',
        duration: 0.6
      });

      // Decorative elements transition
      gsap.to(sectionRef.current, {
        '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)',
        duration: 0.8
      });
    };

    handleDarkModeChange();

    return () => {
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, [darkMode, id]);

  return (
    <section 
      id="publication-detail" 
      className={`${styles.section} ${darkMode ? styles.dark : ''}`} 
      ref={sectionRef}
    >
      <div className={styles.container}>
        <a href="#" className={styles.backButton} onClick={(e) => { e.preventDefault(); navigate(-1); }}>
          <i className="ri-arrow-left-line mr-2"></i>
          Back to Publications
        </a>
        
        <center>
          <h2 className={styles.sectionTitle} ref={titleRef}>Publication Details</h2>
        </center>
        
        <div className={styles.publicationDetailCard} ref={cardRef}>
          <p className={styles.publicationType}>{publication.type} • {publication.year}</p>
          <h3 className={styles.publicationTitle}>{publication.title}</h3>
          <p className={styles.publicationAuthors}>{publication.authors}</p>
          <p className={styles.publicationJournal}>{publication.journal}</p>
          
          <div className={styles.publicationAbstract}>
            <p className={styles.publicationAbstractTitle}>Abstract</p>
            {publication.abstract}
          </div>
          
          <div className={styles.tagsContainer}>
            {publication.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
          
          <div className={styles.detailsContainer}>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Volume</p>
              <p className={styles.detailValue}>{publication.volume}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Issue</p>
              <p className={styles.detailValue}>{publication.issue}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Pages</p>
              <p className={styles.detailValue}>{publication.pages}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Publisher</p>
              <p className={styles.detailValue}>{publication.publisher}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Year</p>
              <p className={styles.detailValue}>{publication.year}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Type</p>
              <p className={styles.detailValue}>{publication.type}</p>
            </div>
          </div>
          
          <div className={styles.linksContainer}>
            <a href={publication.pdf} className={styles.link} target="_blank" rel="noopener noreferrer">
              <i className="ri-file-pdf-line"></i>
              <span>Download PDF</span>
            </a>
            <a href={publication.url} className={styles.link} target="_blank" rel="noopener noreferrer">
              <i className="ri-external-link-line"></i>
              <span>View Online</span>
            </a>
            <a href={`https://doi.org/${publication.doi}`} className={styles.link} target="_blank" rel="noopener noreferrer">
              <i className="ri-links-line"></i>
              <span>DOI: {publication.doi}</span>
            </a>
            <a href={`https://scholar.google.com/scholar?q=${encodeURIComponent(publication.title)}`} className={styles.link} target="_blank" rel="noopener noreferrer">
              <i className="ri-search-line"></i>
              <span>Google Scholar</span>
            </a>
          </div>
          
          <div className={styles.citationContainer}>
            <div className={styles.citationBox}>
              <p className={styles.citationLabel}>Citations</p>
              <p className={styles.citationCount}>{publication.citations}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicationsDetail;