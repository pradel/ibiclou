import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { MapView } from 'expo';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const Map = ({
  region,
  stations,
  onRegionChange,
  onPressMap,
  onPressMarker,
}) => (
  <MapView
    style={styles.map}
    region={region}
    onRegionChange={onRegionChange}
    onRegionChangeComplete={onRegionChange}
    onPress={onPressMap}
  >
    {stations.map(marker => (
      <MapView.Marker
        key={marker.id}
        coordinate={marker.latlng}
        image={marker.image}
        onPress={() => {
          onPressMarker(marker);
        }}
      />
    ))}
  </MapView>
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

Map.propTypes = {
  region: PropTypes.object.isRequired,
  stations: PropTypes.array.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onPressMap: PropTypes.func.isRequired,
  onPressMarker: PropTypes.func.isRequired,
};

export default onlyUpdateForKeys(['region', 'stations'])(Map);
