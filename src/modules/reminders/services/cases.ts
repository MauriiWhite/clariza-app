import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type CaseInsert = {
  persona: string;
  age?: number;
  city?: string;
  problem: string;
  diagnosis?: any;
  schedule?: any;
  claim?: any;
  status?: 'draft' | 'reminders_active' | 'resolved';
};

export async function saveCase(caseData: CaseInsert) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Obtener el usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("cases")
    .insert([{ ...caseData, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error("Error saving case:", error);
    throw error;
  }

  return data;
}

export async function getUserCases() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cases:", error);
    throw error;
  }

  return data;
}

export async function getCaseById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching case:", error);
    throw error;
  }

  return data;
}
