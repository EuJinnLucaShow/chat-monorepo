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
import {
  CreateMessageDto,
  JoinRoomDto,
  CreateRoomDto,
  ServerToClientEvents,
  ClientToServerEvents,
  User,
} from "@chat/shared";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  private connectedUsers = new Map<
    string,
    {
      socketId: string;
      userId: string;
      profile: User;
      currentRoom?: string;
    }
  >();

  constructor(private readonly supabaseService: SupabaseService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [key, value] of this.connectedUsers.entries()) {
      if (value.socketId === client.id) {
        this.connectedUsers.delete(key);
        if (value.currentRoom) {
          client.to(value.currentRoom).emit("user_left", {
            userId: value.userId,
            message: `${value.profile.username} покинув кімнату`,
          });
        }
        break;
      }
    }
  }

  @SubscribeMessage("join_room")
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, userId, profile } = data;

    await client.join(roomId);

    this.connectedUsers.set(userId, {
      socketId: client.id,
      userId,
      profile,
      currentRoom: roomId,
    });

    const messages = await this.supabaseService.getMessages(roomId);
    client.emit("room_messages", messages);

    const onlineUsers = Array.from(this.connectedUsers.values())
      .filter((user) => user.currentRoom === roomId)
      .map((user) => user.profile);

    this.server.to(roomId).emit("online_users", onlineUsers);

    client.to(roomId).emit("user_joined", {
      userId,
      username: profile.username,
      message: `${profile.username} приєднався до кімнати`,
    });
  }
}
