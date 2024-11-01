export interface Address {
  street: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
  lat: number;
  lng: number;
}

export interface EmployeeForm {
  fullName: string;
  position: string;
  squad: string | null;
  department: string;
  address: Address;
  email: string;
}

export interface Employee extends EmployeeForm {
  id: string;
}
