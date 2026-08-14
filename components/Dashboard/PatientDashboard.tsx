import React, { useState, useEffect } from 'react';
import { User, Calendar, Pill, FileText, Download, Eye, Clock, MapPin, Phone, Mail, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getPatients, 
  getAppointments, 
  saveAppointments,
  addAppointment,
  checkAppointmentConflict,
  getPrescriptions,
  getMedicalReports,
  getUsers
} from '../../utils/storage';
import { Patient, Appointment, Prescription, MedicalReport, User as UserType } from '../../types';
import InvoicesView from '../Billing/InvoicesView';

interface PatientDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ activeTab = 'profile', onTabChange }) => {
  const { auth } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [doctors, setDoctors] = useState<UserType[]>([]);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const setActiveTab = (tab: string) => {
    setCurrentTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    loadData();
  }, [auth.user?.id]);

  const loadData = () => {
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

  const handleBookAppointment = (aptData: { doctorId: string; date: string; time: string; reason: string }) => {
    if (!patient) return;
    const hasConflict = checkAppointmentConflict(aptData.doctorId, aptData.date, aptData.time);
    if (hasConflict) {
      alert('The selected doctor is unavailable at this date and time. Please select another slot.');
      return;
    }

    addAppointment({
      ...aptData,
      patientId: patient.id,
      status: 'scheduled',
      createdBy: auth.user?.id || patient.id,
    });
    loadData();
    setShowBookModal(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const allAppointments = getAppointments();
      const updated = allAppointments.map(apt => apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt);
      saveAppointments(updated);
      loadData();
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled'
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
MEDICARE HOSPITAL DIGITAL PRESCRIPTION

Patient Name: ${patient?.name || 'N/A'}
Attending Physician: Dr. ${doctor?.name || 'Staff Physician'}
Specialization: ${doctor?.specialization || 'General Practice'}
Prescription Date: ${new Date(prescription.createdAt).toLocaleDateString()}

PRESCRIBED MEDICATIONS:
--------------------------------------------------
${prescription.medications.map(med => 
  `- ${med.name} (${med.dosage}) | Frequency: ${med.frequency} | Duration: ${med.duration}`
).join('\n')}

PHYSICIAN INSTRUCTIONS:
--------------------------------------------------
${prescription.instructions}

--
Generated automatically by MediCare Hospital Management System
    `;
  };

  if (currentTab === 'appointments') {
    return (
      <AppointmentsView 
        appointments={appointments}
        doctors={doctors}
        stats={stats}
        onOpenBookModal={() => setShowBookModal(true)}
        onCancelAppointment={handleCancelAppointment}
        showBookModal={showBookModal}
        onCloseBookModal={() => setShowBookModal(false)}
        onSubmitBook={handleBookAppointment}
      />
    );
  }

  if (currentTab === 'prescriptions') {
    return (
      <PrescriptionsView
        prescriptions={prescriptions}
        doctors={doctors}
        onDownload={downloadPrescription}
      />
    );
  }

  if (currentTab === 'reports') {
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
        <h2 className="text-2xl font-bold text-gray-900">My Patient Profile</h2>
        <p className="text-gray-600">Welcome back, {auth.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Visits"
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
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</div>
                    <div className="text-gray-900 font-medium">{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Emergency Contact</div>
                    <div className="text-gray-900 font-medium">{patient.emergencyContact}</div>
                  </div>
                </div>
                {patient.medicalHistory && (
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Medical History</div>
                    <div className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{patient.medicalHistory}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Patient profile details syncing...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <button
              onClick={() => setShowBookModal(true)}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Book Appointment
            </button>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No upcoming visits scheduled.</p>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="mt-3 text-sm text-blue-600 font-medium hover:underline"
                >
                  + Schedule an Appointment Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => {
                  const doctor = doctors.find(d => d.id === appointment.doctorId);
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900">Dr. {doctor?.name || 'Staff Physician'}</div>
                          <div className="text-xs text-blue-600 font-medium">{doctor?.specialization}</div>
                          <div className="text-sm text-gray-600 mt-1">{appointment.reason}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {appointment.date}
                          </div>
                          <div className="text-xs text-gray-500">{appointment.time}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookModal && (
        <BookModal 
          doctors={doctors} 
          onClose={() => setShowBookModal(false)} 
          onSubmit={handleBookAppointment} 
        />
      )}
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
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 border shadow-xs`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
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
  onOpenBookModal: () => void;
  onCancelAppointment: (id: string) => void;
  showBookModal: boolean;
  onCloseBookModal: () => void;
  onSubmitBook: (data: any) => void;
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ 
  appointments, 
  doctors, 
  stats, 
  onOpenBookModal, 
  onCancelAppointment,
  showBookModal,
  onCloseBookModal,
  onSubmitBook
}) => {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
          <p className="text-gray-600">Schedule, view, and manage your hospital appointments</p>
        </div>
        <button
          onClick={onOpenBookModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-xs"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Visits"
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
          title="Total Records"
          value={appointments.length}
          icon={<Calendar className="h-8 w-8 text-purple-600" />}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No upcoming appointments scheduled.
                  </td>
                </tr>
              ) : (
                upcomingAppointments.map((apt) => {
                  const doctor = doctors.find(d => d.id === apt.doctorId);
                  return (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">Dr. {doctor?.name || 'Staff Doctor'}</div>
                        <div className="text-xs text-blue-600">{doctor?.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>{apt.date}</div>
                        <div className="text-xs text-gray-500">{apt.time}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{apt.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => onCancelAppointment(apt.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Past Appointment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pastAppointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    No past appointment records found.
                  </td>
                </tr>
              ) : (
                pastAppointments.map((apt) => {
                  const doctor = doctors.find(d => d.id === apt.doctorId);
                  return (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Dr. {doctor?.name || 'Staff Doctor'}</div>
                        <div className="text-xs text-gray-500">{doctor?.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>{apt.date}</div>
                        <div className="text-xs text-gray-500">{apt.time}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{apt.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBookModal && (
        <BookModal 
          doctors={doctors} 
          onClose={onCloseBookModal} 
          onSubmit={onSubmitBook} 
        />
      )}
    </div>
  );
};

interface BookModalProps {
  doctors: UserType[];
  onClose: () => void;
  onSubmit: (data: { doctorId: string; date: string; time: string; reason: string }) => void;
}

const BookModal: React.FC<BookModalProps> = ({ doctors, onClose, onSubmit }) => {
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !date || !time || !reason) {
      alert('Please fill out all appointment details');
      return;
    }
    onSubmit({ doctorId, date, time, reason });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Book New Appointment</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.name} ({doc.specialization || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe symptoms or checkup request..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </form>
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
        <p className="text-gray-600">Access and download your digital prescriptions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {prescriptions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No prescriptions found on record.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prescriptions.map((prescription) => {
              const doctor = doctors.find(d => d.id === prescription.doctorId);
              return (
                <div key={prescription.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Dr. {doctor?.name || 'Staff Physician'}</h4>
                      <p className="text-xs text-blue-600 font-medium">{doctor?.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Issued on: {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onDownload(prescription)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors self-start sm:self-auto shadow-xs"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download TXT
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prescribed Medications</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {prescription.medications.map((med, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                          <div className="font-semibold text-gray-900">{med.name} ({med.dosage})</div>
                          <div className="text-xs text-gray-600 mt-1">Frequency: {med.frequency}</div>
                          <div className="text-xs text-gray-500">Duration: {med.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {prescription.instructions && (
                    <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <span className="font-semibold text-blue-900">Instructions: </span>
                      {prescription.instructions}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
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
        <h2 className="text-2xl font-bold text-gray-900">My Medical Reports</h2>
        <p className="text-gray-600">Review lab results, diagnostic scans, and clinical notes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No medical reports uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => {
              const doctor = doctors.find(d => d.id === report.doctorId);
              return (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-blue-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900">{report.title}</h4>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(report.createdAt).toLocaleDateString()} {doctor ? `by Dr. ${doctor.name}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full self-start sm:self-auto">
                      {report.type || 'Clinical Document'}
                    </span>
                  </div>

                  {report.notes && (
                    <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-900">Doctor Findings & Notes: </span>
                      {report.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;