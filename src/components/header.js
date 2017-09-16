import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Constants } from 'expo';
import colors from '../colors';

const Header = ({ statusBarPadding, children }) => (
  <View style={[styles.header, statusBarPadding && styles.headerWithStatusBar]}>
    {children}
  </View>
);

Header.propTypes = {
  statusBarPadding: PropTypes.bool,
  children: PropTypes.node,
};

Header.defaultProps = {
  statusBarPadding: null,
  children: null,
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: colors.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerWithStatusBar: {
    paddingTop: Constants.statusBarHeight,
    height: 56 + Constants.statusBarHeight,
  },
});

export default Header;
