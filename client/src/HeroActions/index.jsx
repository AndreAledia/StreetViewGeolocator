import React, { useState, useRef } from 'react';
import styles from './HeroActions.module.css';

function HeroActions({
  buttonGroupAlign,
  buttonGroupButtonClassName,
  buttonGroupButtonClassNameOverride,
  buttonGroupText,
  platform,
  textContentTitleSubtitle,
  textContentTitleTitle,
  setCoordinates,
  setFile,
  file // Add file prop
}) {
  async function appears(elementID, timeout=500, scrollToEnd = true) {
    await new Promise(resolve => setTimeout(resolve, timeout));
      const element = document.getElementById(elementID);
      if (element) {
        if (scrollToEnd){
          element.scrollIntoView({behavior: "smooth", block: "end"})
        } else {
          element.scrollIntoView({behavior: "smooth"})
        }
        
      } 
  }

  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const previewRef = useRef(null);
  const dragCounter = useRef(0);


  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsSubmitted(false); // Reset submission status
      appears("submit")
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragOver(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsSubmitted(false); // Reset submission status
    }
  };

  const handleImageSubmit = async () => {
    const imageData = new FormData();
    imageData.append('image', file);

    try {
      const response = await fetch(process.env.REACT_APP_API_UPLOAD_URL, {
        method: 'POST',
        body: imageData
      });
      const data = await response.json();
      if (data.prediction) {
        setCoordinates(data.prediction);
        setIsSubmitted(true); // Set submission status to true
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={styles.heroActions}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`${styles.card} ${isDragOver ? styles.dragover : ''} ${preview ? styles.preview : ''} ${isSubmitted ? styles.submitted : styles.notSubmitted}`}>
        <div className={styles.textContentTitle}>
          <h1 className={styles.title}>{textContentTitleTitle}</h1>
          <p className={styles.subtitle}>{textContentTitleSubtitle}</p>
        </div>
        <div className={`${styles.buttonGroup} ${buttonGroupAlign}`}>
          <label className={`${styles.button} ${buttonGroupButtonClassName} ${buttonGroupButtonClassNameOverride}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {buttonGroupText}
          </label>
        </div>
      </div>
      {preview && (
        <div className={styles.previewContainer} id="submit" ref={previewRef}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <div className={`${styles.buttonGroup} ${buttonGroupAlign}`}>
            <button
              className={`${styles.button} ${buttonGroupButtonClassName} ${buttonGroupButtonClassNameOverride}`}
              onClick={handleImageSubmit}
            >
              Submit Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroActions;
