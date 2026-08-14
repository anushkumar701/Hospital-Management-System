import { User, Patient, Appointment, Prescription, MedicalReport } from '../types';

export const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    name: 'Hospital Admin',
    phone: '+1-555-0001',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Sarah Johnson',
    phone: '+1-555-0002',
    specialization: 'Cardiology',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2b',
    email: 'doctor2@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Robert Chen',
    phone: '+1-555-0012',
    specialization: 'Neurology',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2c',
    email: 'doctor3@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Emily Williams',
    phone: '+1-555-0013',
    specialization: 'Pediatrics',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2d',
    email: 'doctor4@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Michael Brown',
    phone: '+1-555-0014',
    specialization: 'Orthopedics',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'receptionist@hospital.com',
    password: 'receptionist123',
    role: 'receptionist',
    name: 'Emma Davis',
    phone: '+1-555-0003',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'patient@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'John Smith',
    phone: '+1-555-0004',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    emergencyContact: '+1-555-9999',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'patient2@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'Alice Walker',
    phone: '+1-555-0005',
    address: '456 Oak Avenue, Metro City, NY 10001',
    dateOfBirth: '1992-03-22',
    gender: 'female',
    emergencyContact: '+1-555-8888',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    email: 'patient3@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'David Miller',
    phone: '+1-555-0006',
    address: '789 Pine Road, Springfield, IL 62701',
    dateOfBirth: '1978-11-04',
    gender: 'male',
    emergencyContact: '+1-555-7777',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    email: 'patient4@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'Sophia Garcia',
    phone: '+1-555-0007',
    address: '321 Elm Street, Austin, TX 78701',
    dateOfBirth: '1999-08-19',
    gender: 'female',
    emergencyContact: '+1-555-6666',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    email: 'patient5@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'James Taylor',
    phone: '+1-555-0008',
    address: '654 Maple Blvd, Seattle, WA 98101',
    dateOfBirth: '1965-01-30',
    gender: 'male',
    emergencyContact: '+1-555-5555',
    createdAt: new Date().toISOString(),
  }
];

export const defaultPatients: Patient[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'patient@hospital.com',
    phone: '+1-555-0004',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    address: '123 Main St, City, State 12345',
    emergencyContact: '+1-555-9999',
    medicalHistory: 'Hypertension diagnosed in 2020, Seasonal Pollen Allergies',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p2',
    name: 'Alice Walker',
    email: 'patient2@hospital.com',
    phone: '+1-555-0005',
    dateOfBirth: '1992-03-22',
    gender: 'female',
    address: '456 Oak Avenue, Metro City, NY 10001',
    emergencyContact: '+1-555-8888',
    medicalHistory: 'Mild Childhood Asthma, Penicillin Allergy',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p3',
    name: 'David Miller',
    email: 'patient3@hospital.com',
    phone: '+1-555-0006',
    dateOfBirth: '1978-11-04',
    gender: 'male',
    address: '789 Pine Road, Springfield, IL 62701',
    emergencyContact: '+1-555-7777',
    medicalHistory: 'Type 2 Diabetes Mellitus, Hyperlipidemia',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p4',
    name: 'Sophia Garcia',
    email: 'patient4@hospital.com',
    phone: '+1-555-0007',
    dateOfBirth: '1999-08-19',
    gender: 'female',
    address: '321 Elm Street, Austin, TX 78701',
    emergencyContact: '+1-555-6666',
    medicalHistory: 'Chronic Vascular Migraines',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p5',
    name: 'James Taylor',
    email: 'patient5@hospital.com',
    phone: '+1-555-0008',
    dateOfBirth: '1965-01-30',
    gender: 'male',
    address: '654 Maple Blvd, Seattle, WA 98101',
    emergencyContact: '+1-555-5555',
    medicalHistory: 'Coronary Artery Disease, Stent Placement (2021)',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const pastStr = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const defaultAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'p1',
    doctorId: '2', // Dr. Sarah Johnson
    date: todayStr,
    time: '09:30 AM',
    reason: 'Routine Cardiac Follow-up & BP Check',
    status: 'scheduled',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-2',
    patientId: 'p2',
    doctorId: '2b', // Dr. Robert Chen
    date: todayStr,
    time: '11:00 AM',
    reason: 'Neurological Consultation for Chronic Headache',
    status: 'scheduled',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-3',
    patientId: 'p3',
    doctorId: '2d', // Dr. Michael Brown
    date: todayStr,
    time: '02:15 PM',
    reason: 'Knee Pain Evaluation & Joint Mobility Check',
    status: 'scheduled',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-4',
    patientId: 'p4',
    doctorId: '2c', // Dr. Emily Williams
    date: tomorrowStr,
    time: '10:00 AM',
    reason: 'General Pediatric Checkup & Vaccination',
    status: 'scheduled',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-5',
    patientId: 'p1',
    doctorId: '2', // Dr. Sarah Johnson
    date: pastStr,
    time: '10:00 AM',
    reason: 'Initial Blood Pressure Consultation',
    status: 'completed',
    createdBy: '3',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'apt-6',
    patientId: 'p5',
    doctorId: '2', // Dr. Sarah Johnson
    date: pastStr,
    time: '03:00 PM',
    reason: 'Post-Op Coronary Stent Checkup',
    status: 'completed',
    createdBy: '3',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const defaultPrescriptions: Prescription[] = [
  {
    id: 'pres-1',
    patientId: 'p1',
    doctorId: '2',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily (Morning)', duration: '30 days' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (Evening)', duration: '30 days' }
    ],
    instructions: 'Take medications after food with plenty of water. Keep track of daily morning BP readings.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pres-2',
    patientId: 'p2',
    doctorId: '2b',
    medications: [
      { name: 'Albuterol Inhaler', dosage: '90mcg', frequency: '2 puffs as needed', duration: 'As needed' },
      { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily (Bedtime)', duration: '60 days' }
    ],
    instructions: 'Keep rescue inhaler accessible at all times. Avoid known environmental allergens.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pres-3',
    patientId: 'p3',
    doctorId: '2',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', duration: '90 days' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (Night)', duration: '90 days' }
    ],
    instructions: 'Follow low-glycemic diet. Check fasting blood sugar levels every Monday morning.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const defaultReports: MedicalReport[] = [
  {
    id: 'rep-1',
    patientId: 'p1',
    doctorId: '2',
    type: 'Lab Test',
    title: 'Comprehensive ECG & Cardiac Ultrasound',
    fileUrl: 'https://example.com/reports/ecg_p1.pdf',
    notes: 'Normal sinus rhythm with mild left ventricular hypertrophy. Continue prescribed blood pressure regimen.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '2'
  },
  {
    id: 'rep-2',
    patientId: 'p1',
    doctorId: '2',
    type: 'Lab Test',
    title: 'Serum Lipid Panel & Electrolytes',
    fileUrl: 'https://example.com/reports/lipid_p1.pdf',
    notes: 'Total cholesterol: 185 mg/dL, HDL: 48 mg/dL, Triglycerides: 140 mg/dL. Normal range.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '3'
  },
  {
    id: 'rep-3',
    patientId: 'p2',
    doctorId: '2b',
    type: 'X-Ray',
    title: 'Chest Radiograph & Pulmonary Function Test',
    fileUrl: 'https://example.com/reports/xray_p2.pdf',
    notes: 'Clear lung fields with no consolidation or pleural effusion. FEV1/FVC ratio is within normal limits.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '2b'
  },
  {
    id: 'rep-4',
    patientId: 'p3',
    doctorId: '2d',
    type: 'MRI',
    title: 'Right Knee Joint High-Resolution MRI',
    fileUrl: 'https://example.com/reports/mri_p3.pdf',
    notes: 'Mild patellofemoral cartilage thinning. No meniscus tear identified. Physical therapy recommended.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '3'
  }
];

export const initializeSeedData = (): void => {
  if (!localStorage.getItem('users') || JSON.parse(localStorage.getItem('users') || '[]').length === 0) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('patients') || JSON.parse(localStorage.getItem('patients') || '[]').length === 0) {
    localStorage.setItem('patients', JSON.stringify(defaultPatients));
  }
  if (!localStorage.getItem('appointments') || JSON.parse(localStorage.getItem('appointments') || '[]').length === 0) {
    localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
  }
  if (!localStorage.getItem('prescriptions') || JSON.parse(localStorage.getItem('prescriptions') || '[]').length === 0) {
    localStorage.setItem('prescriptions', JSON.stringify(defaultPrescriptions));
  }
  if (!localStorage.getItem('medicalReports') || JSON.parse(localStorage.getItem('medicalReports') || '[]').length === 0) {
    localStorage.setItem('medicalReports', JSON.stringify(defaultReports));
  }
};

export const resetAllData = (): void => {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  localStorage.setItem('patients', JSON.stringify(defaultPatients));
  localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
  localStorage.setItem('prescriptions', JSON.stringify(defaultPrescriptions));
  localStorage.setItem('medicalReports', JSON.stringify(defaultReports));
  window.location.reload();
};
