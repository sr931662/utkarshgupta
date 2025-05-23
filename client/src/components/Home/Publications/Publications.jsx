import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Publications.module.css';
import { Link } from 'react-router-dom';


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Publications = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const filterRef = useRef();
  const publicationsRef = useRef([]);
  const viewAllRef = useRef();

  // Publication data
  const publications = {
    all: [
      {
        id: 1,
        type: 'Journal Article',
        year: '2021',
        title: 'Transforming higher Education through digitalization: Insights, tools, and techniques',
        authors: 'S.L Gupta, N. Kishor, N. Mishra, S. mathur, U. Gupta',
        journal: 'CRC Press',
        tags: ['Education', 'Engineering & Technology'],
        citations: 16,
        doi: "https://doi.org/10.1201/9781003132097"
      },
      {
        id: 2,
        type: 'journal Article',
        year: '2021',
        title: 'Digitalization of Higher Education Using Cloud Computing: Implications, Risks, and Challenges',
        authors: 'S.L Gupta, N. Kishor, N. Mishra, S. mathur, U. Gupta',
        journal: 'Proceedings of the Neural Information Processing Systems (NeurIPS 2023), 3245-3257',
        tags: ['Computer Science', 'Education', 'Politics & International Relations'],
        citations: 6,
        doi: "https://doi.org/10.1201/9781003203070"
      },
      {
        id: 3,
        type: 'Journal Article',
        year: '2016',
        title: 'Transforming higher Education through Digitalization: Insights',
        authors: 'S. mathur, U. Gupta',
        journal: 'Learning 3 (1), 1-20',
        tags: ['Bayesian Inference', 'Perception', 'Learning'],
        citations: 6,
        doi: "https://doi.org/10.1201/9781003132097"
      },
    ],
    journal: [
      {
        id: 1,
        type: 'Journal Article',
        year: '2021',
        title: 'Transforming higher Education through digitalization: Insights, tools, and techniques',
        authors: 'S.L Gupta, N. Kishor, N. Mishra, S. mathur, U. Gupta',
        journal: 'CRC Press',
        tags: ['Education', 'Engineering & Technology'],
        citations: 16,
        doi: "https://doi.org/10.1201/9781003132097"
      },
      {
        id: 2,
        type: 'journal Article',
        year: '2021',
        title: 'Digitalization of Higher Education Using Cloud Computing: Implications, Risks, and Challenges',
        authors: 'S.L Gupta, N. Kishor, N. Mishra, S. mathur, U. Gupta',
        journal: 'Proceedings of the Neural Information Processing Systems (NeurIPS 2023), 3245-3257',
        tags: ['Computer Science', 'Education', 'Politics & International Relations'],
        citations: 6,
        doi: "https://doi.org/10.1201/9781003203070"
      },
    ],
    conference: [
      {
        id: 2,
        type: 'Conference Paper',
        year: '2023',
        title: 'Deep Learning Approaches for Decoding Neural Activity in Decision-Making Tasks',
        authors: 'Richardson, E., Zhang, W., & Patel, S.',
        journal: 'Proceedings of the Neural Information Processing Systems (NeurIPS 2023), 3245-3257',
        tags: ['Deep Learning', 'Neural Decoding', 'Decision-Making'],
        citations: 42
      }
    ],
    book: [
      {
        id: 4,
        type: 'Book Chapter',
        year: '2022',
        title: 'Computational Models of Attention in Health and Disease',
        authors: 'Richardson, E., Miller, J., & Chen, L.',
        journal: 'In: Handbook of Computational Neuroscience (eds. Williams, D. & Garcia, M.), Oxford University Press, pp. 218-243',
        tags: ['Attention', 'Computational Models', 'Neuropsychiatry'],
        citations: 29
      }
    ]
  };

  // Add publication to ref array
  const addToPublicationsRef = (el) => {
    if (el && !publicationsRef.current.includes(el)) {
      publicationsRef.current.push(el);
    }
  };

  // Set initial dark mode state immediately
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.backgroundColor = darkMode ? '#0f172a' : '#f9fafb';
      sectionRef.current.style.setProperty(
        '--color-decorative',
        darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)'
      );
    }
    if (titleRef.current) {
      titleRef.current.style.color = darkMode ? '#f8fafc' : '#1f2937';
    }
    if (subtitleRef.current) {
      subtitleRef.current.style.color = darkMode ? '#94a3b8' : '#4b5563';
    }
  }, []);

  // Main animations and effects
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

    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { color: darkMode ? '#94a3b8' : '#4b5563' });
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
    gsap.set([titleRef.current, subtitleRef.current, filterRef.current, ...publicationsRef.current, viewAllRef.current], {
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
    .fromTo(filterRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo(publicationsRef.current,
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "back.out(1.2)"
      },
      "-=0.3"
    )
    .fromTo(viewAllRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    // Filter button hover animations
    const filterButtons = filterRef.current?.querySelectorAll('button');
    if (filterButtons) {
      filterButtons.forEach(button => {
        // Set initial state
        button.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
        button.style.color = darkMode ? '#e2e8f0' : '#4b5563';
        
        if (button.classList.contains(styles.active)) {
          button.style.color = darkMode ? '#60a5fa' : '#2fdce8';
        }

        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            y: -3,
            duration: 0.2
          });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            y: 0,
            duration: 0.2
          });
        });
      });
    }

    // Publication card hover animations
    publicationsRef.current.forEach(card => {
      // Set initial card styles
      card.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
      card.style.boxShadow = darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)';

      const title = card.querySelector('h3');
      const authors = card.querySelector('p[class*="publicationAuthors"]');
      const journal = card.querySelector('p[class*="publicationJournal"]');
      const type = card.querySelector('p[class*="publicationType"]');
      const tags = card.querySelectorAll('span[class*="tag"]');
      const links = card.querySelectorAll('a');
      const citationBox = card.querySelector('div[class*="citationBox"]');
      const citationLabel = card.querySelector('p[class*="citationLabel"]');
      const citationCount = card.querySelector('p[class*="citationCount"]');

      if (title) title.style.color = darkMode ? '#f8fafc' : '#1f2937';
      if (authors) authors.style.color = darkMode ? '#94a3b8' : '#4b5563';
      if (journal) journal.style.color = darkMode ? '#cbd5e1' : '#374151';
      if (type) type.style.color = darkMode ? '#60a5fa' : '#2fdce8';
      
      tags.forEach(tag => {
        tag.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6';
        tag.style.color = darkMode ? '#e2e8f0' : '#1f2937';
      });

      links.forEach(link => {
        link.style.color = darkMode ? '#60a5fa' : '#2fdce8';
      });

      if (citationBox) {
        citationBox.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6';
      }
      if (citationLabel) citationLabel.style.color = darkMode ? '#94a3b8' : '#6b7280';
      if (citationCount) citationCount.style.color = darkMode ? '#f8fafc' : '#1f2937';

      // Hover animations
      const cardLinks = card.querySelectorAll('a');
      const cardCitationBox = card.querySelector('div[class*="citationBox"]');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          duration: 0.3
        });
        gsap.to(cardLinks, {
          x: 3,
          duration: 0.3,
          stagger: 0.05
        });
        if (cardCitationBox) {
          gsap.to(cardCitationBox, {
            scale: 1.05,
            duration: 0.3
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3
        });
        gsap.to(cardLinks, {
          x: 0,
          duration: 0.3
        });
        if (cardCitationBox) {
          gsap.to(cardCitationBox, {
            scale: 1,
            duration: 0.3
          });
        }
      });
    });

    // View all button
    const viewAllButton = viewAllRef.current?.querySelector('a');
    if (viewAllButton) {
      viewAllButton.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
      viewAllButton.style.borderColor = darkMode ? '#334155' : '#d1d5db';
      viewAllButton.style.color = darkMode ? '#f8fafc' : '#1f2937';
      
      const viewAllIcon = viewAllRef.current?.querySelector('i');
      if (viewAllIcon) {
        gsap.set(viewAllIcon, { x: 0 });
        
        viewAllButton.addEventListener('mouseenter', () => {
          gsap.to(viewAllIcon, {
            x: 5,
            duration: 0.3
          });
        });
        
        viewAllButton.addEventListener('mouseleave', () => {
          gsap.to(viewAllIcon, {
            x: 0,
            duration: 0.3
          });
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, [activeTab, darkMode]);

  // Dark mode transition animation
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

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

    // Filter buttons transition
    const filterButtons = filterRef.current?.querySelectorAll('button');
    if (filterButtons) {
      gsap.to(filterButtons, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#e2e8f0' : '#4b5563',
        duration: 0.6
      });

      const activeButton = filterRef.current?.querySelector(`.${styles.active}`);
      if (activeButton) {
        gsap.to(activeButton, {
          color: darkMode ? '#60a5fa' : '#2fdce8',
          duration: 0.6
        });
      }
    }

    // Publications cards transition
    publicationsRef.current.forEach(card => {
      gsap.to(card, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });

      const title = card.querySelector('h3');
      const authors = card.querySelector('p[class*="publicationAuthors"]');
      const journal = card.querySelector('p[class*="publicationJournal"]');
      const type = card.querySelector('p[class*="publicationType"]');
      const tags = card.querySelectorAll('span[class*="tag"]');
      const links = card.querySelectorAll('a');
      const citationBox = card.querySelector('div[class*="citationBox"]');
      const citationLabel = card.querySelector('p[class*="citationLabel"]');
      const citationCount = card.querySelector('p[class*="citationCount"]');

      if (title) gsap.to(title, { color: darkMode ? '#f8fafc' : '#1f2937', duration: 0.6 });
      if (authors) gsap.to(authors, { color: darkMode ? '#94a3b8' : '#4b5563', duration: 0.6 });
      if (journal) gsap.to(journal, { color: darkMode ? '#cbd5e1' : '#374151', duration: 0.6 });
      if (type) gsap.to(type, { color: darkMode ? '#60a5fa' : '#2fdce8', duration: 0.6 });
      
      tags.forEach(tag => {
        gsap.to(tag, {
          backgroundColor: darkMode ? '#334155' : '#f3f4f6',
          color: darkMode ? '#e2e8f0' : '#1f2937',
          duration: 0.6
        });
      });

      links.forEach(link => {
        gsap.to(link, {
          color: darkMode ? '#60a5fa' : '#2fdce8',
          duration: 0.6
        });
      });

      if (citationBox) {
        gsap.to(citationBox, {
          backgroundColor: darkMode ? '#334155' : '#f3f4f6',
          duration: 0.6
        });
      }
      if (citationLabel) gsap.to(citationLabel, { color: darkMode ? '#94a3b8' : '#6b7280', duration: 0.6 });
      if (citationCount) gsap.to(citationCount, { color: darkMode ? '#f8fafc' : '#1f2937', duration: 0.6 });
    });

    // View all button transition
    const viewAllButton = viewAllRef.current?.querySelector('a');
    if (viewAllButton) {
      gsap.to(viewAllButton, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        borderColor: darkMode ? '#334155' : '#d1d5db',
        color: darkMode ? '#f8fafc' : '#1f2937',
        duration: 0.6
      });
    }

    // Decorative elements transition
    const section = sectionRef.current;
    if (section) {
      gsap.to(section, {
        '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)',
        duration: 0.8
      });
    }
  }, [darkMode]);

  return (
    <section 
      id="publications" 
      className={`${styles.section} ${darkMode ? styles.dark : ''}`} 
      ref={sectionRef}
    >
      <div className={styles.container}>
        <center>
          <h2 className={styles.sectionTitle} ref={titleRef}>Publications</h2>
        </center>
        <p className={styles.sectionSubtitle} ref={subtitleRef}>
          Selected peer-reviewed articles, conference papers, and book chapters from my research career.
        </p>
        
        {/* Publication Filters */}
        <div className={styles.filterContainer} ref={filterRef}>
          <button 
            className={`${styles.filterButton} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Publications
          </button>
          <button 
            className={`${styles.filterButton} ${activeTab === 'journal' ? styles.active : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            Journal Articles
          </button>
          <button 
            className={`${styles.filterButton} ${activeTab === 'conference' ? styles.active : ''}`}
            onClick={() => setActiveTab('conference')}
          >
            Conference Papers
          </button>
          <button 
            className={`${styles.filterButton} ${activeTab === 'book' ? styles.active : ''}`}
            onClick={() => setActiveTab('book')}
          >
            Book Chapters
          </button>
        </div>
        
        {/* Publications List */}
        <div className={styles.publicationsList}>
          {publications[activeTab].map(publication => (
            <div key={publication.id} className={styles.publicationCard} ref={addToPublicationsRef}>
              <div className={styles.publicationContent}>
                <p className={styles.publicationType}>{publication.type} • {publication.year}</p>
                <h3 className={styles.publicationTitle}><Link to="/publications-detail" >{publication.title}</Link></h3>
                <p className={styles.publicationAuthors}>{publication.authors}</p>
                <p className={styles.publicationJournal}>{publication.journal}</p>
                <div className={styles.tagsContainer}>
                  {publication.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.linksContainer}>
                  <a href="#" className={styles.link}>
                    <i className="ri-file-pdf-line mr-1"></i>
                    <span>PDF</span>
                  </a>
                  <a href={publication.doi} className={styles.link}>
                    <i className="ri-links-line mr-1"></i>
                    <span>DOI</span>
                  </a>
                </div>
              </div>
              <div className={styles.citationContainer}>
                <div className={styles.citationBox}>
                  <p className={styles.citationLabel}>Citations</p>
                  <p className={styles.citationCount}>{publication.citations}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;