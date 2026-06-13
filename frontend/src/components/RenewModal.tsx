import React, { useState, useEffect } from 'react';

interface Policy {
  sr_no: number;
  customer_name: string;
  phone_number: string;
  vehicle_no: string;
  vehicle_type: string;
  insurance_company: string;
  issue_date: string;
  price: number;
}

interface RenewModalProps {
  policy: Policy;
  onClose: () => void;
  onRenewSuccess: () => void;
}

const RenewModal: React.FC<RenewModalProps> = ({ policy, onClose, onRenewSuccess }) => {
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  const [formData, setFormData] = useState({
    customer_name: policy.customer_name,
    phone_number: policy.phone_number || '+91 ',
    vehicle_no: policy.vehicle_no,
    vehicle_type: policy.vehicle_type || 'Car',
    insurance_company: policy.insurance_company,
    issue_date: formattedToday,
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'phone_number') {
      if (!value.startsWith('+91 ')) value = '+91 ';
      let numbers = value.slice(4).replace(/\D/g, '');
      if (numbers.length > 10) numbers = numbers.slice(0, 10);
      if (numbers.length > 5) {
        value = `+91 ${numbers.slice(0, 5)} ${numbers.slice(5)}`;
      } else {
        value = `+91 ${numbers}`;
      }
    }

    if (name === 'vehicle_no') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      let formatted = '';
      if (value.length > 0) formatted += value.slice(0, 2);
      if (value.length > 2) formatted += '-' + value.slice(2, 4);
      if (value.length > 4) formatted += '-' + value.slice(4, 6);
      if (value.length > 6) formatted += '-' + value.slice(6, 10);
      value = formatted;
    }
    
    if (name === 'issue_date') {
      value = value.replace(/\D/g, ''); 
      if (value.length > 2 && value.length <= 4) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      } else if (value.length > 4) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const toBackendDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split('/');
    if (!d || !m || !y) return dateStr;
    return `${y}-${m}-${d}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.issue_date)) {
      alert('Please enter date in DD/MM/YYYY format');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/policies/${policy.sr_no}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          issue_date: toBackendDate(formData.issue_date)
        }),
      });

      if (response.ok) {
        alert('Policy renewed successfully!');
        onRenewSuccess();
      } else {
        const data = await response.json();
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error renewing policy:', error);
      alert('Failed to renew policy');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Renew Policy: {policy.customer_name}</h2>
        <p>Vehicle: {policy.vehicle_no} ({policy.vehicle_type})</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Insurance Company:</label>
            <input type="text" name="insurance_company" value={formData.insurance_company} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>New Issue Date (DD/MM/YYYY):</label>
            <input type="text" name="issue_date" value={formData.issue_date} onChange={handleChange} placeholder="DD/MM/YYYY" maxLength={10} required />
          </div>
          <div className="form-group">
            <label>New Price:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="Enter new price" />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-renew-btn">Confirm Renewal</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewModal;
