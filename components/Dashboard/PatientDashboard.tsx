import React, { useState, useEffect } from 'react';
import { User, Calendar, Pill, FileText, Download, Eye, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getPatients, 
  getAppointments, 
  getPrescriptions,
  getMedicalReports,
  getUsers
} from '../../utils/storage';
import { Patient, Appointment, Prescription, MedicalReport, User as UserType } from '../../types';
interface PatientDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ activeTab = 'profile', onTabChange }) => {
  const { auth } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const setActiveTab = (tab: string) => {
    setCurrentTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [doctors, setDoctors] = useState<UserType[]>([]);

  useEffect(() => {
    loadData();
  }, [auth.user?.id]);

  const loadData = () => {
    // Find patient data for the logged-in user
    const patients = getPatients();
    const userPatient = patients.find(p => p.email === auth.user?.email);
    setPatient(userPatient || null);

    if (userPatient) {
      const allAppointments = getAppointments();
      const patientAppointments = allAppointments.filter(apt => apt.patientId === userPatient.id);
      setAppointments(patientAppointments);

      const allPrescriptions = getPrescriptions();
      const patientPrescriptions = allPrescriptions.filter(pres => pres.patientId === userPatient.id);
      setPrescriptions(patientPrescriptions);

      const allReports = getMedicalReports();
      const patientReports = allReports.filter(report => report.patientId === userPatient.id);
      setReports(patientReports);
    }

    const users = getUsers();
    setDoctors(users.filter(user => user.role === 'doctor'));
  };

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date + ' ' + apt.time) > new Date() && apt.status === 'scheduled'
  );

  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  const stats = {
    upcomingAppointments: upcomingAppointments.length,
    completedAppointments: completedAppointments.length,
    totalPrescriptions: prescriptions.length,
    totalReports: reports.length,
  };

  const downloadPrescription = (prescription: Prescription) => {
    const content = generatePrescriptionContent(prescription);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription_${prescription.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generatePrescriptionContent = (prescription: Prescription) => {
    const doctor = doctors.find(d => d.id === prescription.doctorId);
    return `
PRESCRIPTION

Patient: ${patient?.name}
Doctor: Dr. ${doctor?.name}
Date: ${new Date(prescription.createdAt).toLocaleDateString()}

MEDICATIONS:
${prescription.medications.map(med => 
  `- ${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}`
).join('\n')}

INSTRUCTIONS:
${prescription.instructions}

--
This is a digital prescription from MediCare Hospital
    `;
  };

  if (activeTab === 'appointments') {
    return (
      <AppointmentsView 
        appointments={appointments}
        doctors={doctors}
        stats={stats}
      />
    );
  }

  if (activeTab === 'prescriptions') {
    return (
      <PrescriptionsView
        prescriptions={prescriptions}
        doctors={doctors}
        onDownload={downloadPrescription}
      />
    );
  }

  if (activeTab === 'reports') {
    return (
      <ReportsView
        reports={reports}
        doctors={doctors}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600">Welcome back, {auth.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Completed Visits"
          value={stats.completedAppointments}
          icon={<Calendar className="h-8 w-8 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Prescriptions"
          value={stats.totalPrescriptions}
          icon={<Pill className="h-8 w-8 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Medical Reports"
          value={stats.totalReports}
          icon={<FileText className="h-8 w-8 text-orange-600" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="p-6">
            {patient ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{patient.gender}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="text-gray-900">{patient.email}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="text-gray-900">{patient.phone}</div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="text-gray-900">{patient.address}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Date of Birth</div>
                    <div className="text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Age</div>
                    <div className="text-gray-900">{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</div>
                  <div className="text-gray-900">{patient.emergencyContact}</div>
                </div>
                {patient.medicalHistory && (
                  <div className="pt-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">Medical History</div>
                    <div className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{patient.medicalHistory}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Patient profile not found. Please contact the receptionist to create your profile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => {
                  const doctor = doctors.find(d => d.id === appointment.doctorId);
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">Dr. {doctor?.name}</div>
                          <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                          <div className="text-sm text-gray-600 mt-1">{appointment.reason}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {upcomingAppointments.length > 3 && (
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
                  >
                    View all appointments →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('appointments')}
              className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span>View Appointments</span>
              <Calendar className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className="flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span>View Prescriptions</span>
              <Pill className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="flex items-center justify-between p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span>Medical Reports</span>
              <FileText className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="shrink-0">{icon}</div>
      </div>
    </div>
  );
};

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: UserType[];
  stats: any;
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ appointments, doctors, stats }) => {
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date + ' ' + apt.time) > new Date() && apt.status === 'scheduled'
  );

  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date + ' ' + apt.time) <= new Date() || apt.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <p className="text-gray-600">View your upcoming and past appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming"
          value={stats.upcomingAppointments}
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={<Calendar className="h-8 w-8 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Total"
          value={appointments.length}
          icon={<Calendar className="h-8 w-8 text-purple-600" />}
          color="purple"
        />
      </div>

      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => {
                  const doctor = doctors.find(d => d.id === appointment.doctorId);
                  return (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Dr. {doctor?.name}</div>
                        <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{appointment.reason}</div>
                        {appointment.notes && (
                          <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pastAppointments.map((appointment) => {
                const doctor = doctors.find(d => d.id === appointment.doctorId);
                return (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Dr. {doctor?.name}</div>
                      <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{appointment.reason}</div>
                      {appointment.notes && (
                        <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface PrescriptionsViewProps {
  prescriptions: Prescription[];
  doctors: UserType[];
  onDownload: (prescription: Prescription) => void;
}

const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({ prescriptions, doctors, onDownload }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Prescriptions</h2>
        <p className="text-gray-600">View and download your prescriptions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((prescription) => {
                const doctor = doctors.find(d => d.id === prescription.doctorId);
                return (
                  <tr key={prescription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Dr. {doctor?.name}</div>
                      <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {prescription.medications.slice(0, 2).map((med, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-gray-900">{med.name}</span>
                            <span className="text-gray-500 ml-2">{med.dosage}</span>
                          </div>
                        ))}
                        {prescription.medications.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{prescription.medications.length - 2} more medications
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onDownload(prescription)}
                          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {prescriptions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Prescription Information</h4>
              <p className="text-sm text-blue-700 mt-1">
                You can download your prescriptions for your records. Always follow the instructions 
                provided by your doctor and take medications as prescribed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ReportsViewProps {
  reports: MedicalReport[];
  doctors: UserType[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ reports, doctors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Medical Reports</h2>
        <p className="text-gray-600">View your medical reports and test results</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => {
                const doctor = doctors.find(d => d.id === report.doctorId);
                return (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{report.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.reportType === 'lab' ? 'bg-blue-100 text-blue-800' :
                        report.reportType === 'imaging' ? 'bg-green-100 text-green-800' :
                        report.reportType === 'consultation' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{doctor ? `Dr. ${doctor.name}` : 'Hospital Staff'}</div>
                      {doctor && (
                        <div className="text-sm text-gray-500">{doctor.specialization}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reports.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Reports</h3>
            <p className="text-gray-500">
              You don't have any medical reports yet. Reports will appear here when they are uploaded by your doctors or hospital staff.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;