
import React from 'react';
import PostCalendar from '../components/ui/PostCalendar';
import { ScheduledPostsProvider } from '../context/ScheduledPostsContext';

const Calendar = () => {
  return (
    <ScheduledPostsProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-600">View all scheduled posts across all clients</p>
        </div>

        <PostCalendar showAllClients={true} />
      </div>
    </ScheduledPostsProvider>
  );
};

export default Calendar;
