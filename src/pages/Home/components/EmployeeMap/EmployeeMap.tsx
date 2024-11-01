import { Employee } from '../../../../models/Employee.ts';
import GoogleMapComponent from './GoogleMapComponent.tsx';

type MapOptions = {
  mapId: string;
};

function EmployeeMap(employees: Employee[]) {
  const mapId = import.meta.env.VITE_MAP_ID;

  const mapOptions: MapOptions = {
    mapId: mapId,
  };

  return <GoogleMapComponent mapOptions={mapOptions} employees={employees} />;
}

export default EmployeeMap;
