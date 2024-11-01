import { Employee } from '../../../../models/Employee.ts';
import { Box, Typography } from '@mui/material';
import MultiSelect from '../../../../components/MultiSelect/MultiSelect.tsx';
import { useMemo } from 'react';
import FilteredEmployees, { NO_SQUAD } from './FilteredEmployees.ts';
import FilterEmployeeBy from './FilterEmployeeBy.ts';

type Props = {
  employees: Employee[];
  onFiltered: (filteredEmployees: Employee[]) => void;
};

function FilterEmployeeComponents({ employees, onFiltered }: Props) {
  const filteredEmployees = useMemo(() => {
    return new FilteredEmployees(employees, onFiltered);
  }, [employees]);

  const allCities = useMemo(() => {
    const cities = employees.map((employee) => employee.address.city);
    return Array.of(...new Set(cities)).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [employees]);

  const allDepartments = useMemo(() => {
    const departments = employees.map((employee) => employee.department);
    return Array.of(...new Set(departments)).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [employees]);

  const allSquads = useMemo(() => {
    const squads = employees.map((employee) => employee.squad ?? NO_SQUAD);
    const uniqueSquads = Array.of(...new Set(squads)).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );

    if (uniqueSquads.includes(NO_SQUAD)) {
      const noSquadIndex = uniqueSquads.indexOf(NO_SQUAD);
      uniqueSquads.splice(noSquadIndex, 1);
      uniqueSquads.unshift(NO_SQUAD);
    }

    return uniqueSquads;
  }, [employees]);

  return (
    <Box>
      <Typography color="text.primary">Filter by:</Typography>
      <MultiSelect
        label={'Cities'}
        items={allCities}
        onFilterChanged={(selectedCities) => {
          filteredEmployees.applyFilterBy(FilterEmployeeBy.CITY, selectedCities);
        }}
      />
      <MultiSelect
        label={'Departments'}
        items={allDepartments}
        onFilterChanged={(selectedDepartments) => {
          filteredEmployees.applyFilterBy(FilterEmployeeBy.DEPARTMENT, selectedDepartments);
        }}
      />
      <MultiSelect
        label={'Squads'}
        items={allSquads}
        onFilterChanged={(selectedSquads) => {
          filteredEmployees.applyFilterBy(FilterEmployeeBy.SQUAD, selectedSquads);
        }}
      />
    </Box>
  );
}

export default FilterEmployeeComponents;
