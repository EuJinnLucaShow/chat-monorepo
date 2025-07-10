import { IsString, IsUUID, IsNotEmpty } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  roomId: string;
}

export class JoinRoomDto {
  @IsUUID()
  roomId: string;

  @IsUUID()
  userId: string;
}
