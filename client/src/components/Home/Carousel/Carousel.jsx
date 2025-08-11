import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Carousel.module.css";

const academicEvents = [
  {
    title: "International Conference Presentation",
    description: "Presenting my paper on AI applications in healthcare at IEEE ICASSP 2023, London.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    date: "June 2023",
    venue: "London, UK"
  },
  {
    title: "Doctoral Symposium",
    description: "Participating in the annual doctoral symposium at my university, discussing interdisciplinary research approaches.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    date: "March 2023",
    venue: "University Campus"
  },
  {
    title: "Research Collaboration Meeting",
    description: "Working session with international collaborators on our joint NSF-funded project.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    date: "January 2024",
    venue: "MIT, Cambridge"
  },
  {
    title: "Keynote Speech",
    description: "Delivering keynote at Young Researchers Forum on sustainable technology innovations.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1412&q=80",
    date: "November 2023",
    venue: "Berlin, Germany"
  }
];

const Carousel = () => {
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    let animationFrame;
    let startTimestamp;
    let progress = 0;
    const duration = 20000; // 20 seconds for full scroll

    const animateScroll = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      
      if (!isHovered) {
        progress = (elapsed / duration) % 1;
        carousel.scrollLeft = progress * scrollWidth;
        
        // Update current index based on scroll position
        const itemWidth = carousel.firstChild?.offsetWidth + 32;
        const newIndex = Math.round(carousel.scrollLeft / itemWidth) % academicEvents.length;
        setCurrentIndex(newIndex);
      }
      
      animationFrame = requestAnimationFrame(animateScroll);
    };

    animationFrame = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered]);

  const scrollToItem = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const itemWidth = carousel.firstChild?.offsetWidth + 32;
    carousel.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carouselSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Academic Engagements</h2>
        <p className={styles.sectionSubtitle}>Highlighting my scholarly activities and contributions</p>
      </div>
      
      <div 
        className={styles.carouselWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          ref={carouselRef}
          className={styles.carouselContainer}
          whileTap={{ cursor: "grabbing" }}
        >
          {[...academicEvents, ...academicEvents].map((event, index) => (
            <motion.div
              key={`${event.title}-${index}`}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.imageContainer}>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className={styles.image} 
                  loading="lazy"
                />
                <div className={styles.dateBadge}>
                  <span>{event.date}</span>
                </div>
              </div>
              <div className={styles.contentOverlay}>
                <div className={styles.content}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className={styles.venue}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className={styles.gradientOverlayLeft} />
        <div className={styles.gradientOverlayRight} />
        
        <div className={styles.navigationDots}>
          {academicEvents.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex % academicEvents.length ? styles.activeDot : ''}`}
              onClick={() => scrollToItem(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;