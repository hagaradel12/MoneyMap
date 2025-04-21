'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

interface Notification {
  _id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPanel({ email }: { email: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

  const backend_url = 'http://localhost:3000';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(`${backend_url}/notifications/user/${email}`);
        console.log(response.data);
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [email]);

  return (
    <div className="bg-white border rounded-lg shadow-md w-80 max-h-96 overflow-y-auto p-4">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif._id} className="mb-3 p-2 border-b">
            <p className="font-medium">{notif.title}</p>
            <p className="text-sm text-gray-700">{notif.description}</p>
            <p className="text-xs text-gray-400">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
