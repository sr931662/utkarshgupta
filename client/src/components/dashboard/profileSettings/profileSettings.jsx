import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/authContext';
import { motion } from 'framer-motion';
import styles from './profileSettings.module.css';
import api from '../../../context/authAPI';
import { 
  FiUser, FiMail, FiLock, FiSave, FiEdit, FiCamera,
  FiLinkedin, FiGithub, FiTwitter, FiCalendar, FiBriefcase,
  FiBook, FiCode, FiMapPin, FiPhone, FiGlobe, FiBookmark,
  FiHome, FiLayers, FiAward, FiTool, FiClock, FiDollarSign
} from 'react-icons/fi';


const ProfileSettings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    professionalTitle: '',
    profileImage: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    alternateEmail: '',
    bio: '',
    
    socialMedia: {
      twitter: '',
      linkedin: '',
      github: '',
      researchGate: '',
      googleScholar: '',
      ORCID: ''
    },
    
    affiliation: {
      institution: '',
      department: '',
      position: '',
      faculty: '',
      joiningDate: '',
      officeLocation: '',
      officeHours: ''
    },
    
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      timeZone: ''
    },
    
    education: [],
    crashcourses: [],
    workExperience: [],
    awards: [],
    researchInterests: [],
    teachingInterests: [],
    skills: [],
    technicalSkills: [],
    languages: [],
    hobbies: [],
    certificates: [],
    
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true
    }
  });

  // Temporary form states for adding new items
  const [newEducation, setNewEducation] = useState({
    degree: '',
    field: '',
    institution: '',
    grade: '',
    startdate: '',
    enddate: '',
    description: ''
  });
  
  const [newCrashCourse, setNewCrashCourse] = useState({
    course: '',
    field: '',
    organization: ''
  });
  
  const [newWorkExperience, setNewWorkExperience] = useState({
    position: '',
    organization: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  
  const [newAward, setNewAward] = useState({
    title: '',
    year: '',
    description: ''
  });
  
  const [newTechnicalSkill, setNewTechnicalSkill] = useState({
    name: '',
    level: 'intermediate'
  });
  
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'professional'
  });
  
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    organization: '',
    issueDate: '',
    certID: '',
    credentialslink: ''
  });
  
  const [newResearchInterest, setNewResearchInterest] = useState('');
  const [newTeachingInterest, setNewTeachingInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('http://localhost:5000/api/auth/me');
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          professionalTitle: data.user.professionalTitle || '',
          profileImage: data.user.profileImage || '',
          gender: data.user.gender || '',
          dateOfBirth: data.user.dateOfBirth || '',
          phoneNumber: data.user.phoneNumber || '',
          alternateEmail: data.user.alternateEmail || '',
          bio: data.user.bio || '',
          
          socialMedia: data.user.socialMedia || {
            twitter: '',
            linkedin: '',
            github: '',
            researchGate: '',
            googleScholar: '',
            ORCID: ''
          },
          
          affiliation: data.user.affiliation || {
            institution: '',
            department: '',
            position: '',
            faculty: '',
            joiningDate: '',
            officeLocation: '',
            officeHours: ''
          },
          
          location: data.user.location || {
            address: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            timeZone: ''
          },
          
          education: data.user.education || [],
          crashcourses: data.user.crashcourses || [],
          workExperience: data.user.workExperience || [],
          awards: data.user.awards || [],
          researchInterests: data.user.researchInterests || [],
          teachingInterests: data.user.teachingInterests || [],
          skills: data.user.skills || [],
          technicalSkills: data.user.technicalSkills || [],
          languages: data.user.languages || [],
          hobbies: data.user.hobbies || [],
          certificates: data.user.certificates || [],
          
          notificationPreferences: data.user.notificationPreferences || {
            emailNotifications: true,
            pushNotifications: true
          }
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };


  const handleAffiliationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      affiliation: {
        ...prev.affiliation,
        [name]: value
      }
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleNotificationPrefChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleCrashCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCrashCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewWorkExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAwardChange = (e) => {
    const { name, value } = e.target;
    setNewAward(prev => ({ ...prev, [name]: value }));
  };

  const handleTechnicalSkillChange = (e) => {
    const { name, value } = e.target;
    setNewTechnicalSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({ ...prev, [name]: value }));
  };

  const handleCertificateChange = (e) => {
    const { name, value } = e.target;
    setNewCertificate(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to convert ISO date to yyyy-MM-dd format
const formatDateForInput = (isoDate) => {
  if (!isoDate || isNaN(new Date(isoDate).getTime())) return '';
  // if (!isoDate) return '';
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// Helper function to convert yyyy-MM-dd to ISO format
const parseInputDateToISO = (inputDate) => {
  if (!inputDate) return null;
  return new Date(inputDate).toISOString();
};

  // Array item handlers
  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({
        degree: '',
        field: '',
        institution: '',
        grade: '',
        startdate: '',
        enddate: '',
        description: ''
      });
    }
  };

  const addCrashCourse = () => {
    if (newCrashCourse.course && newCrashCourse.organization) {
      setFormData(prev => ({
        ...prev,
        crashcourses: [...prev.crashcourses, newCrashCourse]
      }));
      setNewCrashCourse({
        course: '',
        field: '',
        organization: ''
      });
    }
  };

  const addWorkExperience = () => {
    if (newWorkExperience.position && newWorkExperience.organization) {
      setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, newWorkExperience]
      }));
      setNewWorkExperience({
        position: '',
        organization: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  const addAward = () => {
    if (newAward.title && newAward.year) {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, newAward]
      }));
      setNewAward({
        title: '',
        year: '',
        description: ''
      });
    }
  };

  const addTechnicalSkill = () => {
    if (newTechnicalSkill.name) {
      setFormData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newTechnicalSkill]
      }));
      setNewTechnicalSkill({
        name: '',
        level: 'intermediate'
      });
    }
  };

  const addLanguage = () => {
    if (newLanguage.name) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage({
        name: '',
        proficiency: 'professional'
      });
    }
  };

  const addCertificate = () => {
    if (newCertificate.title && newCertificate.organization) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, newCertificate]
      }));
      setNewCertificate({
        title: '',
        organization: '',
        issueDate: '',
        certID: '',
        credentialslink: ''
      });
    }
  };

  const addResearchInterest = () => {
    if (newResearchInterest.trim() && !formData.researchInterests.includes(newResearchInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        researchInterests: [...prev.researchInterests, newResearchInterest.trim()]
      }));
      setNewResearchInterest('');
    }
  };

  const addTeachingInterest = () => {
    if (newTeachingInterest.trim() && !formData.teachingInterests.includes(newTeachingInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        teachingInterests: [...prev.teachingInterests, newTeachingInterest.trim()]
      }));
      setNewTeachingInterest('');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }));
      setNewHobby('');
    }
  };

  // Remove items from arrays
  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeCrashCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      crashcourses: prev.crashcourses.filter((_, i) => i !== index)
    }));
  };

  const removeWorkExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const removeAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const removeTechnicalSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }));
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const removeCertificate = (index) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const removeResearchInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter(i => i !== interest)
    }));
  };

  const removeTeachingInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      teachingInterests: prev.teachingInterests.filter(i => i !== interest)
    }));
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const removeHobby = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const updatedData = {
  //     ...formData,
  //     ...(avatarPreview && { profileImage: avatarPreview })
  //   };
  //   updateUser(updatedData);
  //   setEditMode(false);
  // };
// Form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form before submission
  if (!validateForm()) return;
  
  setIsSaving(true);
  
  try {
    // Prepare updated data
    const updatedData = {
      ...formData,
      ...(avatarPreview && { profileImage: avatarPreview }),
      
      // Ensure dates are properly formatted for backend
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      affiliation: {
        ...formData.affiliation,
        joiningDate: formData.affiliation.joiningDate 
          ? new Date(formData.affiliation.joiningDate).toISOString() 
          : null
      }
    };

    // Clean up empty arrays and objects
    Object.keys(updatedData).forEach(key => {
      if (Array.isArray(updatedData[key]) && updatedData[key].length === 0) {
        delete updatedData[key];
      }
      if (typeof updatedData[key] === 'object' && updatedData[key] !== null) {
        // Clean nested objects
        Object.keys(updatedData[key]).forEach(nestedKey => {
          if (updatedData[key][nestedKey] === '' || 
              updatedData[key][nestedKey] === null || 
              updatedData[key][nestedKey] === undefined) {
            delete updatedData[key][nestedKey];
          }
        });
        
        // Remove empty objects
        if (Object.keys(updatedData[key]).length === 0) {
          delete updatedData[key];
        }
      }
    });

    // Make API call to update profile
    const { data } = await api.put('http://localhost:5000/api/auth/me', updatedData);
    
    // Update user in context and local state
    if (updateUser && typeof updateUser === 'function') {
      updateUser(data.user);
    } else {
      console.warn('updateUser function not available - using local state fallback');
      // Fallback: Update local state if context update fails
      setFormData(prev => ({
        ...prev,
        ...data.user,
        // Preserve any local state that might not be in the response
        socialMedia: data.user.socialMedia || prev.socialMedia,
        affiliation: data.user.affiliation || prev.affiliation,
        location: data.user.location || prev.location
      }));
    }
    
    // Reset edit mode and avatar preview
    setEditMode(false);
    setAvatarPreview(null);
    
    // Show success feedback
    alert('Profile updated successfully!');
    
  } catch (error) {
    console.error('Failed to update profile:', error);
    
    // Enhanced error handling
    let errorMessage = 'Failed to update profile. Please try again.';
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data.message || 'Invalid data. Please check your inputs.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    alert(errorMessage);
    
  } finally {
    setIsSaving(false);
  }
};
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;
  
//   setIsSaving(true);
  
//   try {
//     const updatedData = {
//       ...formData,
//       ...(avatarPreview && { profileImage: avatarPreview })
//     };

//     // Clean up empty arrays and objects
//     Object.keys(updatedData).forEach(key => {
//       if (Array.isArray(updatedData[key]) && updatedData[key].length === 0) {
//         delete updatedData[key];
//       }
//       if (typeof updatedData[key] === 'object' && updatedData[key] !== null && 
//           Object.keys(updatedData[key]).length === 0) {
//         delete updatedData[key];
//       }
//     });

//     const { data } = await api.put('http://localhost:5000/api/auth/me', updatedData);
    
//     updateUser(data.user);
//     setEditMode(false);
//     setAvatarPreview(null);
    
//     // Use a toast notification instead of alert
//     alert('Profile updated successfully!');
//   } catch (error) {
//     console.error('Failed to update profile:', error);
    
//     let errorMessage = 'Failed to update profile. Please try again.';
//     if (error.response) {
//       if (error.response.status === 401) {
//         errorMessage = 'Session expired. Please log in again.';
//       } else if (error.response.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response.status === 500) {
//         errorMessage = 'Server error. Please try again later.';
//       }
//     }
//     alert(errorMessage);
//   } finally {
//     setIsSaving(false);
//   }
// };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
    
  //   setIsSaving(true);
    
  //   try {
  //     const updatedData = {
  //       ...formData,
  //       ...(avatarPreview && { profileImage: avatarPreview })
  //     };

  //     // Clean up empty arrays and objects
  //     Object.keys(updatedData).forEach(key => {
  //       if (Array.isArray(updatedData[key]) && updatedData[key].length === 0) {
  //         delete updatedData[key];
  //       }
  //       if (typeof updatedData[key] === 'object' && updatedData[key] !== null && 
  //           Object.keys(updatedData[key]).length === 0) {
  //         delete updatedData[key];
  //       }
  //     });

  //     const { data } = await api.put('http://localhost:5000/api/auth/me', updatedData);
      
  //     updateUser(data.user);
  //     setEditMode(false);
  //     setAvatarPreview(null);
      
  //     alert('Profile updated successfully!');
  //   } catch (error) {
  //     console.error('Failed to update profile:', error);
  //     alert('Failed to update profile. Please try again.');
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  // Form validation
  const validateForm = () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  

  const renderPersonalInfo = () => (
    <div className={styles.sectionContent}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          <div className={styles.userAvatarLarge} style={
            avatarPreview ? { backgroundImage: `url(${avatarPreview})` } :
            formData.profileImage ? { backgroundImage: `url(${formData.profileImage})` } : {}
          }>
            {!avatarPreview && !formData.profileImage && (formData.name?.charAt(0)?.toUpperCase() || 'A')}
          </div>
          {editMode && (
            <motion.label
              className={styles.avatarEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiCamera size={18} />
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarChange}
              />
            </motion.label>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label><FiUser size={16} /> Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label><FiMail size={16} /> Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Professional Title</label>
        <input
          type="text"
          name="professionalTitle"
          value={formData.professionalTitle}
          onChange={handleInputChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          disabled={!editMode}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label><FiCalendar size={16} /> Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formatDateForInput(formData.dateOfBirth)}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              dateOfBirth: parseInputDateToISO(e.target.value)
            }));
          }}
          disabled={!editMode}
        />
        {/* <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          disabled={!editMode}
        /> */}
      </div>

      <div className={styles.formGroup}>
        <label><FiPhone size={16} /> Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label><FiMail size={16} /> Alternate Email</label>
        <input
          type="email"
          name="alternateEmail"
          value={formData.alternateEmail}
          onChange={handleInputChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows="3"
          disabled={!editMode}
        />
      </div>
    </div>
  );

  const renderAffiliation = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGroup}>
        <label><FiHome size={16} /> Institution</label>
        <input
          type="text"
          name="institution"
          value={formData.affiliation.institution}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Department</label>
        <input
          type="text"
          name="department"
          value={formData.affiliation.department}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Position</label>
        <input
          type="text"
          name="position"
          value={formData.affiliation.position}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Faculty</label>
        <input
          type="text"
          name="faculty"
          value={formData.affiliation.faculty}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label><FiCalendar size={16} /> Joining Date</label>
        {/* // For joiningDate in affiliation */}
          <input
            type="date"
            name="joiningDate"
            value={formatDateForInput(formData.affiliation.joiningDate)}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                affiliation: {
                  ...prev.affiliation,
                  joiningDate: parseInputDateToISO(e.target.value)
                }
              }));
            }}
            disabled={!editMode}
          />
        {/* <input
          type="date"
          name="joiningDate"
          value={formData.affiliation.joiningDate}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        /> */}
      </div>

      <div className={styles.formGroup}>
        <label>Office Location</label>
        <input
          type="text"
          name="officeLocation"
          value={formData.affiliation.officeLocation}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label><FiClock size={16} /> Office Hours</label>
        <input
          type="text"
          name="officeHours"
          value={formData.affiliation.officeHours}
          onChange={handleAffiliationChange}
          disabled={!editMode}
        />
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGroup}>
        <label><FiMapPin size={16} /> Address</label>
        <input
          type="text"
          name="address"
          value={formData.location.address}
          onChange={handleLocationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.location.city}
          onChange={handleLocationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>State/Province</label>
        <input
          type="text"
          name="state"
          value={formData.location.state}
          onChange={handleLocationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.location.country}
          onChange={handleLocationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Postal Code</label>
        <input
          type="text"
          name="postalCode"
          value={formData.location.postalCode}
          onChange={handleLocationChange}
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Time Zone</label>
        <input
          type="text"
          name="timeZone"
          value={formData.location.timeZone}
          onChange={handleLocationChange}
          disabled={!editMode}
        />
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className={styles.sectionContent}>
      {formData.education.map((edu, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeEducation(index)}
            >
              ×
            </button>
          )}
          <h4>{edu.degree} in {edu.field}</h4>
          <p className={styles.institution}>{edu.institution}</p>
          <p className={styles.dates}>
            {edu.startdate} - {edu.enddate || 'Present'} | Grade: {edu.grade}
          </p>
          {edu.description && <p className={styles.description}>{edu.description}</p>}
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Education</h4>
          <div className={styles.formGroup}>
            <label>Degree</label>
            <input
              type="text"
              name="degree"
              value={newEducation.degree}
              onChange={handleEducationChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Field of Study</label>
            <input
              type="text"
              name="field"
              value={newEducation.field}
              onChange={handleEducationChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Institution</label>
            <input
              type="text"
              name="institution"
              value={newEducation.institution}
              onChange={handleEducationChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Grade</label>
            <input
              type="text"
              name="grade"
              value={newEducation.grade}
              onChange={handleEducationChange}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type="date"
                name="startdate"
                value={newEducation.startdate}
                onChange={handleEducationChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Date</label>
              <input
                type="date"
                name="enddate"
                value={newEducation.enddate}
                onChange={handleEducationChange}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={newEducation.description}
              onChange={handleEducationChange}
              rows="2"
            />
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addEducation}
            disabled={!newEducation.degree || !newEducation.institution}
          >
            Add Education
          </button>
        </div>
      )}
    </div>
  );

  const renderCrashCourses = () => (
    <div className={styles.sectionContent}>
      {formData.crashcourses.map((course, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeCrashCourse(index)}
            >
              ×
            </button>
          )}
          <h4>{course.course}</h4>
          <p className={styles.field}>{course.field}</p>
          <p className={styles.organization}>Organization: {course.organization}</p>
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Crash Course</h4>
          <div className={styles.formGroup}>
            <label>Course Name</label>
            <input
              type="text"
              name="course"
              value={newCrashCourse.course}
              onChange={handleCrashCourseChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Field</label>
            <input
              type="text"
              name="field"
              value={newCrashCourse.field}
              onChange={handleCrashCourseChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Organization</label>
            <input
              type="text"
              name="organization"
              value={newCrashCourse.organization}
              onChange={handleCrashCourseChange}
            />
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addCrashCourse}
            disabled={!newCrashCourse.course || !newCrashCourse.organization}
          >
            Add Crash Course
          </button>
        </div>
      )}
    </div>
  );

  const renderWorkExperience = () => (
    <div className={styles.sectionContent}>
      {formData.workExperience.map((exp, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeWorkExperience(index)}
            >
              ×
            </button>
          )}
          <h4>{exp.position}</h4>
          <p className={styles.organization}>{exp.organization}</p>
          <p className={styles.dates}>
            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
          </p>
          {exp.description && <p className={styles.description}>{exp.description}</p>}
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Work Experience</h4>
          <div className={styles.formGroup}>
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={newWorkExperience.position}
              onChange={handleWorkExperienceChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Organization</label>
            <input
              type="text"
              name="organization"
              value={newWorkExperience.organization}
              onChange={handleWorkExperienceChange}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={newWorkExperience.startDate}
                onChange={handleWorkExperienceChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={newWorkExperience.endDate}
                onChange={handleWorkExperienceChange}
                disabled={newWorkExperience.current}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="current"
                checked={newWorkExperience.current}
                onChange={handleWorkExperienceChange}
              />
              I currently work here
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={newWorkExperience.description}
              onChange={handleWorkExperienceChange}
              rows="3"
            />
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addWorkExperience}
            disabled={!newWorkExperience.position || !newWorkExperience.organization}
          >
            Add Experience
          </button>
        </div>
      )}
    </div>
  );

  const renderAwards = () => (
    <div className={styles.sectionContent}>
      {formData.awards.map((award, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeAward(index)}
            >
              ×
            </button>
          )}
          <h4>{award.title}</h4>
          <p className={styles.year}>Year: {award.year}</p>
          {award.description && <p className={styles.description}>{award.description}</p>}
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Award</h4>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={newAward.title}
              onChange={handleAwardChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={newAward.year}
              onChange={handleAwardChange}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={newAward.description}
              onChange={handleAwardChange}
              rows="2"
            />
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addAward}
            disabled={!newAward.title || !newAward.year}
          >
            Add Award
          </button>
        </div>
      )}
    </div>
  );

  const renderResearchInterests = () => (
    <div className={styles.sectionContent}>
      <div className={styles.skillsSection}>
        <h4>Research Interests</h4>
        <div className={styles.skillsContainer}>
          {formData.researchInterests.map((interest, index) => (
            <div key={index} className={styles.skillTag}>
              {interest}
              {editMode && (
                <button 
                  className={styles.removeTagButton}
                  onClick={() => removeResearchInterest(interest)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        {editMode && (
          <div className={styles.addSkill}>
            <input
              type="text"
              value={newResearchInterest}
              onChange={(e) => setNewResearchInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addResearchInterest()}
              placeholder="Add research interest and press Enter"
            />
            <button 
              type="button" 
              className={styles.addButtonSmall}
              onClick={addResearchInterest}
              disabled={!newResearchInterest.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTeachingInterests = () => (
    <div className={styles.sectionContent}>
      <div className={styles.skillsSection}>
        <h4>Teaching Interests</h4>
        <div className={styles.skillsContainer}>
          {formData.teachingInterests.map((interest, index) => (
            <div key={index} className={styles.skillTag}>
              {interest}
              {editMode && (
                <button 
                  className={styles.removeTagButton}
                  onClick={() => removeTeachingInterest(interest)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        {editMode && (
          <div className={styles.addSkill}>
            <input
              type="text"
              value={newTeachingInterest}
              onChange={(e) => setNewTeachingInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTeachingInterest()}
              placeholder="Add teaching interest and press Enter"
            />
            <button 
              type="button" 
              className={styles.addButtonSmall}
              onClick={addTeachingInterest}
              disabled={!newTeachingInterest.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className={styles.sectionContent}>
      <div className={styles.skillsSection}>
        <h4>General Skills</h4>
        <div className={styles.skillsContainer}>
          {formData.skills.map((skill, index) => (
            <div key={index} className={styles.skillTag}>
              {skill}
              {editMode && (
                <button 
                  className={styles.removeTagButton}
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        {editMode && (
          <div className={styles.addSkill}>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add skill and press Enter"
            />
            <button 
              type="button" 
              className={styles.addButtonSmall}
              onClick={addSkill}
              disabled={!newSkill.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTechnicalSkills = () => (
    <div className={styles.sectionContent}>
      {formData.technicalSkills.map((skill, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeTechnicalSkill(index)}
            >
              ×
            </button>
          )}
          <h4>{skill.name}</h4>
          <p>Level: {skill.level}</p>
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Technical Skill</h4>
          <div className={styles.formGroup}>
            <label>Skill Name</label>
            <input
              type="text"
              name="name"
              value={newTechnicalSkill.name}
              onChange={handleTechnicalSkillChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Proficiency Level</label>
            <select
              name="level"
              value={newTechnicalSkill.level}
              onChange={handleTechnicalSkillChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addTechnicalSkill}
            disabled={!newTechnicalSkill.name}
          >
            Add Technical Skill
          </button>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className={styles.sectionContent}>
      {formData.languages.map((lang, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeLanguage(index)}
            >
              ×
            </button>
          )}
          <h4>{lang.name}</h4>
          <p>Proficiency: {lang.proficiency}</p>
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Language</h4>
          <div className={styles.formGroup}>
            <label>Language</label>
            <input
              type="text"
              name="name"
              value={newLanguage.name}
              onChange={handleLanguageChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Proficiency</label>
            <select
              name="proficiency"
              value={newLanguage.proficiency}
              onChange={handleLanguageChange}
            >
              <option value="basic">Basic</option>
              <option value="conversational">Conversational</option>
              <option value="professional">Professional</option>
              <option value="fluent">Fluent</option>
              <option value="native">Native</option>
            </select>
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addLanguage}
            disabled={!newLanguage.name}
          >
            Add Language
          </button>
        </div>
      )}
    </div>
  );

  const renderHobbies = () => (
    <div className={styles.sectionContent}>
      <div className={styles.skillsSection}>
        <h4>Hobbies & Interests</h4>
        <div className={styles.skillsContainer}>
          {formData.hobbies.map((hobby, index) => (
            <div key={index} className={styles.skillTag}>
              {hobby}
              {editMode && (
                <button 
                  className={styles.removeTagButton}
                  onClick={() => removeHobby(hobby)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        {editMode && (
          <div className={styles.addSkill}>
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHobby()}
              placeholder="Add hobby and press Enter"
            />
            <button 
              type="button" 
              className={styles.addButtonSmall}
              onClick={addHobby}
              disabled={!newHobby.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className={styles.sectionContent}>
      {formData.certificates.map((cert, index) => (
        <div key={index} className={styles.itemCard}>
          {editMode && (
            <button 
              className={styles.removeButton}
              onClick={() => removeCertificate(index)}
            >
              ×
            </button>
          )}
          <h4>{cert.title}</h4>
          <p className={styles.organization}>Issued by: {cert.organization}</p>
          <p className={styles.date}>Issue Date: {cert.issueDate}</p>
          {cert.certID && <p className={styles.credential}>Credential ID: {cert.certID}</p>}
          {cert.credentialslink && (
            <a href={cert.credentialslink} target="_blank" rel="noopener noreferrer">
              View Credential
            </a>
          )}
        </div>
      ))}

      {editMode && (
        <div className={styles.addForm}>
          <h4>Add Certificate</h4>
          <div className={styles.formGroup}>
            <label>Certificate Title</label>
            <input
              type="text"
              name="title"
              value={newCertificate.title}
              onChange={handleCertificateChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Organization</label>
            <input
              type="text"
              name="organization"
              value={newCertificate.organization}
              onChange={handleCertificateChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={newCertificate.issueDate}
              onChange={handleCertificateChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Credential ID (optional)</label>
            <input
              type="text"
              name="certID"
              value={newCertificate.certID}
              onChange={handleCertificateChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Credentials Link (optional)</label>
            <input
              type="url"
              name="credentialslink"
              value={newCertificate.credentialslink}
              onChange={handleCertificateChange}
              placeholder="https://example.com/certificate"
            />
          </div>
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addCertificate}
            disabled={!newCertificate.title || !newCertificate.organization}
          >
            Add Certificate
          </button>
        </div>
      )}
    </div>
  );

  const renderSocialMedia = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGroup}>
        <label><FiTwitter size={16} /> Twitter</label>
        <input
          type="url"
          name="twitter"
          value={formData.socialMedia.twitter}
          onChange={handleSocialMediaChange}
          placeholder="https://twitter.com/username"
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label><FiLinkedin size={16} /> LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          value={formData.socialMedia.linkedin}
          onChange={handleSocialMediaChange}
          placeholder="https://linkedin.com/in/username"
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label><FiGithub size={16} /> GitHub</label>
        <input
          type="url"
          name="github"
          value={formData.socialMedia.github}
          onChange={handleSocialMediaChange}
          placeholder="https://github.com/username"
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>ResearchGate</label>
        <input
          type="url"
          name="researchGate"
          value={formData.socialMedia.researchGate}
          onChange={handleSocialMediaChange}
          placeholder="https://www.researchgate.net/profile/username"
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Google Scholar</label>
        <input
          type="url"
          name="googleScholar"
          value={formData.socialMedia.googleScholar}
          onChange={handleSocialMediaChange}
          placeholder="https://scholar.google.com/citations?user=ID"
          disabled={!editMode}
        />
      </div>

      <div className={styles.formGroup}>
        <label>ORCID</label>
        <input
          type="text"
          name="ORCID"
          value={formData.socialMedia.ORCID}
          onChange={handleSocialMediaChange}
          placeholder="0000-0000-0000-0000"
          disabled={!editMode}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            name="emailNotifications"
            checked={formData.notificationPreferences.emailNotifications}
            onChange={handleNotificationPrefChange}
            disabled={!editMode}
          />
          Email Notifications
        </label>
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            name="pushNotifications"
            checked={formData.notificationPreferences.pushNotifications}
            onChange={handleNotificationPrefChange}
            disabled={!editMode}
          />
          Push Notifications
        </label>
      </div>
    </div>
  );

  return (
    // <div className={`${styles.tabContent} ${darkMode ? styles.dark : ''}`}>
    //   <motion.div 
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.3 }}
    //     className={styles.profileContainer}
    //   >
    //     <div className={styles.profileHeader}>
    //       <h2>Profile Settings</h2>
    //       {!editMode ? (
    //         <motion.button
    //           className={`${styles.editButton} ${darkMode ? styles.dark : ''}`}
    //           onClick={() => setEditMode(true)}
    //           whileHover={{ scale: 1.03 }}
    //           whileTap={{ scale: 0.98 }}
    //         >
    //           <FiEdit size={16} /> Edit Profile
    //         </motion.button>
    //       ) : (
    //         <div className={styles.editActions}>
    //           <motion.button
    //             className={`${styles.cancelButton} ${darkMode ? styles.dark : ''}`}
    //             onClick={() => {
    //               setEditMode(false);
    //               setAvatarPreview(null);
    //             }}
    //             whileHover={{ scale: 1.03 }}
    //             whileTap={{ scale: 0.98 }}
    //           >
    //             Cancel
    //           </motion.button>
    //           <motion.button
    //             className={`${styles.saveButton} ${darkMode ? styles.dark : ''}`}
    //             onClick={handleSubmit}
    //             whileHover={{ scale: 1.03 }}
    //             whileTap={{ scale: 0.98 }}
    //           >
    //             <FiSave size={16} /> Save Changes
    //           </motion.button>
    //         </div>
    //       )}
    //     </div>
    <div className={`${styles.tabContent} ${darkMode ? styles.dark : ''}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.profileContainer}
      >
        <div className={styles.profileHeader}>
          <h2>Profile Settings</h2>
          {!editMode ? (
            <motion.button
              className={`${styles.editButton} ${darkMode ? styles.dark : ''}`}
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiEdit size={16} /> Edit Profile
            </motion.button>
          ) : (
            <div className={styles.editActions}>
              <motion.button
                className={`${styles.cancelButton} ${darkMode ? styles.dark : ''}`}
                onClick={() => {
                  setEditMode(false);
                  setAvatarPreview(null);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className={`${styles.saveButton} ${darkMode ? styles.dark : ''}`}
                onClick={handleSubmit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
              >
                <FiSave size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading profile data...</p>
          </div>
        ) : (
          <>
        <div className={styles.settingsNav}>
          <button
            className={`${styles.navButton} ${activeSection === 'personal' ? styles.active : ''}`}
            onClick={() => setActiveSection('personal')}
          >
            Personal Info
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'affiliation' ? styles.active : ''}`}
            onClick={() => setActiveSection('affiliation')}
          >
            Affiliation
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'location' ? styles.active : ''}`}
            onClick={() => setActiveSection('location')}
          >
            Location
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'education' ? styles.active : ''}`}
            onClick={() => setActiveSection('education')}
          >
            Education
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'crashcourses' ? styles.active : ''}`}
            onClick={() => setActiveSection('crashcourses')}
          >
            Crash Courses
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'workExperience' ? styles.active : ''}`}
            onClick={() => setActiveSection('workExperience')}
          >
            Work Experience
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'awards' ? styles.active : ''}`}
            onClick={() => setActiveSection('awards')}
          >
            Awards
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'researchInterests' ? styles.active : ''}`}
            onClick={() => setActiveSection('researchInterests')}
          >
            Research Interests
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'teachingInterests' ? styles.active : ''}`}
            onClick={() => setActiveSection('teachingInterests')}
          >
            Teaching Interests
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'skills' ? styles.active : ''}`}
            onClick={() => setActiveSection('skills')}
          >
            Skills
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'technicalSkills' ? styles.active : ''}`}
            onClick={() => setActiveSection('technicalSkills')}
          >
            Technical Skills
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'languages' ? styles.active : ''}`}
            onClick={() => setActiveSection('languages')}
          >
            Languages
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'hobbies' ? styles.active : ''}`}
            onClick={() => setActiveSection('hobbies')}
          >
            Hobbies
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'certificates' ? styles.active : ''}`}
            onClick={() => setActiveSection('certificates')}
          >
            Certificates
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'socialMedia' ? styles.active : ''}`}
            onClick={() => setActiveSection('socialMedia')}
          >
            Social Media
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            Notifications
          </button>
        </div>

        <div className={styles.settingsContent}>
          {activeSection === 'personal' && renderPersonalInfo()}
          {activeSection === 'affiliation' && renderAffiliation()}
          {activeSection === 'location' && renderLocation()}
          {activeSection === 'education' && renderEducation()}
          {activeSection === 'crashcourses' && renderCrashCourses()}
          {activeSection === 'workExperience' && renderWorkExperience()}
          {activeSection === 'awards' && renderAwards()}
          {activeSection === 'researchInterests' && renderResearchInterests()}
          {activeSection === 'teachingInterests' && renderTeachingInterests()}
          {activeSection === 'skills' && renderSkills()}
          {activeSection === 'technicalSkills' && renderTechnicalSkills()}
          {activeSection === 'languages' && renderLanguages()}
          {activeSection === 'hobbies' && renderHobbies()}
          {activeSection === 'certificates' && renderCertificates()}
          {activeSection === 'socialMedia' && renderSocialMedia()}
          {activeSection === 'notifications' && renderNotificationSettings()}
        </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSettings;





































// import React, { useState, useEffect } from 'react';
// import { useTheme } from '../../../context/ThemeContext';
// import { useAuth } from '../../../context/authContext';
// import { motion } from 'framer-motion';
// import styles from './profileSettings.module.css';
// import { 
//   FiUser, FiMail, FiLock, FiSave, FiEdit, FiCamera,
//   FiLinkedin, FiGithub, FiTwitter, FiCalendar, FiBriefcase,
//   FiBook, FiCode, FiMapPin, FiPhone, FiGlobe, FiBookmark,
//   FiHome, FiLayers, FiAward, FiTool, FiClock, FiDollarSign
// } from 'react-icons/fi';

// const ProfileSettings = () => {
//   const { darkMode, toggleTheme } = useTheme();
//   const { user, updateUser } = useAuth();
//   const [editMode, setEditMode] = useState(false);
//   const [activeSection, setActiveSection] = useState('personal');
  
//   // Form data state
//   const [formData, setFormData] = useState({
//     // Personal Information
//     name: '',
//     email: '',
//     professionalTitle: '',
//     profileImage: '',
//     gender: '',
//     dateOfBirth: '',
//     phoneNumber: '',
//     alternateEmail: '',
//     bio: '',
    
//     // Social Media
//     socialMedia: {
//       twitter: '',
//       linkedin: '',
//       github: '',
//       researchGate: '',
//       googleScholar: '',
//       ORCID: ''
//     },
    
//     // Affiliation
//     affiliation: {
//       institution: '',
//       department: '',
//       position: '',
//       faculty: '',
//       joiningDate: '',
//       officeLocation: '',
//       officeHours: ''
//     },
    
//     // Location
//     location: {
//       address: '',
//       city: '',
//       state: '',
//       country: '',
//       postalCode: '',
//       timeZone: ''
//     },
    
//     // Education
//     education: [],
    
//     // Crash Courses
//     crashcourses: [],
    
//     // Work Experience
//     workExperience: [],
    
//     // Awards
//     awards: [],
    
//     // Skills
//     researchInterests: [],
//     teachingInterests: [],
//     skills: [],
//     technicalSkills: [],
//     languages: [],
//     hobbies: [],
    
//     // Certificates
//     certificates: [],
    
//     // Notification Preferences
//     notificationPreferences: {
//       emailNotifications: true,
//       pushNotifications: true
//     }
//   });

//   // Temporary form states for adding new items
//   const [newEducation, setNewEducation] = useState({
//     degree: '',
//     field: '',
//     institution: '',
//     grade: '',
//     startdate: '',
//     enddate: '',
//     description: ''
//   });
  
//   const [newCrashCourse, setNewCrashCourse] = useState({
//     course: '',
//     field: '',
//     organization: ''
//   });
  
//   const [newWorkExperience, setNewWorkExperience] = useState({
//     position: '',
//     organization: '',
//     startDate: '',
//     endDate: '',
//     current: false,
//     description: ''
//   });
  
//   const [newAward, setNewAward] = useState({
//     title: '',
//     year: '',
//     description: ''
//   });
  
//   const [newTechnicalSkill, setNewTechnicalSkill] = useState({
//     name: '',
//     level: 'intermediate'
//   });
  
//   const [newLanguage, setNewLanguage] = useState({
//     name: '',
//     proficiency: 'professional'
//   });
  
//   const [newCertificate, setNewCertificate] = useState({
//     title: '',
//     organization: '',
//     issueDate: '',
//     certID: '',
//     credentialslink: ''
//   });
  
//   const [newResearchInterest, setNewResearchInterest] = useState('');
//   const [newTeachingInterest, setNewTeachingInterest] = useState('');
//   const [newSkill, setNewSkill] = useState('');
//   const [newHobby, setNewHobby] = useState('');

//   const [avatarPreview, setAvatarPreview] = useState(null);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         email: user.email || '',
//         professionalTitle: user.professionalTitle || '',
//         profileImage: user.profileImage || '',
//         gender: user.gender || '',
//         dateOfBirth: user.dateOfBirth || '',
//         phoneNumber: user.phoneNumber || '',
//         alternateEmail: user.alternateEmail || '',
//         bio: user.bio || '',
        
//         socialMedia: user.socialMedia || {
//           twitter: '',
//           linkedin: '',
//           github: '',
//           researchGate: '',
//           googleScholar: '',
//           ORCID: ''
//         },
        
//         affiliation: user.affiliation || {
//           institution: '',
//           department: '',
//           position: '',
//           faculty: '',
//           joiningDate: '',
//           officeLocation: '',
//           officeHours: ''
//         },
        
//         location: user.location || {
//           address: '',
//           city: '',
//           state: '',
//           country: '',
//           postalCode: '',
//           timeZone: ''
//         },
        
//         education: user.education || [],
//         crashcourses: user.crashcourses || [],
//         workExperience: user.workExperience || [],
//         awards: user.awards || [],
//         researchInterests: user.researchInterests || [],
//         teachingInterests: user.teachingInterests || [],
//         skills: user.skills || [],
//         technicalSkills: user.technicalSkills || [],
//         languages: user.languages || [],
//         hobbies: user.hobbies || [],
//         certificates: user.certificates || [],
        
//         notificationPreferences: user.notificationPreferences || {
//           emailNotifications: true,
//           pushNotifications: true
//         }
//       });
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSocialMediaChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       socialMedia: {
//         ...prev.socialMedia,
//         [name]: value
//       }
//     }));
//   };

//   const handleAffiliationChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       affiliation: {
//         ...prev.affiliation,
//         [name]: value
//       }
//     }));
//   };

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       location: {
//         ...prev.location,
//         [name]: value
//       }
//     }));
//   };

//   const handleNotificationPrefChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       notificationPreferences: {
//         ...prev.notificationPreferences,
//         [name]: checked
//       }
//     }));
//   };

//   const handleEducationChange = (e) => {
//     const { name, value } = e.target;
//     setNewEducation(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCrashCourseChange = (e) => {
//     const { name, value } = e.target;
//     setNewCrashCourse(prev => ({ ...prev, [name]: value }));
//   };

//   const handleWorkExperienceChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewWorkExperience(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleAwardChange = (e) => {
//     const { name, value } = e.target;
//     setNewAward(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTechnicalSkillChange = (e) => {
//     const { name, value } = e.target;
//     setNewTechnicalSkill(prev => ({ ...prev, [name]: value }));
//   };

//   const handleLanguageChange = (e) => {
//     const { name, value } = e.target;
//     setNewLanguage(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCertificateChange = (e) => {
//     const { name, value } = e.target;
//     setNewCertificate(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Add items to arrays
//   const addEducation = () => {
//     if (newEducation.institution && newEducation.degree) {
//       setFormData(prev => ({
//         ...prev,
//         education: [...prev.education, newEducation]
//       }));
//       setNewEducation({
//         degree: '',
//         field: '',
//         institution: '',
//         grade: '',
//         startdate: '',
//         enddate: '',
//         description: ''
//       });
//     }
//   };

//   const addCrashCourse = () => {
//     if (newCrashCourse.course && newCrashCourse.organization) {
//       setFormData(prev => ({
//         ...prev,
//         crashcourses: [...prev.crashcourses, newCrashCourse]
//       }));
//       setNewCrashCourse({
//         course: '',
//         field: '',
//         organization: ''
//       });
//     }
//   };

//   const addWorkExperience = () => {
//     if (newWorkExperience.position && newWorkExperience.organization) {
//       setFormData(prev => ({
//         ...prev,
//         workExperience: [...prev.workExperience, newWorkExperience]
//       }));
//       setNewWorkExperience({
//         position: '',
//         organization: '',
//         startDate: '',
//         endDate: '',
//         current: false,
//         description: ''
//       });
//     }
//   };

//   const addAward = () => {
//     if (newAward.title && newAward.year) {
//       setFormData(prev => ({
//         ...prev,
//         awards: [...prev.awards, newAward]
//       }));
//       setNewAward({
//         title: '',
//         year: '',
//         description: ''
//       });
//     }
//   };

//   const addTechnicalSkill = () => {
//     if (newTechnicalSkill.name) {
//       setFormData(prev => ({
//         ...prev,
//         technicalSkills: [...prev.technicalSkills, newTechnicalSkill]
//       }));
//       setNewTechnicalSkill({
//         name: '',
//         level: 'intermediate'
//       });
//     }
//   };

//   const addLanguage = () => {
//     if (newLanguage.name) {
//       setFormData(prev => ({
//         ...prev,
//         languages: [...prev.languages, newLanguage]
//       }));
//       setNewLanguage({
//         name: '',
//         proficiency: 'professional'
//       });
//     }
//   };

//   const addCertificate = () => {
//     if (newCertificate.title && newCertificate.organization) {
//       setFormData(prev => ({
//         ...prev,
//         certificates: [...prev.certificates, newCertificate]
//       }));
//       setNewCertificate({
//         title: '',
//         organization: '',
//         issueDate: '',
//         certID: '',
//         credentialslink: ''
//       });
//     }
//   };

//   const addResearchInterest = () => {
//     if (newResearchInterest.trim() && !formData.researchInterests.includes(newResearchInterest.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         researchInterests: [...prev.researchInterests, newResearchInterest.trim()]
//       }));
//       setNewResearchInterest('');
//     }
//   };

//   const addTeachingInterest = () => {
//     if (newTeachingInterest.trim() && !formData.teachingInterests.includes(newTeachingInterest.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         teachingInterests: [...prev.teachingInterests, newTeachingInterest.trim()]
//       }));
//       setNewTeachingInterest('');
//     }
//   };

//   const addSkill = () => {
//     if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, newSkill.trim()]
//       }));
//       setNewSkill('');
//     }
//   };

//   const addHobby = () => {
//     if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         hobbies: [...prev.hobbies, newHobby.trim()]
//       }));
//       setNewHobby('');
//     }
//   };

//   // Remove items from arrays
//   const removeEducation = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index)
//     }));
//   };

//   const removeCrashCourse = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       crashcourses: prev.crashcourses.filter((_, i) => i !== index)
//     }));
//   };

//   const removeWorkExperience = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       workExperience: prev.workExperience.filter((_, i) => i !== index)
//     }));
//   };

//   const removeAward = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       awards: prev.awards.filter((_, i) => i !== index)
//     }));
//   };

//   const removeTechnicalSkill = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
//     }));
//   };

//   const removeLanguage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       languages: prev.languages.filter((_, i) => i !== index)
//     }));
//   };

//   const removeCertificate = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       certificates: prev.certificates.filter((_, i) => i !== index)
//     }));
//   };

//   const removeResearchInterest = (interest) => {
//     setFormData(prev => ({
//       ...prev,
//       researchInterests: prev.researchInterests.filter(i => i !== interest)
//     }));
//   };

//   const removeTeachingInterest = (interest) => {
//     setFormData(prev => ({
//       ...prev,
//       teachingInterests: prev.teachingInterests.filter(i => i !== interest)
//     }));
//   };

//   const removeSkill = (skill) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(s => s !== skill)
//     }));
//   };

//   const removeHobby = (hobby) => {
//     setFormData(prev => ({
//       ...prev,
//       hobbies: prev.hobbies.filter(h => h !== hobby)
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedData = {
//       ...formData,
//       ...(avatarPreview && { profileImage: avatarPreview })
//     };
//     updateUser(updatedData);
//     setEditMode(false);
//   };

//   const renderPersonalInfo = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.avatarSection}>
//         <div className={styles.avatarContainer}>
//           <div className={styles.userAvatarLarge} style={
//             avatarPreview ? { backgroundImage: `url(${avatarPreview})` } :
//             formData.profileImage ? { backgroundImage: `url(${formData.profileImage})` } : {}
//           }>
//             {!avatarPreview && !formData.profileImage && (formData.name?.charAt(0)?.toUpperCase() || 'A')}
//           </div>
//           {editMode && (
//             <motion.label
//               className={styles.avatarEdit}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FiCamera size={18} />
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 style={{ display: 'none' }} 
//                 onChange={handleAvatarChange}
//               />
//             </motion.label>
//           )}
//         </div>
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiUser size={16} /> Full Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           required
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiMail size={16} /> Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           required
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Professional Title</label>
//         <input
//           type="text"
//           name="professionalTitle"
//           value={formData.professionalTitle}
//           onChange={handleInputChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Gender</label>
//         <select
//           name="gender"
//           value={formData.gender}
//           onChange={handleInputChange}
//           disabled={!editMode}
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiCalendar size={16} /> Date of Birth</label>
//         <input
//           type="date"
//           name="dateOfBirth"
//           value={formData.dateOfBirth}
//           onChange={handleInputChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiPhone size={16} /> Phone Number</label>
//         <input
//           type="tel"
//           name="phoneNumber"
//           value={formData.phoneNumber}
//           onChange={handleInputChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiMail size={16} /> Alternate Email</label>
//         <input
//           type="email"
//           name="alternateEmail"
//           value={formData.alternateEmail}
//           onChange={handleInputChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Bio</label>
//         <textarea
//           name="bio"
//           value={formData.bio}
//           onChange={handleInputChange}
//           rows="3"
//           disabled={!editMode}
//         />
//       </div>
//     </div>
//   );

//   const renderAffiliation = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.formGroup}>
//         <label><FiHome size={16} /> Institution</label>
//         <input
//           type="text"
//           name="institution"
//           value={formData.affiliation.institution}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Department</label>
//         <input
//           type="text"
//           name="department"
//           value={formData.affiliation.department}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Position</label>
//         <input
//           type="text"
//           name="position"
//           value={formData.affiliation.position}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Faculty</label>
//         <input
//           type="text"
//           name="faculty"
//           value={formData.affiliation.faculty}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiCalendar size={16} /> Joining Date</label>
//         <input
//           type="date"
//           name="joiningDate"
//           value={formData.affiliation.joiningDate}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Office Location</label>
//         <input
//           type="text"
//           name="officeLocation"
//           value={formData.affiliation.officeLocation}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiClock size={16} /> Office Hours</label>
//         <input
//           type="text"
//           name="officeHours"
//           value={formData.affiliation.officeHours}
//           onChange={handleAffiliationChange}
//           disabled={!editMode}
//         />
//       </div>
//     </div>
//   );

//   const renderLocation = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.formGroup}>
//         <label><FiMapPin size={16} /> Address</label>
//         <input
//           type="text"
//           name="address"
//           value={formData.location.address}
//           onChange={handleLocationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>City</label>
//         <input
//           type="text"
//           name="city"
//           value={formData.location.city}
//           onChange={handleLocationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>State/Province</label>
//         <input
//           type="text"
//           name="state"
//           value={formData.location.state}
//           onChange={handleLocationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Country</label>
//         <input
//           type="text"
//           name="country"
//           value={formData.location.country}
//           onChange={handleLocationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Postal Code</label>
//         <input
//           type="text"
//           name="postalCode"
//           value={formData.location.postalCode}
//           onChange={handleLocationChange}
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Time Zone</label>
//         <input
//           type="text"
//           name="timeZone"
//           value={formData.location.timeZone}
//           onChange={handleLocationChange}
//           disabled={!editMode}
//         />
//       </div>
//     </div>
//   );

//   const renderEducation = () => (
//     <div className={styles.sectionContent}>
//       {formData.education.map((edu, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeEducation(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{edu.degree} in {edu.field}</h4>
//           <p className={styles.institution}>{edu.institution}</p>
//           <p className={styles.dates}>
//             {edu.startdate} - {edu.enddate || 'Present'} | Grade: {edu.grade}
//           </p>
//           {edu.description && <p className={styles.description}>{edu.description}</p>}
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Education</h4>
//           <div className={styles.formGroup}>
//             <label>Degree</label>
//             <input
//               type="text"
//               name="degree"
//               value={newEducation.degree}
//               onChange={handleEducationChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Field of Study</label>
//             <input
//               type="text"
//               name="field"
//               value={newEducation.field}
//               onChange={handleEducationChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Institution</label>
//             <input
//               type="text"
//               name="institution"
//               value={newEducation.institution}
//               onChange={handleEducationChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Grade</label>
//             <input
//               type="text"
//               name="grade"
//               value={newEducation.grade}
//               onChange={handleEducationChange}
//             />
//           </div>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label>Start Date</label>
//               <input
//                 type="date"
//                 name="startdate"
//                 value={newEducation.startdate}
//                 onChange={handleEducationChange}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>End Date</label>
//               <input
//                 type="date"
//                 name="enddate"
//                 value={newEducation.enddate}
//                 onChange={handleEducationChange}
//               />
//             </div>
//           </div>
//           <div className={styles.formGroup}>
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={newEducation.description}
//               onChange={handleEducationChange}
//               rows="2"
//             />
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addEducation}
//             disabled={!newEducation.degree || !newEducation.institution}
//           >
//             Add Education
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderCrashCourses = () => (
//     <div className={styles.sectionContent}>
//       {formData.crashcourses.map((course, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeCrashCourse(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{course.course}</h4>
//           <p className={styles.field}>{course.field}</p>
//           <p className={styles.organization}>Organization: {course.organization}</p>
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Crash Course</h4>
//           <div className={styles.formGroup}>
//             <label>Course Name</label>
//             <input
//               type="text"
//               name="course"
//               value={newCrashCourse.course}
//               onChange={handleCrashCourseChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Field</label>
//             <input
//               type="text"
//               name="field"
//               value={newCrashCourse.field}
//               onChange={handleCrashCourseChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Organization</label>
//             <input
//               type="text"
//               name="organization"
//               value={newCrashCourse.organization}
//               onChange={handleCrashCourseChange}
//             />
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addCrashCourse}
//             disabled={!newCrashCourse.course || !newCrashCourse.organization}
//           >
//             Add Crash Course
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderWorkExperience = () => (
//     <div className={styles.sectionContent}>
//       {formData.workExperience.map((exp, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeWorkExperience(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{exp.position}</h4>
//           <p className={styles.organization}>{exp.organization}</p>
//           <p className={styles.dates}>
//             {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
//           </p>
//           {exp.description && <p className={styles.description}>{exp.description}</p>}
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Work Experience</h4>
//           <div className={styles.formGroup}>
//             <label>Position</label>
//             <input
//               type="text"
//               name="position"
//               value={newWorkExperience.position}
//               onChange={handleWorkExperienceChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Organization</label>
//             <input
//               type="text"
//               name="organization"
//               value={newWorkExperience.organization}
//               onChange={handleWorkExperienceChange}
//             />
//           </div>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label>Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={newWorkExperience.startDate}
//                 onChange={handleWorkExperienceChange}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={newWorkExperience.endDate}
//                 onChange={handleWorkExperienceChange}
//                 disabled={newWorkExperience.current}
//               />
//             </div>
//           </div>
//           <div className={styles.formGroup}>
//             <label>
//               <input
//                 type="checkbox"
//                 name="current"
//                 checked={newWorkExperience.current}
//                 onChange={handleWorkExperienceChange}
//               />
//               I currently work here
//             </label>
//           </div>
//           <div className={styles.formGroup}>
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={newWorkExperience.description}
//               onChange={handleWorkExperienceChange}
//               rows="3"
//             />
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addWorkExperience}
//             disabled={!newWorkExperience.position || !newWorkExperience.organization}
//           >
//             Add Experience
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderAwards = () => (
//     <div className={styles.sectionContent}>
//       {formData.awards.map((award, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeAward(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{award.title}</h4>
//           <p className={styles.year}>Year: {award.year}</p>
//           {award.description && <p className={styles.description}>{award.description}</p>}
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Award</h4>
//           <div className={styles.formGroup}>
//             <label>Title</label>
//             <input
//               type="text"
//               name="title"
//               value={newAward.title}
//               onChange={handleAwardChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Year</label>
//             <input
//               type="number"
//               name="year"
//               value={newAward.year}
//               onChange={handleAwardChange}
//               min="1900"
//               max={new Date().getFullYear()}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={newAward.description}
//               onChange={handleAwardChange}
//               rows="2"
//             />
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addAward}
//             disabled={!newAward.title || !newAward.year}
//           >
//             Add Award
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderResearchInterests = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.skillsSection}>
//         <h4>Research Interests</h4>
//         <div className={styles.skillsContainer}>
//           {formData.researchInterests.map((interest, index) => (
//             <div key={index} className={styles.skillTag}>
//               {interest}
//               {editMode && (
//                 <button 
//                   className={styles.removeTagButton}
//                   onClick={() => removeResearchInterest(interest)}
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
        
//         {editMode && (
//           <div className={styles.addSkill}>
//             <input
//               type="text"
//               value={newResearchInterest}
//               onChange={(e) => setNewResearchInterest(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && addResearchInterest()}
//               placeholder="Add research interest and press Enter"
//             />
//             <button 
//               type="button" 
//               className={styles.addButtonSmall}
//               onClick={addResearchInterest}
//               disabled={!newResearchInterest.trim()}
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderTeachingInterests = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.skillsSection}>
//         <h4>Teaching Interests</h4>
//         <div className={styles.skillsContainer}>
//           {formData.teachingInterests.map((interest, index) => (
//             <div key={index} className={styles.skillTag}>
//               {interest}
//               {editMode && (
//                 <button 
//                   className={styles.removeTagButton}
//                   onClick={() => removeTeachingInterest(interest)}
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
        
//         {editMode && (
//           <div className={styles.addSkill}>
//             <input
//               type="text"
//               value={newTeachingInterest}
//               onChange={(e) => setNewTeachingInterest(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && addTeachingInterest()}
//               placeholder="Add teaching interest and press Enter"
//             />
//             <button 
//               type="button" 
//               className={styles.addButtonSmall}
//               onClick={addTeachingInterest}
//               disabled={!newTeachingInterest.trim()}
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderSkills = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.skillsSection}>
//         <h4>General Skills</h4>
//         <div className={styles.skillsContainer}>
//           {formData.skills.map((skill, index) => (
//             <div key={index} className={styles.skillTag}>
//               {skill}
//               {editMode && (
//                 <button 
//                   className={styles.removeTagButton}
//                   onClick={() => removeSkill(skill)}
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
        
//         {editMode && (
//           <div className={styles.addSkill}>
//             <input
//               type="text"
//               value={newSkill}
//               onChange={(e) => setNewSkill(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && addSkill()}
//               placeholder="Add skill and press Enter"
//             />
//             <button 
//               type="button" 
//               className={styles.addButtonSmall}
//               onClick={addSkill}
//               disabled={!newSkill.trim()}
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderTechnicalSkills = () => (
//     <div className={styles.sectionContent}>
//       {formData.technicalSkills.map((skill, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeTechnicalSkill(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{skill.name}</h4>
//           <p>Level: {skill.level}</p>
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Technical Skill</h4>
//           <div className={styles.formGroup}>
//             <label>Skill Name</label>
//             <input
//               type="text"
//               name="name"
//               value={newTechnicalSkill.name}
//               onChange={handleTechnicalSkillChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Proficiency Level</label>
//             <select
//               name="level"
//               value={newTechnicalSkill.level}
//               onChange={handleTechnicalSkillChange}
//             >
//               <option value="beginner">Beginner</option>
//               <option value="intermediate">Intermediate</option>
//               <option value="advanced">Advanced</option>
//               <option value="expert">Expert</option>
//             </select>
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addTechnicalSkill}
//             disabled={!newTechnicalSkill.name}
//           >
//             Add Technical Skill
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderLanguages = () => (
//     <div className={styles.sectionContent}>
//       {formData.languages.map((lang, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeLanguage(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{lang.name}</h4>
//           <p>Proficiency: {lang.proficiency}</p>
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Language</h4>
//           <div className={styles.formGroup}>
//             <label>Language</label>
//             <input
//               type="text"
//               name="name"
//               value={newLanguage.name}
//               onChange={handleLanguageChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Proficiency</label>
//             <select
//               name="proficiency"
//               value={newLanguage.proficiency}
//               onChange={handleLanguageChange}
//             >
//               <option value="basic">Basic</option>
//               <option value="conversational">Conversational</option>
//               <option value="professional">Professional</option>
//               <option value="fluent">Fluent</option>
//               <option value="native">Native</option>
//             </select>
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addLanguage}
//             disabled={!newLanguage.name}
//           >
//             Add Language
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderHobbies = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.skillsSection}>
//         <h4>Hobbies & Interests</h4>
//         <div className={styles.skillsContainer}>
//           {formData.hobbies.map((hobby, index) => (
//             <div key={index} className={styles.skillTag}>
//               {hobby}
//               {editMode && (
//                 <button 
//                   className={styles.removeTagButton}
//                   onClick={() => removeHobby(hobby)}
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
        
//         {editMode && (
//           <div className={styles.addSkill}>
//             <input
//               type="text"
//               value={newHobby}
//               onChange={(e) => setNewHobby(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && addHobby()}
//               placeholder="Add hobby and press Enter"
//             />
//             <button 
//               type="button" 
//               className={styles.addButtonSmall}
//               onClick={addHobby}
//               disabled={!newHobby.trim()}
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderCertificates = () => (
//     <div className={styles.sectionContent}>
//       {formData.certificates.map((cert, index) => (
//         <div key={index} className={styles.itemCard}>
//           {editMode && (
//             <button 
//               className={styles.removeButton}
//               onClick={() => removeCertificate(index)}
//             >
//               ×
//             </button>
//           )}
//           <h4>{cert.title}</h4>
//           <p className={styles.organization}>Issued by: {cert.organization}</p>
//           <p className={styles.date}>Issue Date: {cert.issueDate}</p>
//           {cert.certID && <p className={styles.credential}>Credential ID: {cert.certID}</p>}
//           {cert.credentialslink && (
//             <a href={cert.credentialslink} target="_blank" rel="noopener noreferrer">
//               View Credential
//             </a>
//           )}
//         </div>
//       ))}

//       {editMode && (
//         <div className={styles.addForm}>
//           <h4>Add Certificate</h4>
//           <div className={styles.formGroup}>
//             <label>Certificate Title</label>
//             <input
//               type="text"
//               name="title"
//               value={newCertificate.title}
//               onChange={handleCertificateChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Organization</label>
//             <input
//               type="text"
//               name="organization"
//               value={newCertificate.organization}
//               onChange={handleCertificateChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Issue Date</label>
//             <input
//               type="date"
//               name="issueDate"
//               value={newCertificate.issueDate}
//               onChange={handleCertificateChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Credential ID (optional)</label>
//             <input
//               type="text"
//               name="certID"
//               value={newCertificate.certID}
//               onChange={handleCertificateChange}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Credentials Link (optional)</label>
//             <input
//               type="url"
//               name="credentialslink"
//               value={newCertificate.credentialslink}
//               onChange={handleCertificateChange}
//               placeholder="https://example.com/certificate"
//             />
//           </div>
//           <button 
//             type="button" 
//             className={styles.addButton}
//             onClick={addCertificate}
//             disabled={!newCertificate.title || !newCertificate.organization}
//           >
//             Add Certificate
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const renderSocialMedia = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.formGroup}>
//         <label><FiTwitter size={16} /> Twitter</label>
//         <input
//           type="url"
//           name="twitter"
//           value={formData.socialMedia.twitter}
//           onChange={handleSocialMediaChange}
//           placeholder="https://twitter.com/username"
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiLinkedin size={16} /> LinkedIn</label>
//         <input
//           type="url"
//           name="linkedin"
//           value={formData.socialMedia.linkedin}
//           onChange={handleSocialMediaChange}
//           placeholder="https://linkedin.com/in/username"
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label><FiGithub size={16} /> GitHub</label>
//         <input
//           type="url"
//           name="github"
//           value={formData.socialMedia.github}
//           onChange={handleSocialMediaChange}
//           placeholder="https://github.com/username"
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>ResearchGate</label>
//         <input
//           type="url"
//           name="researchGate"
//           value={formData.socialMedia.researchGate}
//           onChange={handleSocialMediaChange}
//           placeholder="https://www.researchgate.net/profile/username"
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Google Scholar</label>
//         <input
//           type="url"
//           name="googleScholar"
//           value={formData.socialMedia.googleScholar}
//           onChange={handleSocialMediaChange}
//           placeholder="https://scholar.google.com/citations?user=ID"
//           disabled={!editMode}
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>ORCID</label>
//         <input
//           type="text"
//           name="ORCID"
//           value={formData.socialMedia.ORCID}
//           onChange={handleSocialMediaChange}
//           placeholder="0000-0000-0000-0000"
//           disabled={!editMode}
//         />
//       </div>
//     </div>
//   );

//   const renderNotificationSettings = () => (
//     <div className={styles.sectionContent}>
//       <div className={styles.formGroup}>
//         <label>
//           <input
//             type="checkbox"
//             name="emailNotifications"
//             checked={formData.notificationPreferences.emailNotifications}
//             onChange={handleNotificationPrefChange}
//             disabled={!editMode}
//           />
//           Email Notifications
//         </label>
//       </div>

//       <div className={styles.formGroup}>
//         <label>
//           <input
//             type="checkbox"
//             name="pushNotifications"
//             checked={formData.notificationPreferences.pushNotifications}
//             onChange={handleNotificationPrefChange}
//             disabled={!editMode}
//           />
//           Push Notifications
//         </label>
//       </div>
//     </div>
//   );

//   return (
//     <div className={`${styles.tabContent} ${darkMode ? styles.dark : ''}`}>
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={styles.profileContainer}
//       >
//         <div className={styles.profileHeader}>
//           <h2>Profile Settings</h2>
//           {!editMode ? (
//             <motion.button
//               className={`${styles.editButton} ${darkMode ? styles.dark : ''}`}
//               onClick={() => setEditMode(true)}
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <FiEdit size={16} /> Edit Profile
//             </motion.button>
//           ) : (
//             <div className={styles.editActions}>
//               <motion.button
//                 className={`${styles.cancelButton} ${darkMode ? styles.dark : ''}`}
//                 onClick={() => {
//                   setEditMode(false);
//                   setAvatarPreview(null);
//                 }}
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Cancel
//               </motion.button>
//               <motion.button
//                 className={`${styles.saveButton} ${darkMode ? styles.dark : ''}`}
//                 onClick={handleSubmit}
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <FiSave size={16} /> Save Changes
//               </motion.button>
//             </div>
//           )}
//         </div>

//         <div className={styles.settingsNav}>
//           <button
//             className={`${styles.navButton} ${activeSection === 'personal' ? styles.active : ''}`}
//             onClick={() => setActiveSection('personal')}
//           >
//             Personal Info
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'affiliation' ? styles.active : ''}`}
//             onClick={() => setActiveSection('affiliation')}
//           >
//             Affiliation
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'location' ? styles.active : ''}`}
//             onClick={() => setActiveSection('location')}
//           >
//             Location
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'education' ? styles.active : ''}`}
//             onClick={() => setActiveSection('education')}
//           >
//             Education
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'crashcourses' ? styles.active : ''}`}
//             onClick={() => setActiveSection('crashcourses')}
//           >
//             Crash Courses
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'workExperience' ? styles.active : ''}`}
//             onClick={() => setActiveSection('workExperience')}
//           >
//             Work Experience
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'awards' ? styles.active : ''}`}
//             onClick={() => setActiveSection('awards')}
//           >
//             Awards
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'researchInterests' ? styles.active : ''}`}
//             onClick={() => setActiveSection('researchInterests')}
//           >
//             Research Interests
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'teachingInterests' ? styles.active : ''}`}
//             onClick={() => setActiveSection('teachingInterests')}
//           >
//             Teaching Interests
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'skills' ? styles.active : ''}`}
//             onClick={() => setActiveSection('skills')}
//           >
//             Skills
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'technicalSkills' ? styles.active : ''}`}
//             onClick={() => setActiveSection('technicalSkills')}
//           >
//             Technical Skills
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'languages' ? styles.active : ''}`}
//             onClick={() => setActiveSection('languages')}
//           >
//             Languages
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'hobbies' ? styles.active : ''}`}
//             onClick={() => setActiveSection('hobbies')}
//           >
//             Hobbies
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'certificates' ? styles.active : ''}`}
//             onClick={() => setActiveSection('certificates')}
//           >
//             Certificates
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'socialMedia' ? styles.active : ''}`}
//             onClick={() => setActiveSection('socialMedia')}
//           >
//             Social Media
//           </button>
//           <button
//             className={`${styles.navButton} ${activeSection === 'notifications' ? styles.active : ''}`}
//             onClick={() => setActiveSection('notifications')}
//           >
//             Notifications
//           </button>
//         </div>

//         <div className={styles.settingsContent}>
//           {activeSection === 'personal' && renderPersonalInfo()}
//           {activeSection === 'affiliation' && renderAffiliation()}
//           {activeSection === 'location' && renderLocation()}
//           {activeSection === 'education' && renderEducation()}
//           {activeSection === 'crashcourses' && renderCrashCourses()}
//           {activeSection === 'workExperience' && renderWorkExperience()}
//           {activeSection === 'awards' && renderAwards()}
//           {activeSection === 'researchInterests' && renderResearchInterests()}
//           {activeSection === 'teachingInterests' && renderTeachingInterests()}
//           {activeSection === 'skills' && renderSkills()}
//           {activeSection === 'technicalSkills' && renderTechnicalSkills()}
//           {activeSection === 'languages' && renderLanguages()}
//           {activeSection === 'hobbies' && renderHobbies()}
//           {activeSection === 'certificates' && renderCertificates()}
//           {activeSection === 'socialMedia' && renderSocialMedia()}
//           {activeSection === 'notifications' && renderNotificationSettings()}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ProfileSettings;