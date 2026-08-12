import React, { useState, useEffect } from 'react';
import { Calendar, Users, Pill, FileText, Download, Plus, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAppointments, 
  getPatients, 
  getPrescriptions, 
  getMedicalReports,
  addPrescription,
  addMedicalReport,
  exportToCSV,
  saveAppointments
} from '../../utils/storage';
import { Appointment, Patient, Prescription, MedicalReport } from '../../types';

const DoctorDashboard: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [auth.user?.id]);

  const loadData = () => {
    const allAppointments = getAppointments();
    const doctorAppointments = allAppointments.filter(apt => apt.doctorId === auth.user?.id);
    setAppointments(doctorAppointments);

    const allPatients = getPatients();
    const doctorPatients = allPatients.filter(patient => 
      doctorAppointments.some(apt => apt.patientId === patient.id)
    );
    setPatients(doctorPatients);

    const allPrescriptions = getPrescriptions();
    const doctorPrescriptions = allPrescriptions.filter(pres => pres.doctorId === auth.user?.id);
    setPrescriptions(doctorPrescriptions);

    const allReports = getMedicalReports();
    const doctorReports = allReports.filter(report => report.doctorId === auth.user?.id);
    setReports(doctorReports);
  };

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date + ' ' + apt.time) > new Date() && apt.status === 'scheduled'
  );

  const stats = {
    todayAppointments: todayAppointments.length,
    totalPatients: patients.length,
    totalPrescriptions: prescriptions.length,
    completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    const allAppointments = getAppointments();
    const updatedAppointments = allAppointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' as const } : apt
    );
    saveAppointments(updatedAppointments);
    loadData();
  };

  const handleAddPrescription = (prescriptionData: any) => {
    addPrescription({
      ...prescriptionData,
      doctorId: auth.user?.id || '',
    });
    loadData();
    setShowPrescriptionForm(false);
  };

  const handleAddReport = (reportData: any) => {
    addMedicalReport({
      ...reportData,
      doctorId: auth.user?.id || '',
      uploadedBy: auth.user?.id || '',
    });
    loadData();
    setShowReportForm(false);
  };

  const exportPatientData = () => {
    const patientData = patients.map(patient => ({
      ...patient,
      appointmentsCount: appointments.filter(apt => apt.patientId === patient.id).length,
      lastVisit: appointments
        .filter(apt => apt.patientId === patient.id && apt.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || 'Never'
    }));
    exportToCSV(patientData, 'doctor_patients');
  };

  if (activeTab === 'appointments') {
    return (
      <AppointmentsView 
        appointments={appointments}
        patients={patients}
        onCompleteAppointment={handleCompleteAppointment}
      />
    );
  }

  if (activeTab === 'patients') {
    return (
      <PatientsView 
        patients={patients}
        appointments={appointments}
        onExport={exportPatientData}
      />
    );
  }

  if (activeTab === 'prescriptions') {
    return (
      <PrescriptionsView
        prescriptions={prescriptions}
        patients={patients}
        showForm={showPrescriptionForm}
        onShowForm={setShowPrescriptionForm}
        onAddPrescription={handleAddPrescription}
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
      />
    );
  }

  if (activeTab === 'reports') {
    return (
      <ReportsView
        reports={reports}
        patients={patients}
        showForm={showReportForm}
        onShowForm={setShowReportForm}
        onAddReport={handleAddReport}
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h2>
        <p className="text-gray-600">Welcome back, {auth.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="My Patients"
          value={stats.totalPatients}
          icon={<Users className="h-8 w-8 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Prescriptions"
          value={stats.totalPrescriptions}
          icon={<Pill className="h-8 w-8 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={<CheckCircle className="h-8 w-8 text-orange-600" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          </div>
          <div className="p-6">
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No appointments for today</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{patient?.name}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleCompleteAppointment(appointment.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('appointments')}
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span>View All Appointments</span>
                <Calendar className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setShowPrescriptionForm(true);
                  setActiveTab('prescriptions');
                }}
                className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span>Create Prescription</span>
                <Pill className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setShowReportForm(true);
                  setActiveTab('reports');
                }}
                className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span>Upload Report</span>
                <FileText className="h-5 w-5" />
              </button>
            </div>
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
  patients: Patient[];
  onCompleteAppointment: (id: string) => void;
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ 
  appointments, 
  patients, 
  onCompleteAppointment 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <p className="text-gray-600">Manage your scheduled appointments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{patient?.name}</div>
                      <div className="text-sm text-gray-500">{patient?.phone}</div>
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
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => onCompleteAppointment(appointment.id)}
                          className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </button>
                      )}
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

interface PatientsViewProps {
  patients: Patient[];
  appointments: Appointment[];
  onExport: () => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({ patients, appointments, onExport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
          <p className="text-gray-600">Patients under your care</p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Visits
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => {
                const patientAppointments = appointments.filter(apt => apt.patientId === patient.id);
                const lastVisit = patientAppointments
                  .filter(apt => apt.status === 'completed')
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                
                const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
                
                return (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{patient.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {age} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {lastVisit ? new Date(lastVisit.date).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {patientAppointments.filter(apt => apt.status === 'completed').length}
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
  patients: Patient[];
  showForm: boolean;
  onShowForm: (show: boolean) => void;
  onAddPrescription: (data: any) => void;
  selectedPatient: string;
  onSelectPatient: (id: string) => void;
}

const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  prescriptions,
  patients,
  showForm,
  onShowForm,
  onAddPrescription,
  selectedPatient,
  onSelectPatient,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
          <p className="text-gray-600">Manage patient prescriptions</p>
        </div>
        <button
          onClick={() => onShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </button>
      </div>

      {showForm && (
        <PrescriptionForm
          patients={patients}
          onSubmit={onAddPrescription}
          onCancel={() => onShowForm(false)}
          selectedPatient={selectedPatient}
          onSelectPatient={onSelectPatient}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((prescription) => {
                const patient = patients.find(p => p.id === prescription.patientId);
                return (
                  <tr key={prescription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{patient?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {prescription.medications.map((med, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-gray-900">{med.name}</span>
                            <span className="text-gray-500 ml-2">{med.dosage} - {med.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{prescription.instructions}</div>
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

interface ReportsViewProps {
  reports: MedicalReport[];
  patients: Patient[];
  showForm: boolean;
  onShowForm: (show: boolean) => void;
  onAddReport: (data: any) => void;
  selectedPatient: string;
  onSelectPatient: (id: string) => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  patients,
  showForm,
  onShowForm,
  onAddReport,
  selectedPatient,
  onSelectPatient,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Reports</h2>
          <p className="text-gray-600">Upload and manage medical reports</p>
        </div>
        <button
          onClick={() => onShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Report
        </button>
      </div>

      {showForm && (
        <ReportForm
          patients={patients}
          onSubmit={onAddReport}
          onCancel={() => onShowForm(false)}
          selectedPatient={selectedPatient}
          onSelectPatient={onSelectPatient}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => {
                const patient = patients.find(p => p.id === report.patientId);
                return (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{patient?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {report.title}
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{report.description}</div>
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

interface PrescriptionFormProps {
  patients: Patient[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  selectedPatient: string;
  onSelectPatient: (id: string) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  patients,
  onSubmit,
  onCancel,
  selectedPatient,
  onSelectPatient,
}) => {
  const [formData, setFormData] = useState({
    patientId: selectedPatient,
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
  });

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '' }],
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = formData.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setFormData({ ...formData, medications: updatedMedications });
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">New Prescription</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
          <select
            value={formData.patientId}
            onChange={(e) => {
              setFormData({ ...formData, patientId: e.target.value });
              onSelectPatient(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Medications</label>
            <button
              type="button"
              onClick={addMedication}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Medication
            </button>
          </div>
          {formData.medications.map((medication, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={medication.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={medication.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={medication.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2x daily"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Additional instructions for the patient"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Prescription
          </button>
        </div>
      </form>
    </div>
  );
};

interface ReportFormProps {
  patients: Patient[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  selectedPatient: string;
  onSelectPatient: (id: string) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  patients,
  onSubmit,
  onCancel,
  selectedPatient,
  onSelectPatient,
}) => {
  const [formData, setFormData] = useState({
    patientId: selectedPatient,
    title: '',
    description: '',
    reportType: 'consultation' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Medical Report</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
            <select
              value={formData.patientId}
              onChange={(e) => {
                setFormData({ ...formData, patientId: e.target.value });
                onSelectPatient(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="lab">Lab Report</option>
              <option value="imaging">Imaging</option>
              <option value="consultation">Consultation</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Report title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Report description and findings"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorDashboard;