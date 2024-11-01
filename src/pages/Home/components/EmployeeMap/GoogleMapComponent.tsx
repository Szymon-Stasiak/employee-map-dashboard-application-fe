import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Employee } from '../../../../models/Employee.ts';
import EmployeeMarkers from './EmployeeMarkers.tsx';
import MapOptions = google.maps.MapOptions;
import { useColorMode } from '../../../../components/ColorModeContex/ColorModeContex.tsx';
import { lightThemeModeMap, darkThemeModeMap } from './ThemeMapColor.ts';
import LatLngLiteral = google.maps.LatLngLiteral;

const PolandLocation = {
  lat: 51.9194,
  lng: 19.1451,
};

type Props = {
  mapOptions: MapOptions;
  employees: Employee[];
};

function GoogleMapComponent({ mapOptions, employees }: Props) {
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLElement>();
  const [center, setCenter] = useState<LatLngLiteral>(PolandLocation);
  const [zoom, setZoom] = useState<number>(6);

  const { mode } = useColorMode();

  useEffect(() => {
    if (ref.current) {
      const updatedMapOptions: MapOptions = {
        ...mapOptions,
        mapTypeControl: false,
        center: center,
        zoom: zoom,
      };

      const mapInstance = new google.maps.Map(ref.current, updatedMapOptions);
      const styledMapType = new google.maps.StyledMapType(mode === 'light' ? lightThemeModeMap : darkThemeModeMap, {
        name: 'Styled Map',
      });

      mapInstance.mapTypes.set('styled_map', styledMapType);
      mapInstance.setMapTypeId('styled_map');

      mapInstance.addListener('center_changed', () => {
        const newCenter = mapInstance.getCenter() || PolandLocation;
        // @ts-ignore
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      });

      mapInstance.addListener('zoom_changed', () => {
        setZoom(mapInstance.getZoom() ?? 6);
      });

      setMap(mapInstance);
    }
  }, [mode]);

  return (
    <Box style={{ width: '100%', height: '500px' }} ref={ref} id="map">
      {map && <EmployeeMarkers map={map} employees={employees} />}
    </Box>
  );
}

export default GoogleMapComponent;
