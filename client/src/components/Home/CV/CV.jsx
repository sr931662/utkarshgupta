import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../../context/ThemeContext';
import styles from './CV.module.css';
import CV_file from "../../../assets/Files/Current_Resume.docx"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const CV = () => {
  const { darkMode } = useTheme();
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const downloadRef = useRef();
  const timelineRefs = useRef([]);
  const skillCardsRef = useRef([]);

  // Add timeline item to ref array
  const addToTimelineRefs = (el) => {
    if (el && !timelineRefs.current.includes(el)) {
      timelineRefs.current.push(el);
    }
  };

  // Add skill card to ref array
  const addToSkillCardsRef = (el) => {
    if (el && !skillCardsRef.current.includes(el)) {
      skillCardsRef.current.push(el);
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
    if (subtitleRef.current) {
      subtitleRef.current.style.color = darkMode ? '#94a3b8' : '#4b5563';
    }
  }, []);

  // Main animations and effects
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
    gsap.set([titleRef.current, subtitleRef.current, downloadRef.current, ...timelineRefs.current, ...skillCardsRef.current], {
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
    .fromTo(downloadRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      }
    )
    .fromTo(timelineRefs.current,
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
    .fromTo(skillCardsRef.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power2.out"
      },
      "-=0.4"
    );

    // Download button
    const downloadButton = downloadRef.current?.querySelector('a');
    if (downloadButton) {
      downloadButton.style.backgroundColor = darkMode ? '#60a5fa' : '#2fdce8';
      
      const downloadIcon = downloadRef.current?.querySelector('i');
      if (downloadIcon) {
        gsap.set(downloadIcon, { y: 0 });
        
        downloadButton.addEventListener('mouseenter', () => {
          gsap.to(downloadIcon, {
            y: -3,
            duration: 0.3
          });
        });
        
        downloadButton.addEventListener('mouseleave', () => {
          gsap.to(downloadIcon, {
            y: 0,
            duration: 0.3
          });
        });
      }
    }

    // Timeline items
    timelineRefs.current.forEach(item => {
      const card = item.querySelector(`.${styles.timelineCard}`);
      const dot = item.querySelector(`.${styles.timelineDot}`);
      
      // Set initial styles
      if (card) {
        card.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
        card.style.boxShadow = darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      }

      // Hover animations
      item.addEventListener('mouseenter', () => {
        if (card) {
          gsap.to(card, {
            y: -5,
            duration: 0.3
          });
        }
        if (dot) {
          gsap.to(dot, {
            scale: 1.2,
            duration: 0.3
          });
        }
      });
      
      item.addEventListener('mouseleave', () => {
        if (card) {
          gsap.to(card, {
            y: 0,
            duration: 0.3
          });
        }
        if (dot) {
          gsap.to(dot, {
            scale: 1,
            duration: 0.3
          });
        }
      });
    });

    // Skill cards
    skillCardsRef.current.forEach(card => {
      // Set initial styles
      card.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
      card.style.boxShadow = darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)';

      const icon = card.querySelector(`.${styles.skillIcon} i`);
      
      // Hover animations
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          duration: 0.3
        });
        if (icon) {
          gsap.to(icon, {
            rotation: 10,
            duration: 0.3
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3
        });
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            duration: 0.3
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, [darkMode]);

  // Dark mode transition animation
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    // Background transition
    gsap.to(sectionRef.current, {
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      duration: 0.8,
      ease: 'power2.inOut'
    });

    // Text color transitions
    gsap.to(titleRef.current, {
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    gsap.to(subtitleRef.current, {
      color: darkMode ? '#94a3b8' : '#4b5563',
      duration: 0.6
    });

    // Download button transition
    const downloadButton = downloadRef.current?.querySelector('a');
    if (downloadButton) {
      gsap.to(downloadButton, {
        backgroundColor: darkMode ? '#60a5fa' : '#2fdce8',
        duration: 0.6
      });
    }

    // Timeline items transition
    const timelineCards = document.querySelectorAll(`.${styles.timelineCard}`);
    timelineCards.forEach(card => {
      gsap.to(card, {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        duration: 0.6
      });
    });

    gsap.to(`.${styles.timelineHeading}`, {
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    gsap.to(`.${styles.timelineInstitution}`, {
      color: darkMode ? '#cbd5e1' : '#374151',
      duration: 0.6
    });

    gsap.to(`.${styles.timelineList} li`, {
      color: darkMode ? '#94a3b8' : '#4b5563',
      duration: 0.6
    });

    // Skill cards transition
    gsap.to(`.${styles.skillCard}`, {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      boxShadow: darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      duration: 0.6
    });

    gsap.to(`.${styles.skillHeading}`, {
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    gsap.to(`.${styles.skillItem}`, {
      color: darkMode ? '#94a3b8' : '#4b5563',
      duration: 0.6
    });

    // Decorative elements transition
    gsap.to(sectionRef.current, {
      '--color-decorative': darkMode ? 'rgba(96, 165, 250, 0.05)' : 'rgba(47, 220, 232, 0.05)',
      duration: 0.8
    });
  }, [darkMode]);

  return (
    <section id="cv" className={`${styles.section} ${darkMode ? styles.dark : ''}`} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle} ref={titleRef}>Professional Experience</h2>
        <p className={styles.sectionSubtitle} ref={subtitleRef}>
          A summary of my professional journey, key achievements, and technical expertise.
        </p>
        
        <div className={styles.downloadContainer} ref={downloadRef}>
          <a href={CV_file} className={styles.downloadButton} download>
            <i className="ri-download-line mr-2"></i>
            <span>Download Full CV (PDF)</span>
          </a>
        </div>
        
        <div className={styles.grid}>
          {/* Professional Experience */}
          <div>
            <h3 className={styles.timelineTitle}>Work Experience</h3>
            
            <div className={styles.timeline}>
              {/* Experience Item 1 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>Jun 2021 - Present</p>
                  <h4 className={styles.timelineHeading}>Associate Consultant</h4>
                  <p className={styles.timelineInstitution}>LatentView Analytics, San Francisco, US</p>
                  <ul className={styles.timelineList}>
                    <li>Consult multiple PMs in prioritizing and planning production of product features by providing insights into viewers journey on YouTube platform for top 8 global markets</li>
                    <li>Performed analysis to understand user behavior before and after YouTube replaced a key button on the mobile home page</li>
                    <li>Developed OEC (Overall Evaluation Criteria) for newly launched YouTube Shopping channel by evaluating multiple e-commerce and entertainment metrics</li>
                  </ul>
                </div>
              </div>
              
              {/* Experience Item 2 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>Jan 2021 - May 2021</p>
                  <h4 className={styles.timelineHeading}>Product Analytics Manager (Internship)</h4>
                  <p className={styles.timelineInstitution}>Surfly</p>
                  <ul className={styles.timelineList}>
                    <li>Identified new advanced analytics feature based on market research and defined product vision, requirements, and roadmap</li>
                    <li>Devised Business Intelligence reporting feature by creating interactive dashboards and data visualizations</li>
                  </ul>
                </div>
              </div>
              
              {/* Experience Item 3 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>June 2020 - Oct 2020</p>
                  <h4 className={styles.timelineHeading}>Global Analytics Associate (Internship)</h4>
                  <p className={styles.timelineInstitution}>The Coca-Cola Company</p>
                  <ul className={styles.timelineList}>
                    <li>Increased pipeline analysis efficiency by 84% by building predictive model using statistical and ML methods in R</li>
                    <li>Built interactive Power BI dashboard for stakeholders to assess market share in COVID-affected markets</li>
                  </ul>
                </div>
              </div>

              {/* Experience Item 4 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>Nov 2016 - Mar 2019</p>
                  <h4 className={styles.timelineHeading}>Business Analyst</h4>
                  <p className={styles.timelineInstitution}>Zaid Khalifa Ltd., Muscat, Oman</p>
                  <ul className={styles.timelineList}>
                    <li>Designed MVP and secured $80,000 seed funding from multiple investors</li>
                    <li>Developed pricing structure for restaurants commission through negotiations</li>
                    <li>Grew company from 2 members with negative cash flow to 10 members with positive cash flow</li>
                  </ul>
                </div>
              </div>

              {/* Experience Item 5 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>May 2015 - Nov 2016</p>
                  <h4 className={styles.timelineHeading}>Trainee Decision Scientist</h4>
                  <p className={styles.timelineInstitution}>Mu Sigma Business Solution, Bangalore, India</p>
                  <ul className={styles.timelineList}>
                    <li>Increased email marketing open rate from 6% to 8% through EDA and data processing using SAS, SQL, and Tableau</li>
                    <li>Reduced marketing communication by 20% across channels without revenue impact by modifying CRM strategy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Education */}
          <div>
            <h3 className={styles.timelineTitle}>Education</h3>
            
            <div className={styles.timeline}>
              {/* Education Item 1 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>Aug 2019 - May 2021</p>
                  <h4 className={styles.timelineHeading}>MBA in Business Analytics (STEM)</h4>
                  <p className={styles.timelineInstitution}>University of Connecticut (UConn School of Business)</p>
                  <p className={styles.timelineDescription}>GPA: 3.9/4.0</p>
                </div>
              </div>
              
              {/* Education Item 2 */}
              <div className={styles.timelineItem} ref={addToTimelineRefs}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineCard}>
                  <p className={styles.timelineDate}>July 2011 - April 2015</p>
                  <h4 className={styles.timelineHeading}>Bachelor of Engineering</h4>
                  <p className={styles.timelineInstitution}>Birla Institute of Technology, Mesra, India</p>
                  <p className={styles.timelineDescription}>Electronics and Communication</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills & Expertise */}
        <div className={styles.skillsContainer}>
          <h3 className={styles.skillsTitle}>Skills & Expertise</h3>
          
          <div className={styles.skillsGrid}>
            {/* Technical Skills */}
            <div className={styles.skillCard} ref={addToSkillCardsRef}>
              <div className={styles.skillIcon}>
                <i className="ri-code-s-slash-line ri-xl"></i>
              </div>
              <h4 className={styles.skillHeading}>Technical Tools</h4>
              <ul className={styles.skillList}>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Python, R, SQL</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Power BI, Tableau</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Excel, PowerPoint</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>JIRA</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>SAS</span>
                </li>
              </ul>
            </div>
            
            {/* Analytical Skills */}
            <div className={styles.skillCard} ref={addToSkillCardsRef}>
              <div className={styles.skillIcon}>
                <i className="ri-bar-chart-line ri-xl"></i>
              </div>
              <h4 className={styles.skillHeading}>Analytical Skills</h4>
              <ul className={styles.skillList}>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Data Analysis & Visualization</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Predictive Modeling</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>A/B Testing</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Market Research</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Customer Segmentation</span>
                </li>
              </ul>
            </div>
            
            {/* Business Skills */}
            <div className={styles.skillCard} ref={addToSkillCardsRef}>
              <div className={styles.skillIcon}>
                <i className="ri-lightbulb-flash-line ri-xl"></i>
              </div>
              <h4 className={styles.skillHeading}>Business Skills</h4>
              <ul className={styles.skillList}>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Agile Product Management</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Product Strategy</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Scrum Master</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Digital Marketing</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Competitive Analysis</span>
                </li>
                <li className={styles.skillItem}>
                  <span className={styles.skillBullet}></span>
                  <span>Consumer Insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CV;