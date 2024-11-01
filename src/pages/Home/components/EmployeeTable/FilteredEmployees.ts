import { Employee } from '../../../../models/Employee.ts';
import FilterEmployeeBy from './FilterEmployeeBy.ts';
import { ALL } from '../../../../components/MultiSelect/MultiSelect.tsx';

const NO_SQUAD = 'No squad';

class FilteredEmployees {
  private readonly appliedFilters: Map<FilterEmployeeBy, string[]>;
  private readonly employees: Employee[];
  private readonly onUpdated: (filteredEmployees: Employee[]) => void;

  constructor(employees: Employee[], onUpdated: (filteredEmployees: Employee[]) => void) {
    this.appliedFilters = new Map<FilterEmployeeBy, string[]>([
      [FilterEmployeeBy.CITY, [ALL]],
      [FilterEmployeeBy.SQUAD, [ALL]],
      [FilterEmployeeBy.DEPARTMENT, [ALL]],
    ]);
    this.employees = employees;
    this.onUpdated = onUpdated;
  }

  applyFilterBy(filterEmployeeBy: FilterEmployeeBy, selectedItems: string[]) {
    this.appliedFilters.set(filterEmployeeBy, selectedItems);
    this.applyFilters();
  }

  private applyFilters() {
    const filteredItems = this.employees
      .filter((employee) => {
        const filter = this.appliedFilters.get(FilterEmployeeBy.CITY)!;

        return filter.includes(ALL) || filter.includes(employee.address.city);
      })
      .filter((employee) => {
        const filter = this.appliedFilters.get(FilterEmployeeBy.DEPARTMENT)!;

        return filter.includes(ALL) || filter.includes(employee.department);
      })
      .filter((employee) => {
        const filter = this.appliedFilters.get(FilterEmployeeBy.SQUAD)!;

        const squad = employee.squad ?? NO_SQUAD;

        return filter.includes(ALL) || filter.includes(squad);
      });

    this.onUpdated(filteredItems);
  }
}

export { NO_SQUAD };
export default FilteredEmployees;
