import React from 'react';
import GuestManager from '../components/GuestManager';
import { useParams } from 'react-router-dom';

const GuestManagerPage: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Guest Management</h1>
          <p className="text-muted mb-4">
            Add and manage guests, import contacts, and track RSVPs for your events.
          </p>
          <GuestManager eventId={eventId} showAllGuests={!eventId} />
        </div>
      </div>
    </div>
  );
};

export default GuestManagerPage;
