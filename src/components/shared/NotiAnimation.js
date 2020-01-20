import React from 'react';
import { notification } from 'antd';

export default function NotiAnimation (type,description, message, messageColor, placement) {
    
    notification[type]({
        className: 'notiAnimation',
        message: <span style={{color:`${messageColor}`}}>{message}</span>,
        description: description,
        duration: 2.5,  
        placement: placement,
        style: {
          borderLeft: `5px solid ${messageColor}`
        }
      });
}