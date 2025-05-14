import React from 'react';
import FirebaseConnectionTest from '../components/FirebaseConnectionTest';

const FirebaseTest: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Firebase Connection Test</h1>
      <FirebaseConnectionTest />
    </div>
  );
};

export default FirebaseTest;
