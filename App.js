import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  Alert,
  Dimensions,
  BackHandler,
} from 'react-native';
import { AppLoading, Constants } from 'expo';
import Drawer from 'react-native-drawer';
import colors from './src/colors';
import Header from './src/components/header';
import Map from './src/map';
import StationInfo from './src/station-info';
import ListCities from './src/list-cities';
import Infos from './src/infos';
import IconButton from './src/components/icon-button';
import Modal from './src/components/modal';
import {
  getNetworkFromApi,
  formatStations,
  getMarkerImage,
  getUserLocation,
  distance,
} from './src/utils';

// TODO i18n
// TODO center location on user (button right corner)

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0102;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends React.Component {
  state = {
    isReady: false,
    selectedNetwork: null,
    selectedStation: null,
    stations: [],
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    modalVisible: false,
    modalVisibleInfos: false,
    drawerOpen: false,
    mode: 'walk',
    refreshIcon: 'refresh',
    refreshLoading: false,
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
    let userLocation;
    try {
      userLocation = await getUserLocation();
    } catch (err) {
      Alert.alert('Error', err.message || err);
    }
    try {
      const selectedNetworkId = await AsyncStorage.getItem('selectedNetworkId');
      // If user doesn't have a city selected (first connection) force him to choose one
      if (!selectedNetworkId) {
        this.setState({ modalVisible: true });
      } else {
        const network = await this.getStation(selectedNetworkId);
        // if user allow geolocation and is less than 20 km from the city center on him
        if (
          userLocation &&
          network.network &&
          distance(userLocation, network.network.location) < 20
        ) {
          this.changeRegion({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          });
        } else if (network.network) {
          this.changeRegion({
            latitude: network.network.location.latitude,
            longitude: network.network.location.longitude,
          });
        }
      }
      this.setState({ isReady: true });
    } catch (err) {
      Alert.alert('Error', err.message || err);
      this.setState({ isReady: true });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onHardwareBackPress
    );
  }

  onHardwareBackPress = () => {
    // if drawer is open don't close the app
    if (this.state.drawerOpen) {
      this.setState({ drawerOpen: false });
      return true;
    }
    // if a satation is selected don't close the app
    if (this.state.selectedStation) {
      this.setState({ selectedStation: null });
      return true;
    }
    return false;
  };

  onSelectNetwork = async network => {
    await this.getStation(network.id);
    // Center map on city and close select network modal
    this.changeRegion({
      latitude: network.location.latitude,
      longitude: network.location.longitude,
    });
    this.setState({
      modalVisible: false,
      drawerOpen: false,
      selectedStation: null,
      selectedNetwork: network,
    });
    await AsyncStorage.setItem('selectedNetworkId', network.id);
  };

  onPressMenuIcon = () => {
    this.setState({ drawerOpen: true });
  };

  onPressChangeCity = () => {
    this.setState({ modalVisible: true, drawerOpen: false });
  };

  onCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  onCloseDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  onPressMap = () => {
    this.setState({ selectedStation: null });
  };

  onToggleVisibleInfos = () => {
    this.setState(({ modalVisibleInfos }) => ({
      modalVisibleInfos: !modalVisibleInfos,
    }));
  };

  onPressMarker = selectedStation => {
    this.setState({ selectedStation });
  };

  onRegionChange = region => {
    this.setState({ region });
  };

  onChangeMode = async () => {
    this.setState(
      ({ mode }) => {
        let newMode = 'walk';
        if (mode === 'walk') {
          newMode = 'bike';
        }
        return { mode: newMode };
      },
      () => {
        const newStations = this.state.stations.map(station => {
          // eslint-disable-next-line no-param-reassign
          station.image = getMarkerImage(station, this.state.mode);
          return station;
        });
        this.setState({ stations: newStations });
      }
    );
  };

  onRefreshStations = async () => {
    try {
      if (this.state.refreshIcon === 'check') return;
      this.setState({ refreshLoading: true });
      const selectedNetworkId = await AsyncStorage.getItem('selectedNetworkId');
      await this.getStation(selectedNetworkId);
      // TODO refresh selectedStation in state
      this.setState({ refreshLoading: false, refreshIcon: 'check' });
      // Show check icon and put back refresh icon 20 seconds after
      setTimeout(() => this.setState({ refreshIcon: 'refresh' }), 20 * 1000);
    } catch (err) {
      Alert.alert('Error', err.message || err);
      this.setState({ refreshLoading: false });
    }
  };

  async getStation(id) {
    try {
      const network = await getNetworkFromApi(id);
      const stations = formatStations(network.stations, this.state.mode);
      delete network.stations;
      this.setState({ stations, selectedNetwork: network });
      return { network, stations };
    } catch (err) {
      Alert.alert('Error', err.message || err);
    }
    return null;
  }

  changeRegion = newRegion => {
    this.setState(({ region }) => ({
      region: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: newRegion.latitudeDelta || region.latitudeDelta,
        longitudeDelta: newRegion.longitudeDelta || region.longitudeDelta,
      },
    }));
  };

  render() {
    const {
      isReady,
      region,
      stations,
      selectedStation,
      drawerOpen,
      modalVisible,
      modalVisibleInfos,
      mode,
      selectedNetwork,
      refreshIcon,
      refreshLoading,
    } = this.state;

    if (!isReady) {
      return <AppLoading />;
    }

    const drawerStyles = {
      drawer: {
        backgroundColor: '#ffffff',
      },
    };
    return (
      <Drawer
        open={drawerOpen}
        onClose={this.onCloseDrawer}
        type="overlay"
        tapToClose
        openDrawerOffset={0.2}
        styles={drawerStyles}
        tweenHandler={ratio => ({
          mainOverlay: {
            backgroundColor: `rgba(0, 0, 0, ${ratio > 0.6 ? 0.6 : ratio})`,
          },
        })}
        content={
          <View style={styles.drawer}>
            <View style={styles.drawerLogo}>
              <Image
                source={require('./assets/images/logo.png')}
                style={{ height: 40, width: 149 }}
              />
            </View>
            <TouchableOpacity onPress={this.onPressChangeCity}>
              <View style={styles.drawerMenu}>
                <Text style={styles.drawerMenuText}>Change city</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onToggleVisibleInfos}>
              <View style={styles.drawerMenu}>
                <Text style={styles.drawerMenuText}>Infos</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      >
        <View style={styles.container}>
          <Header statusBarPadding>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
              >
                <IconButton name="menu" onPress={this.onPressMenuIcon} />
                <Text style={styles.headerText}>
                  {selectedNetwork && selectedNetwork.location.city}
                </Text>
              </View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                {refreshLoading && (
                  <View style={styles.headerLoading}>
                    <ActivityIndicator animating color="#ffffff" />
                  </View>
                )}
                {!refreshLoading && (
                  <IconButton
                    name={refreshIcon}
                    onPress={this.onRefreshStations}
                  />
                )}
                <IconButton
                  name={`directions-${mode}`}
                  onPress={this.onChangeMode}
                />
              </View>
            </View>
          </Header>
          <StationInfo selectedStation={selectedStation} mode={mode} />
          <Map
            region={region}
            stations={stations}
            onRegionChange={this.onRegionChange}
            onPressMap={this.onPressMap}
            onPressMarker={this.onPressMarker}
          />
          <Modal
            title="Choose your city"
            visible={modalVisible}
            onRequestClose={this.onCloseModal}
          >
            <ListCities
              onSelectNetwork={this.onSelectNetwork}
              onClose={this.onCloseModal}
            />
          </Modal>
          <Modal
            visible={modalVisibleInfos}
            onRequestClose={this.onToggleVisibleInfos}
          >
            <Infos />
          </Modal>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  drawerLogo: {
    padding: 30,
    paddingTop: 30 + Constants.statusBarHeight,
    backgroundColor: colors.primary,
    borderBottomWidth: 8,
    borderBottomColor: colors.secondary,
    alignItems: 'center',
  },
  drawerMenu: {
    paddingTop: 20,
    paddingBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  drawerMenuText: {
    color: colors.secondary,
    fontSize: 18,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
  },
  headerLoading: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
