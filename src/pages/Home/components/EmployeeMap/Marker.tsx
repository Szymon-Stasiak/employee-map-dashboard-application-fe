import { ReactNode, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import LatLngLiteral = google.maps.LatLngLiteral;
import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

type MarkerComponentProps = {
  map: google.maps.Map;
  position: LatLngLiteral;
  children: ReactNode;
  markerTitle: string;
  onMarkerCreated: (marker: AdvancedMarkerElement) => void;
  onMarkerRemoved: (marker: AdvancedMarkerElement) => void;
  id: string;
};

function Marker(props: MarkerComponentProps) {
  const rootRef = useRef<Root | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement('div');

      rootRef.current = createRoot(container);

      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: props.map,
        position: props.position,
        content: container,
        title: props.markerTitle,
      });

      props.onMarkerCreated(markerRef.current);

      return () => {
        if (markerRef.current) {
          markerRef.current.map = null;
          props.onMarkerRemoved(markerRef.current);
        }
      };
    }
  }, [props]);

  useEffect(() => {
    rootRef.current?.render(props.children);
    if (markerRef.current) {
      markerRef.current.position = props.position;
      markerRef.current.map = props.map;

      props.onMarkerCreated(markerRef.current);
    }
  }, [props]);

  return <></>;
}

export default Marker;
