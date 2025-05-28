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
  const [publications, setPublications] = useState({
    all: [],
    journal: [],
    conference: [],
    book: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs remain the same
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const filterRef = useRef();
  const publicationsRef = useRef([]);
  const viewAllRef = useRef();

  // Fetch publications from backend
useEffect(() => {
// Updated fetchPublications function in Publications.jsx
const fetchPublications = async () => {
  try {
    setLoading(true);
    // const response = await fetch('http://localhost:5000/api/publications', {
    const response = await fetch('https://utkarshgupta-1.onrender.com/api/publications', {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${localStorage.getItem('auth')?.token}` // Add auth if needed
      }
    });

    const data = await response.json();

    // Handle the nested response format from your API
    let publicationsArray = [];
    
    if (data?.data?.publications && Array.isArray(data.data.publications)) {
      publicationsArray = data.data.publications;
    } else if (data?.publications && Array.isArray(data.publications)) {
      publicationsArray = data.publications;
    } else if (Array.isArray(data)) {
      publicationsArray = data;
    } else {
      console.warn('Unexpected API response format:', data);
      publicationsArray = [];
    }

    const transformPublication = (pub) => ({
      id: pub._id || Math.random().toString(36).substr(2, 9),
      type: pub.type || 'journal',
      year: pub.year || (pub.publicationDate ? new Date(pub.publicationDate).getFullYear().toString() : '2023'),
      title: pub.title || 'Untitled Publication',
      authors: Array.isArray(pub.authors) ? pub.authors : [pub.authors || 'Unknown Authors'],
      journalOrConference: pub.journalOrConference || 'Unknown Journal',
      tags: pub.tags || [],
      citations: pub.citations || 0,
      doi: pub.doi ? (pub.doi.startsWith('10.') ? `https://doi.org/${pub.doi}` : pub.doi) : null,
      url: pub.url || null,
      volume: pub.volume || '',
      issue: pub.issue || '',
      pages: pub.pages || '',
      abstract: pub.abstract || ''
    });

    // Organize publications
    setPublications({
      all: publicationsArray.map(transformPublication),
      journal: publicationsArray.filter(pub => pub.type?.toLowerCase() === 'journal').map(transformPublication),
      conference: publicationsArray.filter(pub => pub.type?.toLowerCase() === 'conference').map(transformPublication),
      book: publicationsArray.filter(pub => pub.type?.toLowerCase() === 'book').map(transformPublication)
    });

  } catch (err) {
    console.error('Fetch error:', err);
    setError(`Failed to load publications: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
  fetchPublications();
}, []);

  // Add publication to ref array
  const addToPublicationsRef = (el) => {
    if (el && !publicationsRef.current.includes(el)) {
      publicationsRef.current.push(el);
    }
  };

  // Rest of your existing animation and dark mode code remains the same...
  // Just replace the hardcoded publications with the state variable

  if (loading) {
    return (
      <section id="publications" className={`${styles.section} ${darkMode ? styles.dark : ''}`} ref={sectionRef}>
        <div className={styles.container}>
          <center>
            <h2 className={styles.sectionTitle} ref={titleRef}>Publications</h2>
          </center>
          <p className={styles.sectionSubtitle} ref={subtitleRef}>
            Loading publications...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="publications" className={`${styles.section} ${darkMode ? styles.dark : ''}`} ref={sectionRef}>
        <div className={styles.container}>
          <center>
            <h2 className={styles.sectionTitle} ref={titleRef}>Publications</h2>
          </center>
          <p className={styles.sectionSubtitle} ref={subtitleRef}>
            Error loading publications: {error}
          </p>
        </div>
      </section>
    );
  }

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
            <div key={publication._id} className={styles.publicationCard} ref={addToPublicationsRef}>
              <div className={styles.publicationContent}>
                <p className={styles.publicationType}>
                  {publication.type === 'journal' ? 'Journal Article' : 
                   publication.type === 'conference' ? 'Conference Paper' : 
                   'Book Chapter'} • {new Date(publication.publicationDate).getFullYear()}
                </p>
                <h3 className={styles.publicationTitle}>
                  <Link to={`/publications-detail/${publication._id}`}>{publication.title}</Link>
                </h3>
                <p className={styles.publicationAuthors}>
                  {publication.authors.join(', ')}
                </p>
                <p className={styles.publicationJournal}>
                  {publication.journalOrConference}
                  {publication.volume && `, Vol. ${publication.volume}`}
                  {publication.issue && `, Issue ${publication.issue}`}
                  {publication.pages && `, pp. ${publication.pages}`}
                </p>
                <div className={styles.tagsContainer}>
                  {publication.tags?.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.linksContainer}>
                  {publication.url && (
                    <a href={publication.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <i className="ri-file-pdf-line mr-1"></i>
                      <span>View Publication</span>
                    </a>
                  )}
                  {publication.doi && (
                    <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <i className="ri-links-line mr-1"></i>
                      <span>DOI</span>
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.citationContainer}>
                <div className={styles.citationBox}>
                  <p className={styles.citationLabel}>Citations</p>
                  <p className={styles.citationCount}>
                    {publication.citations || 'N/A'}
                  </p>
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