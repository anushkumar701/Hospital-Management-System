import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, CheckCircle, Clock, Download, Search, IndianRupee, X } from 'lucide-react';
import { Invoice, Patient, User } from '../../types';
import { getInvoices, getPatients, getUsers, addInvoice, payInvoice, exportToCSV } from '../../utils/storage';
import { useToast } from '../../contexts/ToastContext';

interface InvoicesViewProps {
  userRole: string;
  patientEmail?: string;
}

const InvoicesView: React.FC<InvoicesViewProps> = ({ userRole, patientEmail }) => {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allInvoices = getInvoices();
    const allPatients = getPatients();
    const allUsers = getUsers();

    setPatients(allPatients);
    setDoctors(allUsers.filter(u => u.role === 'doctor'));

    if (userRole === 'patient' && patientEmail) {
      const p = allPatients.find(item => item.email === patientEmail);
      if (p) {
        setInvoices(allInvoices.filter(inv => inv.patientId === p.id));
      } else {
        setInvoices([]);
      }
    } else {
      setInvoices(allInvoices);
    }
  };

  const handlePay = (invoiceId: string) => {
    payInvoice(invoiceId);
    showToast('Invoice paid successfully!', 'success');
    loadData();
  };

  const handleCreateInvoice = (data: { patientId: string; items: { description: string; amount: number }[]; dueDate: string }) => {
    const totalAmount = data.items.reduce((sum, i) => sum + i.amount, 0);
    addInvoice({
      patientId: data.patientId,
      items: data.items,
      totalAmount,
      status: 'unpaid',
      dueDate: data.dueDate,
    });
    showToast('New billing invoice generated!', 'success');
    setShowCreateModal(false);
    loadData();
  };

  const handleExportCSV = () => {
    const exportData = invoices.map(inv => {
      const patient = patients.find(p => p.id === inv.patientId);
      return {
        'Invoice ID': inv.id,
        'Patient Name': patient?.name || 'N/A',
        'Total Amount (₹)': inv.totalAmount,
        'Status': inv.status.toUpperCase(),
        'Due Date': inv.dueDate,
        'Created At': new Date(inv.createdAt).toLocaleDateString(),
      };
    });
    exportToCSV(exportData, `tn_invoices_${new Date().toISOString().split('T')[0]}`);
    showToast('Invoices exported to CSV', 'info');
  };

  const filteredInvoices = invoices.filter(inv => {
    const patient = patients.find(p => p.id === inv.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tamil Nadu Healthcare Billing & Invoices</h2>
          <p className="text-gray-600">Manage hospital billing, payment collections, and official state financial records</p>
        </div>
        <div className="flex items-center space-x-3">
          {userRole !== 'patient' && (
            <>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-xs"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Invoice
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors font-medium text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Collected Revenue</p>
              <p className="text-3xl font-bold text-emerald-950 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <IndianRupee className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Balance</p>
              <p className="text-3xl font-bold text-amber-950 mt-2">₹{pendingAmount.toLocaleString('en-IN')}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total Invoices</p>
              <p className="text-3xl font-bold text-blue-950 mt-2">{invoices.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice ID or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('unpaid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filterStatus === 'unpaid' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filterStatus === 'paid' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Paid
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Services Included</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No invoice records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const patient = patients.find(p => p.id === inv.patientId);
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-800 font-semibold">
                        {inv.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{patient?.name || 'Unknown Patient'}</div>
                        <div className="text-xs text-gray-500">{patient?.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {inv.items.map(i => `${i.description} (₹${i.amount.toLocaleString('en-IN')})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {inv.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {inv.status === 'unpaid' ? (
                          <button
                            onClick={() => handlePay(inv.id)}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="flex items-center text-emerald-600 text-xs font-medium">
                            <CheckCircle className="h-4 w-4 mr-1" /> Paid on {new Date(inv.paidAt || inv.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          patients={patients}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateInvoice}
        />
      )}
    </div>
  );
};

interface CreateInvoiceModalProps {
  patients: Patient[];
  onClose: () => void;
  onSubmit: (data: { patientId: string; items: { description: string; amount: number }[]; dueDate: string }) => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ patients, onClose, onSubmit }) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [items, setItems] = useState<{ description: string; amount: number }[]>([
    { description: 'Specialist Consultation Fee', amount: 500 }
  ]);

  const handleAddItem = () => {
    setItems(prev => [...prev, { description: '', amount: 250 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: any) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || items.some(i => !i.description || i.amount <= 0)) {
      alert('Please fill out all invoice items properly.');
      return;
    }
    onSubmit({ patientId, items, dueDate });
  };

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Patient Invoice (INR)</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Line Items & Services</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Description (e.g. Lab test, Echo ECG)"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', Number(e.target.value))}
                    className="w-28 px-3 py-1.5 border border-gray-300 rounded text-sm"
                    required
                    min={1}
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between items-center font-bold text-gray-900">
            <span>Total Calculated Amount:</span>
            <span className="text-xl text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoicesView;
