"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AuthForm from "../components/AuthForm";
import ChatRoom from "../components/ChatRoom";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Перевіряємо поточну сесію
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Слухаємо зміни автентифікації
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Завантаження...</div>
      </div>
    );
  }

  return user ? (
    <ChatRoom user={user} onLogout={handleLogout} />
  ) : (
    <AuthForm onAuth={() => {}} />
  );
}
