export interface User {
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
    created_at: string;
  }
  
  export interface Room {
    id: string;
    name: string;
    description?: string;
    created_by: string;
    created_at: string;
    profiles?: {
      username: string;
      avatar_url?: string;
    };
  }
  
  export interface Message {
    id: string;
    content: string;
    user_id: string;
    room_id: string;
    message_type?: 'text' | 'file' | 'image';
    file_data?: {
      fileName: string;
      originalName: string;
      fileType: string;
      fileSize: number;
    };
    created_at: string;
    profiles: {
      username: string;
      avatar_url?: string;
    };
  }
  
  export interface CreateMessageDto {
    content: string;
    userId: string;
    roomId: string;
    messageType?: 'text' | 'file' | 'image';
    fileData?: Message['file_data'];
  }
  
  export interface JoinRoomDto {
    roomId: string;
    userId: string;
    profile: {
      username: string;
      avatar_url?: string;
    };
  }
  
  export interface CreateRoomDto {
    name: string;
    description?: string;
    userId: string;
  }
  
  // Socket Events
  export interface ServerToClientEvents {
    room_messages: (messages: Message[]) => void;
    new_message: (message: Message) => void;
    rooms_list: (rooms: Room[]) => void;
    room_created: (room: Room) => void;
    online_users: (users: User[]) => void;
    user_joined: (data: { userId: string; username: string; message: string }) => void;
    user_left: (data: { userId: string; message: string }) => void;
    error: (error: { message: string }) => void;
    upload_url: (data: { uploadUrl: string; messageId: string }) => void;
  }
  
  export interface ClientToServerEvents {
    join_room: (data: JoinRoomDto) => void;
    leave_room: (data: { roomId: string; userId: string }) => void;
    send_message: (data: CreateMessageDto) => void;
    create_room: (data: CreateRoomDto) => void;
    get_rooms: () => void;
    get_online_users: (data: { roomId: string }) => void;
    upload_file: (data: {
      fileName: string;
      fileType: string;
      fileSize: number;
      userId: string;
      roomId: string;
    }) => void;
  }