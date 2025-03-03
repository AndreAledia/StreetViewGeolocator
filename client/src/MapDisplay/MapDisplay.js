import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from './MapDisplay.module.css';
import { blueIcon } from './leaflet-color-markers-master/js/leaflet-color-markers';

import { goldIcon } from './leaflet-color-markers-master/js/leaflet-color-markers';
import { greenIcon } from './leaflet-color-markers-master/js/leaflet-color-markers';
import { greyIcon } from './leaflet-color-markers-master/js/leaflet-color-markers';
import { orangeIcon } from './leaflet-color-markers-master/js/leaflet-color-markers';
import { redIcon } from './leaflet-color-markers-master/js/leaflet-color-markers';

// uses leaflet to display coordinates on a map
function MapDisplay({ coordinates, landmarks, center }) {
  const LANDMARK_ICONS = [goldIcon, greenIcon, greyIcon, orangeIcon, redIcon]

  if (coordinates.length > 0 && center.length > 0) {
    return (
      <div className={styles.mapDisplay} id = "map">
        <h2 className='text-4xl font-bold'>Map Preview:</h2>
        <div>coordinates: {coordinates[0]}, {coordinates[1]}</div>
        <MapContainer
          key={center}
          center={center}
          zoom={17}
          className={styles.mapContainer}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates} icon={blueIcon}>
            <Popup>coordinates: {coordinates[0]}, {coordinates[1]}</Popup>
          </Marker>
          {Object.entries(landmarks).map(([id, marker], index) => (
            <Marker key={id} position={marker[0]} icon={LANDMARK_ICONS[index]}>
              <Popup>{marker[1].name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  } else {
    return (
      <div className={styles.mapDisplay}>
        <div className={styles.noCoordinates}>No coordinates</div>
      </div>
    );
  }
}

export default MapDisplay;