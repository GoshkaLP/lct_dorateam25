import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MarkerClusterGroup = createPathComponent(
  ({ children: _c, ...options }, ctx) => {
    const clusterGroup = new L.MarkerClusterGroup(options);
    return {
      instance: clusterGroup,
      context: { ...ctx, layerContainer: clusterGroup },
    };
  }
);

export default MarkerClusterGroup;
