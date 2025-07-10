import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { CreateMessageDto, JoinRoomDto } from "./dto/message.dto";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<
    string,
    { socketId: string; userId: string }
  >();

  constructor(private readonly supabaseService: SupabaseService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Видаляємо користувача з мапи
    for (const [key, value] of this.connectedUsers.entries()) {
      if (value.socketId === client.id) {
        this.connectedUsers.delete(key);
        break;
      }
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto & { profile: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, profile } = data;
    
    await client.join(roomId);
    
    // Оновлюємо інформацію про користувача
    this.connectedUsers.set(userId, {
      socketId: client.id,
      userId,
      profile,
      currentRoom: roomId,
    });

    const messages = await this.supabaseService.getMessages(roomId);
    client.emit('room_messages', messages);
    
    // Оновлюємо список онлайн користувачів для всіх в кімнаті
    const onlineUsers = Array.from(this.connectedUsers.values())
      .filter(user => user.currentRoom === roomId)
      .map(user => user.profile);
    
    this.server.to(roomId).emit('online_users', onlineUsers);
    
    client.to(roomId).emit('user_joined', {
      userId,
      username: profile.username,
      message: `${profile.username} приєднався до кімнати`,
    });
  }

  @SubscribeMessage("leave_room")
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, userId } = data;

    await client.leave(roomId);

    client.to(roomId).emit("user_left", {
      userId,
      message: "Користувач покинув кімнату",
    });
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const { content, userId, roomId } = data;

      // Створюємо повідомлення в базі даних
      const message = await this.supabaseService.createMessage(
        content,
        userId,
        roomId
      );

      // Відправляємо повідомлення всім користувачам кімнати
      this.server.to(roomId).emit("new_message", message);

      return message;
    } catch (error) {
      client.emit("error", { message: "Помилка відправки повідомлення" });
    }
  }

  @SubscribeMessage("get_rooms")
  async handleGetRooms(@ConnectedSocket() client: Socket) {
    try {
      const rooms = await this.supabaseService.getRooms();
      client.emit("rooms_list", rooms);
    } catch (error) {
      client.emit("error", { message: "Помилка завантаження кімнат" });
    }
  }

  @SubscribeMessage("create_room")
  async handleCreateRoom(
    @MessageBody() data: { name: string; description: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const { name, description, userId } = data;

      const room = await this.supabaseService.createRoom(
        name,
        description,
        userId
      );

      // Оновлюємо список кімнат для всіх користувачів
      this.server.emit("room_created", room);

      return room;
    } catch (error) {
      client.emit("error", { message: "Помилка створення кімнати" });
    }
  }

  @SubscribeMessage("get_online_users")
  async handleGetOnlineUsers(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId } = data;
    const onlineUsers = Array.from(this.connectedUsers.values())
      .filter((user) => user.currentRoom === roomId)
      .map((user) => user.profile);

    client.emit("online_users", onlineUsers);
  }
}

@SubscribeMessage('upload_file')
async handleFileUpload(
  @MessageBody() data: {
    fileName: string;
    fileType: string;
    fileSize: number;
    userId: string;
    roomId: string;
  },
  @ConnectedSocket() client: Socket,
) {
  try {
    const { fileName, fileType, fileSize, userId, roomId } = data;
    
    // Перевіряємо розмір файлу (максимум 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      client.emit('error', { message: 'Файл занадто великий (максимум 10MB)' });
      return;
    }

    // Генеруємо унікальне ім'я файлу
    const uniqueFileName = `${Date.now()}-${fileName}`;
    
    // Створюємо повідомлення з файлом
    const message = await this.supabaseService.createMessage(
      `📎 ${fileName}`,
      userId,
      roomId,
      'file',
      {
        fileName: uniqueFileName,
        originalName: fileName,
        fileType,
        fileSize,
      }
    );

    this.server.to(roomId).emit('new_message', message);
    
    // Повертаємо URL для завантаження
    const uploadUrl = await this.supabaseService.getUploadUrl(uniqueFileName);
    client.emit('upload_url', { uploadUrl, messageId: message.id });
    
  } catch (error) {
    client.emit('error', { message: 'Помилка завантаження файлу' });
  }
}
