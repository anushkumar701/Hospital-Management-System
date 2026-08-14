import { User, Patient, Appointment, Prescription, MedicalReport, Invoice } from '../types';

export const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    name: 'MediCare Hospital Administrator',
    phone: '+91-94440-12345',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. K. Arumugam',
    phone: '+91-98401-55501',
    specialization: 'Cardiology (Chennai)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2b',
    email: 'doctor2@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. S. Meenakshi',
    phone: '+91-98402-55502',
    specialization: 'Neurology (Madurai)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2c',
    email: 'doctor3@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. R. Karthikeyan',
    phone: '+91-98403-55503',
    specialization: 'Pediatrics (Coimbatore)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2d',
    email: 'doctor4@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. V. Sundaram',
    phone: '+91-98404-55504',
    specialization: 'Orthopedics (Trichy)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'receptionist@hospital.com',
    password: 'receptionist123',
    role: 'receptionist',
    name: 'Deepa Anbarasan',
    phone: '+91-94431-00003',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'patient@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'M. Anandkumar',
    phone: '+91-98401-23456',
    address: 'Plot 42, 2nd Main Road, Anna Nagar West, Chennai, Tamil Nadu 600040',
    dateOfBirth: '1986-05-14',
    gender: 'male',
    emergencyContact: '+91-98401-99999',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'patient2@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'Priya Ramanathan',
    phone: '+91-94432-67890',
    address: '15 Crosscut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    dateOfBirth: '1993-02-28',
    gender: 'female',
    emergencyContact: '+91-94432-88888',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    email: 'patient3@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'K. Murugan',
    phone: '+91-98421-11223',
    address: '78 West Masi Street, KK Nagar, Madurai, Tamil Nadu 625020',
    dateOfBirth: '1979-11-12',
    gender: 'male',
    emergencyContact: '+91-98421-77777',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    email: 'patient4@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'Lakshmi Narayanan',
    phone: '+91-97890-44556',
    address: '24 Thillai Nagar 11th Cross, Tiruchirappalli, Tamil Nadu 620018',
    dateOfBirth: '1998-09-05',
    gender: 'female',
    emergencyContact: '+91-97890-66666',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    email: 'patient5@hospital.com',
    password: 'patient123',
    role: 'patient',
    name: 'Kavitha Ramesh',
    phone: '+91-94422-99887',
    address: '89 Junction Main Road, Fairlands, Salem, Tamil Nadu 636016',
    dateOfBirth: '1968-07-21',
    gender: 'female',
    emergencyContact: '+91-94422-55555',
    createdAt: new Date().toISOString(),
  }
];

export const defaultPatients: Patient[] = [
  {
    id: 'p1',
    name: 'M. Anandkumar',
    email: 'patient@hospital.com',
    phone: '+91-98401-23456',
    dateOfBirth: '1986-05-14',
    gender: 'male',
    address: 'Plot 42, 2nd Main Road, Anna Nagar West, Chennai, Tamil Nadu 600040',
    emergencyContact: '+91-98401-99999',
    medicalHistory: 'Mild Hypertension diagnosed in 2021, Dust Allergy',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p2',
    name: 'Priya Ramanathan',
    email: 'patient2@hospital.com',
    phone: '+91-94432-67890',
    dateOfBirth: '1993-02-28',
    gender: 'female',
    address: '15 Crosscut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    emergencyContact: '+91-94432-88888',
    medicalHistory: 'Childhood Asthma, Sulfa Allergy',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p3',
    name: 'K. Murugan',
    email: 'patient3@hospital.com',
    phone: '+91-98421-11223',
    dateOfBirth: '1979-11-12',
    gender: 'male',
    address: '78 West Masi Street, KK Nagar, Madurai, Tamil Nadu 625020',
    emergencyContact: '+91-98421-77777',
    medicalHistory: 'Type 2 Diabetes, High Cholesterol',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p4',
    name: 'Lakshmi Narayanan',
    email: 'patient4@hospital.com',
    phone: '+91-97890-44556',
    dateOfBirth: '1998-09-05',
    gender: 'female',
    address: '24 Thillai Nagar 11th Cross, Tiruchirappalli, Tamil Nadu 620018',
    emergencyContact: '+91-97890-66666',
    medicalHistory: 'Migraine, Vitamin D Deficiency',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p5',
    name: 'Kavitha Ramesh',
    email: 'patient5@hospital.com',
    phone: '+91-94422-99887',
    dateOfBirth: '1968-07-21',
    gender: 'female',
    address: '89 Junction Main Road, Fairlands, Salem, Tamil Nadu 636016',
    emergencyContact: '+91-94422-55555',
    medicalHistory: 'Osteoarthritis Right Knee Joint, Thyroid Hyperplasia',
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
    doctorId: '2', // Dr. K. Arumugam
    date: todayStr,
    time: '09:30 AM',
    reason: 'Routine Cardiac Follow-up & BP Check (Chennai Wing)',
    status: 'scheduled',
    meetUrl: 'https://meet.jit.si/tn-medicare-cardio-room-1',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-2',
    patientId: 'p2',
    doctorId: '2b', // Dr. S. Meenakshi
    date: todayStr,
    time: '11:00 AM',
    reason: 'Neurological Consultation for Chronic Headache (Madurai Wing)',
    status: 'scheduled',
    meetUrl: 'https://meet.jit.si/tn-medicare-neuro-room-2',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-3',
    patientId: 'p3',
    doctorId: '2d', // Dr. V. Sundaram
    date: todayStr,
    time: '02:15 PM',
    reason: 'Knee Pain Evaluation & Joint Mobility Check (Trichy Wing)',
    status: 'scheduled',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-4',
    patientId: 'p4',
    doctorId: '2c', // Dr. R. Karthikeyan
    date: tomorrowStr,
    time: '10:00 AM',
    reason: 'General Pediatric Checkup & Typhoid Vaccine (Coimbatore Wing)',
    status: 'scheduled',
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-5',
    patientId: 'p1',
    doctorId: '2', // Dr. K. Arumugam
    date: pastStr,
    time: '10:00 AM',
    reason: 'Initial Blood Pressure Consultation (Chennai)',
    status: 'completed',
    createdBy: '3',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'apt-6',
    patientId: 'p5',
    doctorId: '2d', // Dr. V. Sundaram
    date: pastStr,
    time: '03:00 PM',
    reason: 'Knee Osteoarthritis Physio Review (Salem Patient)',
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
      { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily (Morning after food)', duration: '30 days' },
      { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily (Before breakfast)', duration: '15 days' }
    ],
    instructions: 'Maintain low salt diet. Avoid oily foods and track blood pressure weekly at nearest MediCare clinic.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pres-2',
    patientId: 'p2',
    doctorId: '2b',
    medications: [
      { name: 'Deriphyllin', dosage: '150mg', frequency: 'Twice daily after food', duration: '15 days' },
      { name: 'Montelukast Sodium', dosage: '10mg', frequency: 'Once daily (Bedtime)', duration: '30 days' }
    ],
    instructions: 'Inhale steam twice daily. Avoid cold beverages and air-conditioned environments.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pres-3',
    patientId: 'p3',
    doctorId: '2',
    medications: [
      { name: 'Metformin SR', dosage: '500mg', frequency: 'Twice daily with meals', duration: '90 days' },
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily (Night)', duration: '90 days' }
    ],
    instructions: 'Walk 30 minutes every morning. Check fasting blood sugar levels every fortnight.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const defaultReports: MedicalReport[] = [
  {
    id: 'rep-1',
    patientId: 'p1',
    doctorId: '2',
    type: 'Lab Test',
    title: 'Echo Cardiogram & Cardiac Doppler (Chennai)',
    fileUrl: 'https://example.com/reports/echo_p1.pdf',
    notes: 'Normal sinus rhythm. Ejection fraction 62%. Continue current medication regimen.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '2'
  },
  {
    id: 'rep-2',
    patientId: 'p1',
    doctorId: '2',
    type: 'Lab Test',
    title: 'Fasting Lipid Panel & Blood Sugar Report',
    fileUrl: 'https://example.com/reports/lipid_p1.pdf',
    notes: 'FBS: 98 mg/dL, Total Cholesterol: 175 mg/dL. Within target range.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '3'
  },
  {
    id: 'rep-3',
    patientId: 'p2',
    doctorId: '2b',
    type: 'X-Ray',
    title: 'Chest Radiograph PA View (Coimbatore Clinic)',
    fileUrl: 'https://example.com/reports/xray_p2.pdf',
    notes: 'Clear bronchovascular markings. Both costophrenic angles are sharp.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '2b'
  },
  {
    id: 'rep-4',
    patientId: 'p3',
    doctorId: '2d',
    type: 'MRI',
    title: 'Right Knee Joint MRI Scan (Trichy Radiology)',
    fileUrl: 'https://example.com/reports/mri_p3.pdf',
    notes: 'Grade 1 medial articular cartilage wear. No ligament tear. Quadriceps strengthening recommended.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: '3'
  }
];

export const defaultInvoices: Invoice[] = [
  {
    id: 'inv-1001',
    patientId: 'p1',
    appointmentId: 'apt-1',
    items: [
      { description: 'Cardiology Specialist Consultation (Chennai)', amount: 500 },
      { description: 'Echocardiogram & Cardiac ECG', amount: 1200 }
    ],
    totalAmount: 1700,
    status: 'paid',
    dueDate: '2026-08-20',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-1002',
    patientId: 'p2',
    appointmentId: 'apt-2',
    items: [
      { description: 'Neurology Consultation (Madurai)', amount: 600 },
      { description: 'Chest Digital Radiograph (X-Ray)', amount: 450 }
    ],
    totalAmount: 1050,
    status: 'unpaid',
    dueDate: '2026-08-25',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-1003',
    patientId: 'p3',
    appointmentId: 'apt-3',
    items: [
      { description: 'Orthopedic Consultation (Trichy)', amount: 500 },
      { description: 'High-Resolution Knee MRI Scan', amount: 3500 }
    ],
    totalAmount: 4000,
    status: 'unpaid',
    dueDate: '2026-08-28',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const initializeSeedData = (): void => {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  localStorage.setItem('patients', JSON.stringify(defaultPatients));
  localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
  localStorage.setItem('prescriptions', JSON.stringify(defaultPrescriptions));
  localStorage.setItem('medicalReports', JSON.stringify(defaultReports));
  localStorage.setItem('invoices', JSON.stringify(defaultInvoices));
};

export const resetAllData = (): void => {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  localStorage.setItem('patients', JSON.stringify(defaultPatients));
  localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
  localStorage.setItem('prescriptions', JSON.stringify(defaultPrescriptions));
  localStorage.setItem('medicalReports', JSON.stringify(defaultReports));
  localStorage.setItem('invoices', JSON.stringify(defaultInvoices));
  window.location.reload();
};
