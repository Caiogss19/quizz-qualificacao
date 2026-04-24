// ===========================
// SUPABASE INTEGRATION
// ===========================

const SUPABASE_URL = "https://xkdpbhzkhzxivwtcfulm.supabase.co";
const SUPABASE_KEY = ""; // ⚠️ Coloque sua Anon Key aqui para ativar a sincronização na nuvem

const SUPABASE_HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===========================
// QUIZZES (Table_quizz)
// ===========================

async function getQuizzesFromSupabase() {
  if (!SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Table_quizz?select=*`, {
      headers: SUPABASE_HEADERS
    });
    if (!res.ok) throw new Error("Falha ao buscar quizzes do Supabase");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Supabase Error:", err);
    return null;
  }
}

async function saveQuizToSupabase(quizObj) {
  if (!SUPABASE_KEY) return null;
  try {
    // Fazendo UPSERT (Update ou Insert baseado na Primary Key id)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Table_quizz`, {
      method: "POST",
      headers: {
        ...SUPABASE_HEADERS,
        "Prefer": "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify([quizObj])
    });
    if (!res.ok) throw new Error("Falha ao salvar quiz no Supabase");
    return await res.json();
  } catch (err) {
    console.error("Supabase Error:", err);
    return null;
  }
}

async function deleteQuizFromSupabase(id) {
  if (!SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Table_quizz?id=eq.${id}`, {
      method: "DELETE",
      headers: SUPABASE_HEADERS
    });
    if (!res.ok) throw new Error("Falha ao deletar quiz no Supabase");
    return true;
  } catch (err) {
    console.error("Supabase Error:", err);
    return false;
  }
}
