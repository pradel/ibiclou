import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Animated } from 'react-native';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import colors from './colors';

class StationInfo extends React.Component {
  state = {
    fadeAnim: new Animated.Value(200),
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.selectedStation && nextProps.selectedStation) {
      Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        duration: 400,
      }).start();
    } else if (this.props.selectedStation && !nextProps.selectedStation) {
      Animated.timing(this.state.fadeAnim, {
        toValue: 200,
        duration: 400,
      }).start();
    }
  }

  render() {
    const { selectedStation, mode } = this.props;
    const { fadeAnim } = this.state;

    let color = colors.green;
    if (selectedStation) {
      if (mode === 'walk') {
        if (selectedStation.free_bikes <= 5) {
          color = colors.orange;
        }
        if (selectedStation.free_bikes <= 1) {
          color = colors.red;
        }
      } else {
        if (selectedStation.empty_slots <= 5) {
          color = colors.orange;
        }
        if (selectedStation.empty_slots <= 1) {
          color = colors.red;
        }
      }
    }
    const activeStyle = { backgroundColor: color };
    return (
      <Animated.View
        style={[styles.stationInfo, { transform: [{ translateY: fadeAnim }] }]}
      >
        {selectedStation && (
          <View>
            <Text style={styles.stationName}>{selectedStation.name}</Text>
            {selectedStation.address && (
              <Text style={styles.stationAddress}>
                {selectedStation.address}
              </Text>
            )}
            <View style={styles.stationNumberPlaces}>
              <View
                style={[
                  styles.stationNumberPlacesBlock,
                  styles.stationNumberPlacesBlockLeft,
                  mode === 'walk' && activeStyle,
                ]}
              >
                <Text style={styles.stationNumberPlacesTextNumber}>
                  {selectedStation.free_bikes}
                </Text>
                <Text style={styles.stationNumberPlacesText}>free bikes</Text>
              </View>
              <View
                style={[
                  styles.stationNumberPlacesBlock,
                  styles.stationNumberPlacesBlockRight,
                  mode === 'bike' && activeStyle,
                ]}
              >
                <Text style={styles.stationNumberPlacesTextNumber}>
                  {selectedStation.empty_slots}
                </Text>
                <Text style={styles.stationNumberPlacesText}>free stands</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    );
  }
}

StationInfo.propTypes = {
  selectedStation: PropTypes.object,
  mode: PropTypes.string.isRequired,
};

StationInfo.defaultProps = {
  selectedStation: null,
};

const styles = StyleSheet.create({
  stationInfo: {
    backgroundColor: '#fff',
    zIndex: 10,
    padding: 30,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  stationName: {
    color: colors.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stationAddress: {
    color: '#ADB8B8',
    textAlign: 'center',
  },
  stationNumberPlaces: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  stationNumberPlacesBlock: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#CFD0D1',
  },
  stationNumberPlacesBlockLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  stationNumberPlacesBlockRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  stationNumberPlacesTextNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  stationNumberPlacesText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default onlyUpdateForKeys(['selectedStation', 'mode'])(StationInfo);
