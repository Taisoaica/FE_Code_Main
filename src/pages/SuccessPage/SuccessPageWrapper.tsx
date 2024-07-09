import React from 'react';
import { Navigate } from 'react-router-dom';
import SuccessPage from './SuccessPage';

const SuccessPageWrapper: React.FC = () => {
  const isPaymentCompleted = new URLSearchParams(window.location.search).has('vnp_TransactionStatus');

  if (!isPaymentCompleted) {
    return <Navigate to="/" replace />;
  }

    return <SuccessPage />;
};

export default SuccessPageWrapper;