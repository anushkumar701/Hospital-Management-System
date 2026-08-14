export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'patient';
  name: string;
  phone: string;
  specialization?: string; // for doctors
  address?: string; // for patients
  dateOfBirth?: string; // for patients
  gender?: 'male' | 'female' | 'other'; // for patients
  emergencyContact?: string; // for patients
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  emergencyContact: string;
  medicalHistory: string;
  createdAt: string;
  userId?: string; // if patient has login access
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  createdAt: string;
  createdBy: string; // user id who created the appointment
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  medications: Medication[];
  instructions: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  description?: string;
  notes?: string;
  reportType?: 'lab' | 'imaging' | 'consultation' | 'other' | string;
  type?: string;
  fileUrl?: string;
  createdAt: string;
  uploadedBy: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}