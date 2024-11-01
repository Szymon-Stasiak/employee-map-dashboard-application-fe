import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Employee, EmployeeForm } from '../models/Employee';

export const useGetEmployees = () => {
  return useQuery<Employee[], []>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
};

export const getEmployees = async () => {
  return await axios.get<Employee[]>(`/api/employees`).then((res) => res.data);
};

export const useGetEmployeeById = (id: string) => {
  return useQuery<Employee, []>({
    queryKey: ['employees', id],
    queryFn: () => getEmployeeById(id),
  });
};

export const getEmployeeById = async (id: string) => {
  return await axios.get<Employee>(`/api/employees/${id}`).then((res) => res.data);
};

export const useAddNewEmployee = () => {
  return useMutation(addNewEmployee);
};

const addNewEmployee = async (employeeData: EmployeeForm) => {
  return await axios.post(`/api/employees`, employeeData);
};

export const useEmployeeLogin = () => {
  return useMutation(loginEmployee);
};
const loginEmployee = async (variables: { email: string; password: string }): Promise<string> => {
  const { email, password } = variables;

  const response = await axios.post(`/api/auth/log-in`, { email, password });
  const { data } = response;

  if (data.token) {
    return data.token;
  } else {
    throw new Error('LACK OF JWT.');
  }
};

export const useDeleteEmployee = () => {
  return useMutation((id: string) => axios.delete(`/api/employees/${id}`));
};
export const useEditEmployee = () => {
  return useMutation(editEmployee);
};

const editEmployee = async (employee: Employee) => {
  const { id, ...data } = employee;
  return await axios.put<EmployeeForm>(`/api/employees/${id}`, data);
};

export const useUploadEmployeeImage = () => {
  return useMutation(uploadEmployeeImage);
};

const uploadEmployeeImage = async (imageData: FormData) => {
  return await axios.post(`/api/image/upload`, imageData);
};

export const useGetEmployeeImage = (employeeEmail: string) => {
  return useQuery<string, Error>({
    queryKey: ['employeeImage', employeeEmail],
    queryFn: () => getEmployeeImage(employeeEmail),
  });
};

export const getEmployeeImage = async (employeeEmail: string) => {
  const response = await axios.get(`/api/image/download?employeeEmail=${employeeEmail}`, {
    responseType: 'arraybuffer',
  });

  const base64String = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const imageDataUrl = `data:image/jpeg;base64,${base64String}`;

  return imageDataUrl;
};
