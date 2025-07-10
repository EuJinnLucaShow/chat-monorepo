"use client";

import { useState, useEffect, useRef } from "react";
import { socketManager } from "../lib/socket";
import { Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url?: string;
  };
}

interface Room {
  id: string;
  name: string;
  description: string;
}

interface ChatRoomProps {
  user: any;
  onLogout: () => void;
}

export default function ChatRoom({ user, onLogout }: ChatRoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketInstance = socketManager.connect();
    setSocket(socketInstance);

    // Слухачі подій
    socketInstance.on("rooms_list", (roomsList: Room[]) => {
      setRooms(roomsList);
    });

    socketInstance.on("room_messages", (roomMessages: Message[]) => {
      setMessages(roomMessages);
    });

    socketInstance.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("error", (error: any) => {
      console.error("Socket error:", error);
      alert(error.message);
    });

    // Завантажуємо список кімнат
    socketInstance.emit("get_rooms");

    return () => {
      socketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = (room: Room) => {
    if (socket && user) {
      if (currentRoom) {
        socket.emit("leave_room", {
          roomId: currentRoom.id,
          userId: user.id,
        });
      }

      socket.emit("join_room", {
        roomId: room.id,
        userId: user.id,
      });

      setCurrentRoom(room);
      setMessages([]);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !currentRoom || !newMessage.trim() || loading) return;

    setLoading(true);
    socket.emit("send_message", {
      content: newMessage.trim(),
      userId: user.id,
      roomId: currentRoom.id,
    });

    setNewMessage("");
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar з кімнатами */}
      <div className="w-1/4 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Кімнати</h2>
            <button
              onClick={onLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Вийти
            </button>
          </div>
          <p className="text-sm text-gray-600">Привіт, {user.email}!</p>
        </div>

        <div className="overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => joinRoom(room)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                currentRoom?.id === room.id ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              <h3 className="font-medium">{room.name}</h3>
              {room.description && (
                <p className="text-sm text-gray-600">{room.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Основна область чату */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Заголовок кімнати */}
            <div className="bg-white p-4 shadow-sm border-b">
              <h1 className="text-xl font-bold">{currentRoom.name}</h1>
              {currentRoom.description && (
                <p className="text-gray-600">{currentRoom.description}</p>
              )}
            </div>

            {/* Повідомлення */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {message.profiles.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-medium">
                        {message.profiles.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Форма відправки повідомлення */}
            <div className="bg-white p-4 border-t">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введіть повідомлення..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Відправити
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Виберіть кімнату для початку чату</p>
          </div>
        )}
      </div>
    </div>
  );
}
