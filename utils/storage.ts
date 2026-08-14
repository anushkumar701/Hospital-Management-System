import { Patient, Appointment, Prescription, MedicalReport, User, Invoice } from '../types';

// Users
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Patients
export const getPatients = (): Patient[] => {
  return JSON.parse(localStorage.getItem('patients') || '[]');
};

export const savePatients = (patients: Patient[]): void => {
  localStorage.setItem('patients', JSON.stringify(patients));
};

export const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>): Patient => {
  const patients = getPatients();
  const newPatient: Patient = {
    ...patient,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
};

// Appointments
export const getAppointments = (): Appointment[] => {
  return JSON.parse(localStorage.getItem('appointments') || '[]');
};

export const saveAppointments = (appointments: Appointment[]): void => {
  localStorage.setItem('appointments', JSON.stringify(appointments));
};

export const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  saveAppointments(appointments);
  return newAppointment;
};

export const checkAppointmentConflict = (doctorId: string, date: string, time: string, excludeId?: string): boolean => {
  const appointments = getAppointments();
  return appointments.some(
    apt => apt.doctorId === doctorId && 
           apt.date === date && 
           apt.time === time && 
           apt.status !== 'cancelled' &&
           apt.id !== excludeId
  );
};

// Prescriptions
export const getPrescriptions = (): Prescription[] => {
  return JSON.parse(localStorage.getItem('prescriptions') || '[]');
};

export const savePrescriptions = (prescriptions: Prescription[]): void => {
  localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
};

export const addPrescription = (prescription: Omit<Prescription, 'id' | 'createdAt'>): Prescription => {
  const prescriptions = getPrescriptions();
  const newPrescription: Prescription = {
    ...prescription,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  prescriptions.push(newPrescription);
  savePrescriptions(prescriptions);
  return newPrescription;
};

// Medical Reports
export const getMedicalReports = (): MedicalReport[] => {
  return JSON.parse(localStorage.getItem('medicalReports') || '[]');
};

export const saveMedicalReports = (reports: MedicalReport[]): void => {
  localStorage.setItem('medicalReports', JSON.stringify(reports));
};

export const addMedicalReport = (report: Omit<MedicalReport, 'id' | 'createdAt'>): MedicalReport => {
  const reports = getMedicalReports();
  const newReport: MedicalReport = {
    ...report,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  reports.push(newReport);
  saveMedicalReports(reports);
  return newReport;
};

// Invoices & Billing
export const getInvoices = (): Invoice[] => {
  return JSON.parse(localStorage.getItem('invoices') || '[]');
};

export const saveInvoices = (invoices: Invoice[]): void => {
  localStorage.setItem('invoices', JSON.stringify(invoices));
};

export const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice => {
  const invoices = getInvoices();
  const newInvoice: Invoice = {
    ...invoice,
    id: 'inv-' + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  saveInvoices(invoices);
  return newInvoice;
};

export const payInvoice = (invoiceId: string): void => {
  const invoices = getInvoices();
  const updated = invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'paid' as const, paidAt: new Date().toISOString() } : inv);
  saveInvoices(updated);
};

// CSV Export utilities
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};