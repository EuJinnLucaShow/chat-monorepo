import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  imports: [SupabaseModule],
  providers: [ChatGateway],
})
export class ChatModule {}
