import { Employee } from '../../../../models/Employee.ts';
import { Cluster, MarkerClusterer } from '@googlemaps/markerclusterer';
import EmployeeMarkerContent from './EmployeeMarkerContent.tsx';
import Marker from './Marker.tsx';
import EmployeeListPopup from './EmployeeListPopup.tsx';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

type Props = {
  map: google.maps.Map;
  employees: Employee[];
};

function EmployeeMarkers({ map, employees }: Props) {
  const cluster = useRef(
    new MarkerClusterer({
      map: map,
      markers: [],
    })
  );
  const markerToEmployeeMap = new Map<google.maps.marker.AdvancedMarkerElement, Employee>();
  const advancedMarkersMap = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(
    new Map<string, google.maps.marker.AdvancedMarkerElement>()
  );
  const onMarkerRemoved = (marker: google.maps.marker.AdvancedMarkerElement) => {
    marker.map = null;
    markerToEmployeeMap.delete(marker);
    if (cluster.current) {
      cluster.current.removeMarker(marker);
    }
  };
  advancedMarkersMap.current.forEach((marker) => {
    onMarkerRemoved(marker);
  });
  advancedMarkersMap.current.clear();

  const lastEmployeeListPopupInfoWindow = useRef<google.maps.InfoWindow>();

  const onClusterClick = (event: google.maps.MapMouseEvent, cluster: Cluster, map: google.maps.Map) => {
    const markers = cluster.markers ?? [];

    const employees: Employee[] = markers
      .map((marker) => markerToEmployeeMap.get(marker as google.maps.marker.AdvancedMarkerElement))
      .filter((employee): employee is Employee => employee !== undefined);

    const container = document.createElement('div');
    createRoot(container).render(EmployeeListPopup(employees));

    const infoWindow = new google.maps.InfoWindow({ content: container });

    infoWindow.setPosition(event.latLng);

    lastEmployeeListPopupInfoWindow.current?.close();

    lastEmployeeListPopupInfoWindow.current = infoWindow;

    infoWindow.open({ map: map });
  };

  cluster.current.onClusterClick = onClusterClick;

  useEffect(() => {
    cluster.current.render();
  }, [employees]);

  useEffect(() => {
    cluster.current.setMap(map);
    advancedMarkersMap.current.forEach((marker) => {
      cluster.current.removeMarker(marker);
      marker.map = map;
      cluster.current.addMarker(marker);
    });
    cluster.current.render();
  }, [map]);

  return (
    <>
      {employees.map((employee) => (
        <Marker
          id={employee.id}
          key={employee.id}
          map={map}
          markerTitle={employee.fullName}
          position={{ lat: employee.address.lat, lng: employee.address.lng }}
          onMarkerCreated={(marker) => {
            advancedMarkersMap.current.set(employee.id, marker);
            markerToEmployeeMap.set(marker, employee);
            if (cluster.current) {
              cluster.current.addMarker(marker);
            }
          }}
          onMarkerRemoved={onMarkerRemoved}
        >
          {EmployeeMarkerContent(employee)}
        </Marker>
      ))}
    </>
  );
}

export default EmployeeMarkers;
