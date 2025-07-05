import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = url || `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      try {
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          reconnectAttempts.current = 0;
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            setLastMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          
          // Attempt to reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
              connect();
            }, reconnectDelay * reconnectAttempts.current);
          }
        };
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
        
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  const joinBusRoom = (busId: string) => {
    sendMessage({ type: 'join_bus', busId });
  };

  const lockSeat = (seatId: string, busId: string) => {
    sendMessage({ type: 'seat_lock', seatId, busId });
  };

  const unlockSeat = (seatId: string, busId: string) => {
    sendMessage({ type: 'seat_unlock', seatId, busId });
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
    joinBusRoom,
    lockSeat,
    unlockSeat
  };
}