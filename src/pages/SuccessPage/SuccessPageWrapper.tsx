import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SuccessPage from './SuccessPage';

const SuccessPageWrapper: React.FC = () => {
  // const isPaymentCompleted = new URLSearchParams(window.location.search).has('vnp_TransactionStatus');

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isPaymentCompleted = query.has('vnp_TransactionStatus');
  const paymentMethod = query.get('paymentMethod') || '';
  
  if (!isPaymentCompleted && paymentMethod === '') {
    return <Navigate to="/" replace />;
  }

  return <SuccessPage />;
};

export default SuccessPageWrapper;