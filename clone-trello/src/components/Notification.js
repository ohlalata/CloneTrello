import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {  onMessageListener } from '../utils/firebase';

function Notification() {
    const [notification, setNotification] = useState({ title: '', body: '' });
  
    useEffect(() => {
      const unsubscribe = onMessageListener().then((payload) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
        toast.success(`${payload?.notification?.title}: ${payload?.notification?.body}`, {
          duration: 30000, 
          position: 'top-right'
        });
      });
      return () => {
        unsubscribe.catch((err) => console.log('failed: ', err));
      };
    }, []);
  
    return (
      <div>
        <Toaster />
      </div>
    );
  }
  
  export default Notification;