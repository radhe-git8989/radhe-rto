import React, { useState } from 'react';

interface Policy {
  sr_no: number;
  customer_name: string;
  phone_number: string;
  vehicle_no: string;
  vehicle_type: string;
  insurance_company: string;
  issue_date: string;
  price: number;
  expiry_date: string;
}

interface DashboardProps {
  policies: Policy[];
  onEdit: (policy: Policy) => void;
  onDelete: (sr_no: number) => void;
  onRenew: (policy: Policy) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ policies, onEdit, onDelete, onRenew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 5;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredPolicies = policies.filter(policy => 
    policy.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Sr No', 'Customer Name', 'Phone No', 'Vehicle No', 'Vehicle Type', 'Insurance Company', 'Issue Date', 'Price', 'Expiry Date'];
    const rows = filteredPolicies.map((p, index) => [
      index + 1,
      p.customer_name,
      p.phone_number || '-',
      p.vehicle_no,
      p.vehicle_type || 'Car',
      p.insurance_company,
      formatDate(p.issue_date),
      p.price,
      formatDate(p.expiry_date)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Insurance_Policies_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Insurance Policies</h2>
        <div className="dashboard-controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by Name or Vehicle No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="export-btn" onClick={exportToCSV}>Export CSV</button>
        </div>
      </div>
      
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Customer Name</th>
            <th>Phone No</th>
            <th>Vehicle No</th>
            <th>Type</th>
            <th>Insurance Company</th>
            <th>Issue Date</th>
            <th>Price</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPolicies.map((policy, index) => (
            <tr 
              key={policy.sr_no} 
              className={isExpiringSoon(policy.expiry_date) ? 'expiring-soon' : ''}
            >
              <td>{index + 1}</td>
              <td>{policy.customer_name}</td>
              <td>{policy.phone_number || '-'}</td>
              <td>{policy.vehicle_no}</td>
              <td><span className={`type-badge ${policy.vehicle_type?.toLowerCase() || 'car'}`}>{policy.vehicle_type || 'Car'}</span></td>
              <td>{policy.insurance_company}</td>
              <td>{formatDate(policy.issue_date)}</td>
              <td>₹{policy.price}</td>
              <td>{formatDate(policy.expiry_date)}</td>
              <td>
                <div className="action-buttons">
                  <button className="renew-btn" onClick={() => onRenew(policy)}>Renew</button>
                  <button className="edit-btn" onClick={() => onEdit(policy)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(policy.sr_no)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Dashboard;
