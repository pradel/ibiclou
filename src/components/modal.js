import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Modal, View, Text } from 'react-native';
import Header from './header';
import IconButton from './icon-button';

const ModalComponent = ({ children, visible, onRequestClose, title }) => (
  <Modal
    animationType={'slide'}
    transparent={false}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <Header>
      {title && <Text style={styles.headerText}>Choose your city</Text>}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton name="close" onPress={onRequestClose} />
      </View>
    </Header>
    {children}
  </Modal>
);

ModalComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};

ModalComponent.defaultProps = {
  children: null,
  title: null,
};

const styles = StyleSheet.create({
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 16,
  },
});

export default ModalComponent;
