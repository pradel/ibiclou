import { Location, Permissions } from 'expo';
import turfDistance from '@turf/distance';

export async function getNetworksFromApi() {
  const data = await fetch('https://api.citybik.es/v2/networks');
  const networks = await data.json();
  return networks.networks;
}

export async function getNetworkFromApi(id) {
  const data = await fetch(`https://api.citybik.es/v2/networks/${id}`);
  const network = await data.json();
  return network.network;
}

const markerImages = {
  green: require('../assets/images/marker-green.png'),
  orange: require('../assets/images/marker-orange.png'),
  red: require('../assets/images/marker-red.png'),
};

export function getMarkerImage(station, mode) {
  let image = markerImages.green;
  if (mode === 'walk') {
    if (station.free_bikes <= 5) {
      image = markerImages.orange;
    }
    if (station.free_bikes <= 1) {
      image = markerImages.red;
    }
  } else {
    if (station.empty_slots <= 5) {
      image = markerImages.orange;
    }
    if (station.empty_slots <= 1) {
      image = markerImages.red;
    }
  }
  return image;
}

export function formatStations(stations, mode) {
  return stations.map(station => {
    const stationToReturn = {
      id: station.id,
      name: station.name,
      address: station.extra.address,
      empty_slots: station.empty_slots,
      free_bikes: station.free_bikes,
      latlng: {
        latitude: station.latitude,
        longitude: station.longitude,
      },
    };
    stationToReturn.image = getMarkerImage(stationToReturn, mode);
    return stationToReturn;
  });
}

export async function getUserLocation() {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    const userLocation = await Location.getCurrentPositionAsync({});
    return {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    };
  }
  return null;
}

export function distance(from, to) {
  return turfDistance(
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [from.longitude, from.latitude],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [to.longitude, to.latitude],
      },
    }
  );
}
