import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../../context/ThemeContext';
import profile from '../../../assets/Utkarsh_Short.jpg';
import styles from './Hero.module.css';

const Hero = () => {
  const { darkMode } = useTheme();
  const heroRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const descriptionRef = useRef();
  const buttonsRef = useRef();
  const imageRef = useRef();
  const circle1Ref = useRef();
  const circle2Ref = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial setup (hidden state)
    gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, imageRef.current], {
      opacity: 0,
      y: 20
    });
    gsap.set([circle1Ref.current, circle2Ref.current], { scale: 0 });

    // Animation sequence
    tl.from(heroRef.current, {
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      duration: 0.8
    })
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, 0.2)
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, 0.4)
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, 0.6)
    .to(buttonsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1
    }, 0.8)
    .to(imageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    }, 0.6)
    .to(circle1Ref.current, {
      scale: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    }, 0.2)
    .to(circle2Ref.current, {
      scale: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    }, 0.4);

    // Continuous subtle animations
    gsap.to(circle1Ref.current, {
      x: '+=10',
      y: '+=5',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(circle2Ref.current, {
      x: '-=15',
      y: '-=10',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Button hover effects
    const buttons = buttonsRef.current?.children;
    if (buttons) {
      Array.from(buttons).forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            y: -3,
            duration: 0.3
          });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            y: 0,
            duration: 0.3
          });
        });
      });
    }
  }, [darkMode]);

  // Dark mode transition animation
  useEffect(() => {
    gsap.to(heroRef.current, {
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      duration: 0.8,
      ease: 'power2.inOut'
    });

    gsap.to(titleRef.current, {
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    gsap.to([subtitleRef.current, descriptionRef.current], {
      color: darkMode ? '#94a3b8' : '#4b5563',
      duration: 0.6
    });

    gsap.to('.hero-button', {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderColor: darkMode ? '#334155' : '#d1d5db',
      color: darkMode ? '#f8fafc' : '#1f2937',
      duration: 0.6
    });

    gsap.to('.hero-primary-button', {
      backgroundColor: darkMode ? '#60a5fa' : '#2fdce8',
      duration: 0.6
    });

    gsap.to([circle1Ref.current, circle2Ref.current], {
      backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(47, 220, 232, 0.2)',
      duration: 0.8
    });
  }, [darkMode]);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title} ref={titleRef}>Mr. Utkarsh Gupta</h1>
          <p className={styles.subtitle} ref={subtitleRef}>Associate Consultant & Data Analytics Professional</p>
          <p className={styles.description} ref={descriptionRef}>
            MBA in Business Analytics (STEM) | Expert in Product Analytics, A/B Testing & Data Visualization
          </p>
          <div className={styles.buttonGroup} ref={buttonsRef}>
            <a href="#contact" className={`${styles.primaryButton} hero-primary-button`}>Get in Touch</a>
            <a href="#cv" className={`${styles.secondaryButton} hero-button`}>View CV</a>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper} ref={imageRef}>
            <img 
              src={profile} 
              alt="Utkarsh Gupta" 
              className={styles.image}
            />
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className={styles.gradientOverlay}></div>
      <div className={styles.decorativeCircle1} ref={circle1Ref}></div>
      <div className={styles.decorativeCircle2} ref={circle2Ref}></div>
    </section>
  );
};

export default Hero;