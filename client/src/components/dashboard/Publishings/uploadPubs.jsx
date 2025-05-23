import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';
import styles from './uploadPubs.module.css';
import { FiUpload, FiFileText, FiX, FiCheck, FiPlus, FiMinus, FiCalendar, FiUser } from 'react-icons/fi';

const UploadPublications = () => {
  const { darkMode } = useTheme();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    authors: [''],
    publicationDate: '',
    abstract: '',
    keywords: '',
    doi: '',
    journal: '',
    volume: '',
    issue: '',
    pages: ''
  });

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles) {
      setFiles(droppedFiles);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (index, value) => {
    const updatedAuthors = [...metadata.authors];
    updatedAuthors[index] = value;
    setMetadata(prev => ({ ...prev, authors: updatedAuthors }));
  };

  const addAuthorField = () => {
    setMetadata(prev => ({ ...prev, authors: [...prev.authors, ''] }));
  };

  const removeAuthorField = (index) => {
    if (metadata.authors.length > 1) {
      const updatedAuthors = [...metadata.authors];
      updatedAuthors.splice(index, 1);
      setMetadata(prev => ({ ...prev, authors: updatedAuthors }));
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    setUploadComplete(false);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetForm = () => {
    setFiles([]);
    setUploadProgress(null);
    setUploadComplete(false);
    setMetadata({
      title: '',
      authors: [''],
      publicationDate: '',
      abstract: '',
      keywords: '',
      doi: '',
      journal: '',
      volume: '',
      issue: '',
      pages: ''
    });
  };

  return (
    <div id='upload-content' className={`${styles.uploadContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h1><FiUpload size={24} /> Upload New Publication</h1>
        <p>Add your research publications to the repository</p>
      </div>

      <div className={styles.uploadGrid}>
        {/* File Upload Section */}
        <motion.div 
          className={`${styles.uploadSection} ${isDragging ? styles.dragging : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.uploadBox}>
            <FiUpload size={48} className={styles.uploadIcon} />
            <h3>Drag & Drop your files here</h3>
            <p>or</p>
            <label className={styles.browseButton}>
              Browse Files
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </label>
            <p className={styles.supportedFormats}>Supported formats: PDF, DOCX, PPTX</p>
          </div>

          {files.length > 0 && (
            <div className={styles.fileList}>
              <h4>Selected Files:</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <FiFileText size={18} />
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className={styles.removeButton}
                    >
                      <FiX size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Metadata Form Section */}
        <motion.div 
          className={styles.metadataSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2><FiFileText size={20} /> Publication Metadata</h2>
          
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={metadata.title}
              onChange={handleMetadataChange}
              placeholder="Enter publication title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Authors *</label>
            {metadata.authors.map((author, index) => (
              <div key={index} className={styles.authorInput}>
                <FiUser size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  placeholder={`Author ${index + 1} name`}
                  required
                />
                {metadata.authors.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeAuthorField(index)}
                    className={styles.authorRemoveButton}
                  >
                    <FiMinus size={16} />
                  </button>
                )}
                {index === metadata.authors.length - 1 && (
                  <button 
                    type="button" 
                    onClick={addAuthorField}
                    className={styles.authorAddButton}
                  >
                    <FiPlus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Publication Date *</label>
              <div className={styles.dateInput}>
                <FiCalendar size={18} className={styles.inputIcon} />
                <input
                  type="date"
                  name="publicationDate"
                  value={metadata.publicationDate}
                  onChange={handleMetadataChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>DOI</label>
              <input
                type="text"
                name="doi"
                value={metadata.doi}
                onChange={handleMetadataChange}
                placeholder="e.g. 10.1234/abcd"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Abstract *</label>
            <textarea
              name="abstract"
              value={metadata.abstract}
              onChange={handleMetadataChange}
              placeholder="Enter publication abstract"
              rows="4"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Keywords</label>
            <input
              type="text"
              name="keywords"
              value={metadata.keywords}
              onChange={handleMetadataChange}
              placeholder="Comma-separated keywords"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Journal/Conference</label>
              <input
                type="text"
                name="journal"
                value={metadata.journal}
                onChange={handleMetadataChange}
                placeholder="Journal or conference name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Volume</label>
              <input
                type="text"
                name="volume"
                value={metadata.volume}
                onChange={handleMetadataChange}
                placeholder="Volume number"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Issue</label>
              <input
                type="text"
                name="issue"
                value={metadata.issue}
                onChange={handleMetadataChange}
                placeholder="Issue number"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Pages</label>
              <input
                type="text"
                name="pages"
                value={metadata.pages}
                onChange={handleMetadataChange}
                placeholder="e.g. 123-130"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upload Progress and Actions */}
      <motion.div 
        className={styles.actionSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {uploadProgress !== null && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {uploadProgress}% {uploadComplete ? 'Upload Complete!' : 'Uploading...'}
            </span>
            {uploadComplete && (
              <div className={styles.successMessage}>
                <FiCheck size={20} /> Publication successfully uploaded!
              </div>
            )}
          </div>
        )}

        <div className={styles.actionButtons}>
          <button 
            className={styles.resetButton}
            onClick={resetForm}
          >
            Reset Form
          </button>
          <button 
            className={styles.uploadButton}
            onClick={simulateUpload}
            disabled={files.length === 0 || !metadata.title || !metadata.authors[0] || !metadata.publicationDate || !metadata.abstract}
          >
            Upload Publication
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPublications;