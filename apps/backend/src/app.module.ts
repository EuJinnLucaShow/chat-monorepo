import { Module } from "@nestjs/common";
import { ChatModule } from "./chat/chat.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [SupabaseModule, ChatModule],
})
export class AppModule {}
