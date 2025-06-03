import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { authAPI } from '../../../context/authAPI';
import styles from './Hero.module.css';
import { gsap } from 'gsap';
import profile from '../../../assets/Utkarsh_Short.jpg'

const Hero = () => {
  const { darkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonGroupRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchSuperadminProfile = async () => {
      try {
        const response = await authAPI.getPublicSuperadmin();
        setProfileData(response.data.user);
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchSuperadminProfile();
  }, []);

  useEffect(() => {
    if (loaded) {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.4 }
      );
      gsap.fromTo(descriptionRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 }
      );
      gsap.fromTo(buttonGroupRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
      );
      gsap.fromTo(imageRef.current, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "elastic.out(1, 0.5)", 
          delay: 0.6 
        }
      );
    }
  }, [loaded]);

  if (!profileData) {
    return (
      <section className={`${styles.hero} ${darkMode ? styles.dark : ''}`} ref={heroRef}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading profile...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.hero} ${darkMode ? styles.dark : ''}`} ref={heroRef}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title} ref={titleRef}>
            {`Mr. ${profileData.name}` || 'Mr. Utkarsh Gupta'}
          </h1>
          <p className={styles.subtitle} ref={subtitleRef}>
            {profileData.professionalTitle || 'Associate Consultant & Data Analytics Professional'}
          </p>
          <div className={styles.buttonGroup} ref={buttonGroupRef}>
            <a href="#contact" className={styles.primaryButton}>Get in Touch</a>
            <a href="#cv" className={styles.secondaryButton}>View CV</a>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper} ref={imageRef}>
            <img 
              src={profile} 
              alt={profileData.name || 'Profile'} 
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;




























// import React, { useState, useEffect, useRef } from 'react';
// import { useTheme } from '../../../context/ThemeContext';
// import { authAPI } from '../../../context/authAPI';
// import styles from './Hero.module.css';

// const Hero = () => {
//   const { darkMode } = useTheme();
//   const [profileData, setProfileData] = useState(null);
//   const [loaded, setLoaded] = useState(false);
//   const heroRef = useRef(null);

//   useEffect(() => {
//     const fetchSuperadminProfile = async () => {
//       try {
//         const response = await authAPI.getPublicSuperadmin();
//         setProfileData(response.data.user);
//         setLoaded(true);
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     fetchSuperadminProfile();
//   }, []);

//   if (!profileData) {
//     return (
//       <section className={styles.hero} ref={heroRef}>
//         <div className={styles.container}>
//           <div className={styles.loading}>Loading profile...</div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className={`${styles.hero} ${loaded ? styles.loaded : ''}`} ref={heroRef}>
//       <div className={styles.container}>
//         <div className={styles.content}>
//           <h1 className={styles.title}>{`Mr. ${profileData.name}` || 'Mr. Utkarsh Gupta'}</h1>
//           <p className={styles.subtitle}>
//             {profileData.professionalTitle || 'Associate Consultant & Data Analytics Professional'}
//           </p>
//           <p className={styles.description}>
//             {profileData.bio || 'MBA in Business Analytics (STEM) | Expert in Product Analytics, A/B Testing & Data Visualization'}
//           </p>
//           <div className={styles.buttonGroup}>
//             <a href="#contact" className={`${styles.primaryButton} hero-primary-button`}>Get in Touch</a>
//             <a href="#cv" className={`${styles.secondaryButton} hero-button`}>View CV</a>
//           </div>
//         </div>
//         <div className={styles.imageContainer}>
//           <div className={styles.imageWrapper}>
//             {profileData.profileImage ? (
//               <img 
//                 src={profileData.profileImage} 
//                 alt={profileData.name || 'Profile'} 
//                 className={styles.image}
//               />
//             ) : (
//               <div className={styles.placeholderImage}>
//                 {profileData.name?.charAt(0)?.toUpperCase() || 'A'}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Decorative Elements */}
//       <div className={styles.gradientOverlay}></div>
//       <div className={styles.decorativeCircle1}></div>
//       <div className={styles.decorativeCircle2}></div>
//     </section>
//   );
// };

// export default Hero;


















// // import React, { useState, useEffect, useRef } from 'react';
// // import { gsap } from 'gsap';
// // import { useTheme } from '../../../context/ThemeContext';
// // import { authAPI } from '../../../context/authAPI';
// // import styles from './Hero.module.css';

// // const Hero = () => {
// //   const { darkMode } = useTheme();
// //   const [profileData, setProfileData] = useState(null);
// //   const heroRef = useRef(null);
// //   const titleRef = useRef(null);
// //   const subtitleRef = useRef(null);
// //   const descriptionRef = useRef(null);
// //   const buttonsRef = useRef(null);
// //   const imageRef = useRef(null);
// //   const circle1Ref = useRef(null);s
// //   const circle2Ref = useRef(null);
// //   const animationRef = useRef(null);

// //   useEffect(() => {
// //     const fetchSuperadminProfile = async () => {
// //       try {
// //         const response = await authAPI.getPublicSuperadmin();
// //         setProfileData(response.data.user);
// //       } catch (error) {
// //         console.error('Error fetching profile:', error);
// //       }
// //     };

// //     fetchSuperadminProfile();
// //   }, []);

// //   useEffect(() => {
// //     // Only initialize animations when all refs are set and profile data is loaded
// //     if (!profileData || 
// //         !heroRef.current || 
// //         !titleRef.current || 
// //         !subtitleRef.current || 
// //         !descriptionRef.current || 
// //         !buttonsRef.current || 
// //         !imageRef.current || 
// //         !circle1Ref.current || 
// //         !circle2Ref.current) {
// //       return;
// //     }

// //     // Clear any existing animations
// //     if (animationRef.current) {
// //       animationRef.current.kill();
// //     }

// //     const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

// //     // Initial setup (hidden state)
// //     gsap.set([
// //       titleRef.current, 
// //       subtitleRef.current, 
// //       descriptionRef.current, 
// //       buttonsRef.current, 
// //       imageRef.current
// //     ], {
// //       opacity: 0,
// //       y: 20
// //     });

// //     gsap.set([circle1Ref.current, circle2Ref.current], { 
// //       scale: 0 
// //     });

// //     // Animation sequence
// //     tl.from(heroRef.current, {
// //       backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
// //       duration: 0.8
// //     })
// //     .to(titleRef.current, {
// //       opacity: 1,
// //       y: 0,
// //       duration: 0.8,
// //       ease: 'back.out(1.5)'
// //     }, 0.2)
// //     .to(subtitleRef.current, {
// //       opacity: 1,
// //       y: 0,
// //       duration: 0.6
// //     }, 0.4)
// //     .to(descriptionRef.current, {
// //       opacity: 1,
// //       y: 0,
// //       duration: 0.6
// //     }, 0.6)
// //     .to(buttonsRef.current, {
// //       opacity: 1,
// //       y: 0,
// //       duration: 0.6,
// //       stagger: 0.1
// //     }, 0.8)
// //     .to(imageRef.current, {
// //       opacity: 1,
// //       y: 0,
// //       duration: 0.8,
// //       ease: 'elastic.out(1, 0.5)'
// //     }, 0.6)
// //     .to(circle1Ref.current, {
// //       scale: 1,
// //       duration: 1.2,
// //       ease: 'elastic.out(1, 0.5)'
// //     }, 0.2)
// //     .to(circle2Ref.current, {
// //       scale: 1,
// //       duration: 1.2,
// //       ease: 'elastic.out(1, 0.5)'
// //     }, 0.4);

// //     // Continuous subtle animations
// //     gsap.to(circle1Ref.current, {
// //       x: '+=10',
// //       y: '+=5',
// //       duration: 8,
// //       repeat: -1,
// //       yoyo: true,
// //       ease: 'sine.inOut'
// //     });

// //     gsap.to(circle2Ref.current, {
// //       x: '-=15',
// //       y: '-=10',
// //       duration: 10,
// //       repeat: -1,
// //       yoyo: true,
// //       ease: 'sine.inOut'
// //     });

// //     // Store the animation reference
// //     animationRef.current = tl;

// //     // Button hover effects
// //     const buttons = buttonsRef.current?.children;
// //     if (buttons) {
// //       Array.from(buttons).forEach(button => {
// //         button.addEventListener('mouseenter', () => {
// //           gsap.to(button, {
// //             y: -3,
// //             duration: 0.3
// //           });
// //         });
// //         button.addEventListener('mouseleave', () => {
// //           gsap.to(button, {
// //             y: 0,
// //             duration: 0.3
// //           });
// //         });
// //       });
// //     }

// //     // Cleanup function
// //     return () => {
// //       if (animationRef.current) {
// //         animationRef.current.kill();
// //       }
// //       if (buttons) {
// //         Array.from(buttons).forEach(button => {
// //           button.removeEventListener('mouseenter', () => {});
// //           button.removeEventListener('mouseleave', () => {});
// //         });
// //       }
// //     };
// //   }, [darkMode, profileData]);

// //   // Dark mode transition animation
// //   useEffect(() => {
// //     if (!heroRef.current || !titleRef.current || !subtitleRef.current || !descriptionRef.current) {
// //       return;
// //     }

// //     gsap.to(heroRef.current, {
// //       backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
// //       duration: 0.8,
// //       ease: 'power2.inOut'
// //     });

// //     gsap.to(titleRef.current, {
// //       color: darkMode ? '#f8fafc' : '#1f2937',
// //       duration: 0.6
// //     });

// //     gsap.to([subtitleRef.current, descriptionRef.current], {
// //       color: darkMode ? '#94a3b8' : '#4b5563',
// //       duration: 0.6
// //     });

// //     gsap.to('.hero-button', {
// //       backgroundColor: darkMode ? '#1e293b' : '#ffffff',
// //       borderColor: darkMode ? '#334155' : '#d1d5db',
// //       color: darkMode ? '#f8fafc' : '#1f2937',
// //       duration: 0.6
// //     });

// //     gsap.to('.hero-primary-button', {
// //       backgroundColor: darkMode ? '#60a5fa' : '#2fdce8',
// //       duration: 0.6
// //     });

// //     gsap.to([circle1Ref.current, circle2Ref.current], {
// //       backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(47, 220, 232, 0.2)',
// //       duration: 0.8
// //     });
// //   }, [darkMode]);

// //   if (!profileData) {
// //     return (
// //       <section className={styles.hero} ref={heroRef}>
// //         <div className={styles.container}>
// //           <div className={styles.loading}>Loading profile...</div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className={styles.hero} ref={heroRef}>
// //       <div className={styles.container}>
// //         <div className={styles.content}>
// //           <h1 className={styles.title} ref={titleRef}>{`Mr. ${profileData.name}` || 'Mr. Utkarsh Gupta'}</h1>
// //           <p className={styles.subtitle} ref={subtitleRef}>
// //             {profileData.professionalTitle || 'Associate Consultant & Data Analytics Professional'}
// //           </p>
// //           <p className={styles.description} ref={descriptionRef}>
// //             {profileData.bio || 'MBA in Business Analytics (STEM) | Expert in Product Analytics, A/B Testing & Data Visualization'}
// //           </p>
// //           <div className={styles.buttonGroup} ref={buttonsRef}>
// //             <a href="#contact" className={`${styles.primaryButton} hero-primary-button`}>Get in Touch</a>
// //             <a href="#cv" className={`${styles.secondaryButton} hero-button`}>View CV</a>
// //           </div>
// //         </div>
// //         <div className={styles.imageContainer}>
// //           <div className={styles.imageWrapper} ref={imageRef}>
// //             {profileData.profileImage ? (
// //               <img 
// //                 src={profileData.profileImage} 
// //                 alt={profileData.name || 'Profile'} 
// //                 className={styles.image}
// //                 onLoad={() => {
// //                   // Force GSAP to update after image loads
// //                   gsap.to(imageRef.current, { opacity: 1, duration: 0.5 });
// //                 }}
// //               />
// //             ) : (
// //               <div className={styles.placeholderImage}>
// //                 {profileData.name?.charAt(0)?.toUpperCase() || 'A'}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
      
// //       {/* Decorative Elements */}
// //       <div className={styles.gradientOverlay}></div>
// //       <div className={styles.decorativeCircle1} ref={circle1Ref}></div>
// //       <div className={styles.decorativeCircle2} ref={circle2Ref}></div>
// //     </section>
// //   );
// // };

// // export default Hero;

















































// // // import React, { useRef, useEffect, useState } from 'react';
// // // import { gsap } from 'gsap';
// // // import { useTheme } from '../../../context/ThemeContext';
// // // import profile from '../../../assets/Utkarsh_Short.jpg';
// // // import styles from './Hero.module.css';
// // // import axios from 'axios'

// // // const Hero = () => {
// // //   const { darkMode } = useTheme();
// // //   const heroRef = useRef();
// // //   const titleRef = useRef();
// // //   const subtitleRef = useRef();
// // //   const descriptionRef = useRef();
// // //   const buttonsRef = useRef();
// // //   const imageRef = useRef();
// // //   const circle1Ref = useRef();
// // //   const circle2Ref = useRef();
// // // // Add this useEffect to Hero.jsx
// // // const [profileData, setProfileData] = useState(null);

// // // useEffect(() => {
// // //   const fetchSuperadminProfile = async () => {
// // //     try {
// // //       const response = await axios.get('https://utkarshgupta-1.onrender.com/api/auth/public/superadmin');
// // //       setProfileData(response.data.data.user);
// // //     } catch (error) {
// // //       console.error('Error fetching profile:', error);
// // //     }
// // //   };

// // //   fetchSuperadminProfile();
// // // }, []);
// // //   useEffect(() => {
// // //     const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

// // //     // Initial setup (hidden state)
// // //     gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, imageRef.current], {
// // //       opacity: 0,
// // //       y: 20
// // //     });
// // //     gsap.set([circle1Ref.current, circle2Ref.current], { scale: 0 });

// // //     // Animation sequence
// // //     tl.from(heroRef.current, {
// // //       backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
// // //       duration: 0.8
// // //     })
// // //     .to(titleRef.current, {
// // //       opacity: 1,
// // //       y: 0,
// // //       duration: 0.8,
// // //       ease: 'back.out(1.5)'
// // //     }, 0.2)
// // //     .to(subtitleRef.current, {
// // //       opacity: 1,
// // //       y: 0,
// // //       duration: 0.6
// // //     }, 0.4)
// // //     .to(descriptionRef.current, {
// // //       opacity: 1,
// // //       y: 0,
// // //       duration: 0.6
// // //     }, 0.6)
// // //     .to(buttonsRef.current, {
// // //       opacity: 1,
// // //       y: 0,
// // //       duration: 0.6,
// // //       stagger: 0.1
// // //     }, 0.8)
// // //     .to(imageRef.current, {
// // //       opacity: 1,
// // //       y: 0,
// // //       duration: 0.8,
// // //       ease: 'elastic.out(1, 0.5)'
// // //     }, 0.6)
// // //     .to(circle1Ref.current, {
// // //       scale: 1,
// // //       duration: 1.2,
// // //       ease: 'elastic.out(1, 0.5)'
// // //     }, 0.2)
// // //     .to(circle2Ref.current, {
// // //       scale: 1,
// // //       duration: 1.2,
// // //       ease: 'elastic.out(1, 0.5)'
// // //     }, 0.4);

// // //     // Continuous subtle animations
// // //     gsap.to(circle1Ref.current, {
// // //       x: '+=10',
// // //       y: '+=5',
// // //       duration: 8,
// // //       repeat: -1,
// // //       yoyo: true,
// // //       ease: 'sine.inOut'
// // //     });

// // //     gsap.to(circle2Ref.current, {
// // //       x: '-=15',
// // //       y: '-=10',
// // //       duration: 10,
// // //       repeat: -1,
// // //       yoyo: true,
// // //       ease: 'sine.inOut'
// // //     });

// // //     // Button hover effects
// // //     const buttons = buttonsRef.current?.children;
// // //     if (buttons) {
// // //       Array.from(buttons).forEach(button => {
// // //         button.addEventListener('mouseenter', () => {
// // //           gsap.to(button, {
// // //             y: -3,
// // //             duration: 0.3
// // //           });
// // //         });
// // //         button.addEventListener('mouseleave', () => {
// // //           gsap.to(button, {
// // //             y: 0,
// // //             duration: 0.3
// // //           });
// // //         });
// // //       });
// // //     }
// // //   }, [darkMode]);

// // //   // Dark mode transition animation
// // //   useEffect(() => {
// // //     gsap.to(heroRef.current, {
// // //       backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
// // //       duration: 0.8,
// // //       ease: 'power2.inOut'
// // //     });

// // //     gsap.to(titleRef.current, {
// // //       color: darkMode ? '#f8fafc' : '#1f2937',
// // //       duration: 0.6
// // //     });

// // //     gsap.to([subtitleRef.current, descriptionRef.current], {
// // //       color: darkMode ? '#94a3b8' : '#4b5563',
// // //       duration: 0.6
// // //     });

// // //     gsap.to('.hero-button', {
// // //       backgroundColor: darkMode ? '#1e293b' : '#ffffff',
// // //       borderColor: darkMode ? '#334155' : '#d1d5db',
// // //       color: darkMode ? '#f8fafc' : '#1f2937',
// // //       duration: 0.6
// // //     });

// // //     gsap.to('.hero-primary-button', {
// // //       backgroundColor: darkMode ? '#60a5fa' : '#2fdce8',
// // //       duration: 0.6
// // //     });

// // //     gsap.to([circle1Ref.current, circle2Ref.current], {
// // //       backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(47, 220, 232, 0.2)',
// // //       duration: 0.8
// // //     });
// // //   }, [darkMode]);

// // //   return (
// // //     <section className={styles.hero} ref={heroRef}>
// // //       <div className={styles.container}>
// // //         <div className={styles.content}>
// // //           <h1 className={styles.title} ref={titleRef}>Mr. Utkarsh Gupta</h1>
// // //           <p className={styles.subtitle} ref={subtitleRef}>Associate Consultant & Data Analytics Professional</p>
// // //           <p className={styles.description} ref={descriptionRef}>
// // //             MBA in Business Analytics (STEM) | Expert in Product Analytics, A/B Testing & Data Visualization
// // //           </p>
// // //           <div className={styles.buttonGroup} ref={buttonsRef}>
// // //             <a href="#contact" className={`${styles.primaryButton} hero-primary-button`}>Get in Touch</a>
// // //             <a href="#cv" className={`${styles.secondaryButton} hero-button`}>View CV</a>
// // //           </div>
// // //         </div>
// // //         <div className={styles.imageContainer}>
// // //           <div className={styles.imageWrapper} ref={imageRef}>
// // //             <img 
// // //               src={profile} 
// // //               alt="Utkarsh Gupta" 
// // //               className={styles.image}
// // //             />
// // //           </div>
// // //         </div>
// // //       </div>
      
// // //       {/* Decorative Elements */}
// // //       <div className={styles.gradientOverlay}></div>
// // //       <div className={styles.decorativeCircle1} ref={circle1Ref}></div>
// // //       <div className={styles.decorativeCircle2} ref={circle2Ref}></div>
// // //     </section>
// // //   );
// // // };

// // // export default Hero;