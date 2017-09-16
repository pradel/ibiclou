import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const IconButton = ({ iconSize, name, color, onPress }) => (
  <TouchableOpacity style={styles.touchableIcon} onPress={onPress}>
    <MaterialIcons name={name} size={iconSize} color={color} />
  </TouchableOpacity>
);

IconButton.propTypes = {
  iconSize: PropTypes.number,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

IconButton.defaultProps = {
  iconSize: 24,
  color: 'white',
};

const styles = StyleSheet.create({
  touchableIcon: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
