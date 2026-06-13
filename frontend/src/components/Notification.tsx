import React from 'react';

interface Policy {
  customer_name: string;
  expiry_date: string;
}

interface NotificationProps {
  policies: Policy[];
}

const Notification: React.FC<NotificationProps> = ({ policies }) => {
  const getExpiringSoon = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return policies.filter((policy) => {
      const expiry = new Date(policy.expiry_date);
      expiry.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 5;
    }).map(policy => {
      const expiry = new Date(policy.expiry_date);
      expiry.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        name: policy.customer_name,
        days: diffDays
      };
    });
  };

  const expiringList = getExpiringSoon();

  if (expiringList.length === 0) return null;

  return (
    <div className="notification-container">
      {expiringList.map((item, index) => (
        <div key={index} className="notification-banner">
          <strong>Action Required:</strong> {item.name}'s policy is expiring in {item.days === 0 ? 'today' : `${item.days} day(s)`}!
        </div>
      ))}
    </div>
  );
};

export default Notification;
