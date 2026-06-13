import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Form from './components/Form';
import Notification from './components/Notification';
import RenewModal from './components/RenewModal';

interface Policy {
  sr_no: number;
  customer_name: string;
  phone_number: string;
  vehicle_no: string;
  insurance_company: string;
  issue_date: string;
  price: number;
  expiry_date: string;
}

function App() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPolicy, setEditPolicy] = useState<Policy | null>(null);
  const [renewPolicy, setRenewPolicy] = useState<Policy | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('http://10.69.18.96:5000/api/policies');
      const data = await response.json();
      setPolicies(data);
      setLoading(false);
      setEditPolicy(null);
      setRenewPolicy(null);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (sr_no: number) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        const response = await fetch(`http://10.69.18.96:5000/api/policies/${sr_no}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPolicies();
        } else {
          alert('Failed to delete policy');
        }
      } catch (error) {
        console.error('Error deleting policy:', error);
      }
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (editPolicy) {
      setIsFormOpen(true);
    }
  }, [editPolicy]);

  return (
    <div className="app-container">
      <header>
        <h1>RADHE RTO</h1>
      </header>
      
      <Notification policies={policies} />
      
      <main>
        <Form 
          onPolicyAdded={fetchPolicies} 
          editPolicy={editPolicy} 
          onCancelEdit={() => setEditPolicy(null)}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
        
        {loading ? (
          <p>Loading policies...</p>
        ) : (
          <Dashboard 
            policies={policies} 
            onEdit={(policy) => setEditPolicy(policy)}
            onDelete={handleDelete}
            onRenew={(policy) => setRenewPolicy(policy)}
          />
        )}
      </main>

      <button className="fab" onClick={() => setIsFormOpen(true)} title="Add New Policy">+</button>

      {renewPolicy && (
        <RenewModal 
          policy={renewPolicy} 
          onClose={() => setRenewPolicy(null)} 
          onRenewSuccess={fetchPolicies} 
        />
      )}
    </div>
  );
}

export default App;
