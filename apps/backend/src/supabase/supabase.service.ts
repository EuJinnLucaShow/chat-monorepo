import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  get client() {
    return this.supabase;
  }

  // Отримання профілю користувача
  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Отримання всіх кімнат
  async getRooms() {
    const { data, error } = await this.supabase
      .from("rooms")
      .select(
        `
        *,
        profiles:created_by (username, avatar_url)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Отримання повідомлень кімнати
  async getMessages(roomId: string, limit = 50) {
    const { data, error } = await this.supabase
      .from("messages")
      .select(
        `
        *,
        profiles:user_id (username, avatar_url)
      `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Створення повідомлення
  async createMessage(content: string, userId: string, roomId: string) {
    const { data, error } = await this.supabase
      .from("messages")
      .insert({
        content,
        user_id: userId,
        room_id: roomId,
      })
      .select(
        `
        *,
        profiles:user_id (username, avatar_url)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  // Створення кімнати
  async createRoom(name: string, description: string, createdBy: string) {
    const { data, error } = await this.supabase
      .from("rooms")
      .insert({
        name,
        description,
        created_by: createdBy,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async searchMessages(roomId: string, query: string, limit = 20) {
    const { data, error } = await this.supabase
      .from("messages")
      .select(
        `
        *,
        profiles:user_id (username, avatar_url)
      `
      )
      .eq("room_id", roomId)
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}
