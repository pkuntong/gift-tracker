import React from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'birthday' | 'wedding' | 'holiday' | 'other';
}

const Events: React.FC = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Birthday Party',
      date: '2024-04-15',
      description: 'Annual birthday celebration',
      type: 'birthday'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.date}</p>
              <p className="text-gray-700">{event.description}</p>
              <span className="inline-block mt-2 px-2 py-1 text-sm text-white bg-blue-500 rounded">
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events; 