import React, { useEffect, useState } from 'react';
import { testAllConnections } from '../firebase/test-connection';

const FirebaseConnectionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    authConnected: boolean | null;
    firestoreConnected: boolean | null;
    testing: boolean;
  }>({
    authConnected: null,
    firestoreConnected: null,
    testing: false
  });

  const runTests = async () => {
    setTestResults(prev => ({ ...prev, testing: true }));
    const results = await testAllConnections();
    setTestResults({
      ...results,
      testing: false
    });
  };

  useEffect(() => {
    // Run tests when component mounts
    runTests();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Connection Test</h2>
      
      {testResults.testing ? (
        <div className="text-blue-500 font-medium mb-4">Testing Firebase connections...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Authentication:</span>
            {testResults.authConnected === null ? (
              <span className="text-gray-500">Not tested</span>
            ) : testResults.authConnected ? (
              <span className="text-green-600 font-medium">✅ Connected</span>
            ) : (
              <span className="text-red-600 font-medium">❌ Connection failed</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="font-medium">Firestore Database:</span>
            {testResults.firestoreConnected === null ? (
              <span className="text-gray-500">Not tested</span>
            ) : testResults.firestoreConnected ? (
              <span className="text-green-600 font-medium">✅ Connected</span>
            ) : (
              <span className="text-red-600 font-medium">❌ Connection failed</span>
            )}
          </div>
          
          <button 
            onClick={runTests}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Run Tests Again
          </button>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium mb-2">Check browser console for detailed logs.</p>
            <p>If tests fail, make sure:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your <code>.env</code> file has correct Firebase config values (no commas, quotes, etc.)</li>
              <li>You've created collections in Firestore (or security rules allow empty queries)</li>
              <li>Your Firebase project is properly set up with Authentication and Firestore enabled</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseConnectionTest;
