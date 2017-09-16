import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getNetworksFromApi } from './utils';
import ListHeaderSearch from './list-header-search';
import colors from './colors';

class ListCities extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      loading: true,
      networks: null,
      dataSource: ds.cloneWithRows([]),
    };
  }

  async componentDidMount() {
    try {
      const networks = await getNetworksFromApi();
      this.setState({
        networks,
        dataSource: this.state.dataSource.cloneWithRows(networks),
        loading: false,
      });
    } catch (err) {
      Alert.alert('Error', err.message || err);
    }
  }

  onChangeSearch = text => {
    const { networks } = this.state;
    const matchs = networks.filter(network =>
      network.location.city.match(new RegExp(text, 'i'))
    );
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(matchs),
    });
  };

  onSelectNetwork = network => {
    this.setState({ loading: true });
    this.props.onSelectNetwork(network);
  };

  render() {
    const { loading, dataSource } = this.state;
    return (
      <View>
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" animating />
          </View>
        )}
        {!loading && (
          <ListView
            dataSource={dataSource}
            renderHeader={() => (
              <ListHeaderSearch onChange={this.onChangeSearch} />
            )}
            renderRow={network => (
              <TouchableOpacity
                underlayColor="#CFD0D1"
                onPress={() => this.onSelectNetwork(network)}
              >
                <View style={styles.listItem}>
                  <Text style={styles.listItemTextFirst}>
                    {network.location.city}, {network.location.country}
                  </Text>
                  <Text style={styles.listItemTextSecond}>{network.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'center',
  },
  listItem: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CFD0D1',
  },
  listItemTextFirst: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  listItemTextSecond: {
    color: colors.secondary,
    fontStyle: 'italic',
  },
});

ListCities.propTypes = {
  onSelectNetwork: PropTypes.func.isRequired,
};

export default ListCities;
