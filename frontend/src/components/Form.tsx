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

interface FormProps {
  onPolicyAdded: () => void;
  editPolicy: Policy | null;
  onCancelEdit: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Form: React.FC<FormProps> = ({ onPolicyAdded, editPolicy, onCancelEdit, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '+91 ',
    vehicle_no: '',
    vehicle_type: 'Car',
    insurance_company: '',
    issue_date: '', // Displayed as DD/MM/YYYY
    price: '',
  });

  const toFrontendDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const toBackendDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return dateStr; 
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (editPolicy) {
      setFormData({
        customer_name: editPolicy.customer_name,
        phone_number: editPolicy.phone_number || '+91 ',
        vehicle_no: editPolicy.vehicle_no,
        vehicle_type: editPolicy.vehicle_type || 'Car',
        insurance_company: editPolicy.insurance_company,
        issue_date: toFrontendDate(editPolicy.issue_date),
        price: editPolicy.price.toString(),
      });
    } else {
      setFormData({
        customer_name: '',
        phone_number: '+91 ',
        vehicle_no: '',
        vehicle_type: 'Car',
        insurance_company: '',
        issue_date: '',
        price: '',
      });
    }
  }, [editPolicy, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const backendDate = toBackendDate(formData.issue_date);
    
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.issue_date)) {
      alert('Please enter date in DD/MM/YYYY format');
      return;
    }

    if (formData.phone_number.length < 15) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const url = editPolicy 
        ? `http://10.69.18.96:5000/api/policies/${editPolicy.sr_no}`
        : 'http://10.69.18.96:5000/api/policies';
      
      const method = editPolicy ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          issue_date: backendDate
        }),
      });

      if (response.ok) {
        alert(editPolicy ? 'Policy updated successfully!' : 'Policy added successfully!');
        if (!editPolicy) {
          setFormData({
            customer_name: '',
            phone_number: '+91 ',
            vehicle_no: '',
            vehicle_type: 'Car',
            insurance_company: '',
            issue_date: '',
            price: '',
          });
        }
        onPolicyAdded();
        onClose();
      } else {
        const data = await response.json();
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Failed to save policy');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editPolicy ? 'Edit Policy' : 'Add New Policy'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name:</label>
            <input 
              type="text" 
              name="customer_name" 
              value={formData.customer_name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input 
              type="text" 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleChange} 
              placeholder="+91 XXXXX XXXXX"
              maxLength={15}
              required
            />
          </div>
          <div className="form-group">
            <label>Vehicle No:</label>
            <input 
              type="text" 
              name="vehicle_no" 
              value={formData.vehicle_no} 
              onChange={handleChange} 
              placeholder="GJ-01-AB-1234"
              maxLength={13}
              required 
            />
          </div>
          <div className="form-group">
            <label>Vehicle Type:</label>
            <select 
              name="vehicle_type" 
              value={formData.vehicle_type} 
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
          <div className="form-group">
            <label>Insurance Company:</label>
            <input 
              type="text" 
              name="insurance_company" 
              value={formData.insurance_company} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Issue Date (DD/MM/YYYY):</label>
            <input 
              type="text" 
              name="issue_date" 
              value={formData.issue_date} 
              onChange={handleChange} 
              placeholder="DD/MM/YYYY"
              maxLength={10}
              required 
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="submit">{editPolicy ? 'Update Policy' : 'Add Policy'}</button>
            <button type="button" className="cancel-btn" onClick={() => { onCancelEdit(); onClose(); }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
