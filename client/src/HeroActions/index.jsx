import React, { useState } from 'react';
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
  const [preview, setPreview] = useState(null);

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      appears("submit")
    }
  };

  // scrolls to the element in the DOM with a specific id when it appears
  // adjust timeout for the duration it will take for the element to appear, or 0 if it is already set
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

  const handleImageSubmit = async () => {
    if (file) {
      const imageData = new FormData();
      imageData.append('image', file);

      try {
        const response = await fetch("/upload", {
          method: 'POST',
          body: imageData
        });
        const data = await response.json();
        if (data.prediction) {
          console.log(data.prediction);
          setCoordinates(data.prediction);
          appears("map", 250, false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={styles.heroActions}>
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
      {preview && (
        <div className={styles.previewContainer} id="submit">
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
