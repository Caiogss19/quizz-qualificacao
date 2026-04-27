// ===========================
// SUPABASE INTEGRATION
// ===========================

const SUPABASE_URL = "https://xkdpbhzkhzxivwtcfulm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZHBiaHpraHp4aXZ3dGNmdWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzczMzUsImV4cCI6MjA4OTM1MzMzNX0.frsj-BuDJFq32q6q9oFJQSLgHqqgjn-VD6lEqcHLp94";

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

// ===========================
// LEADS / RESPOSTAS (Table_leads)
// ===========================

async function saveLeadToSupabase(responseData) {
  if (!SUPABASE_KEY) return null;
  try {
    const payload = {
      quiz_id:          responseData.quiz_id          || null,
      quiz_name:        responseData.quiz_name        || null,
      total_score:      responseData.total_score      || 0,
      result_id:        responseData.result_id        || null,
      result_title:     responseData.result_title     || null,
      duration_seconds: responseData.duration_seconds || null,
      lead:             responseData.lead             || {},
      answers:          responseData.answers          || {},
      utms:             responseData.utms             || {},
      user_agent:       responseData.user_agent       || navigator.userAgent || null,
      url_origem:       responseData.url_origem       || window.location.href || null
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/table_leads`, {
      method: "POST",
      headers: {
        ...SUPABASE_HEADERS,
        "Prefer": "resolution=ignore-duplicates,return=representation"
      },
      body: JSON.stringify([payload])
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Supabase Error body:", errBody);
      throw new Error(`Falha ao salvar lead no Supabase: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Supabase Error:", err);
    return null;
  }
}

async function getLeadsFromSupabase() {
  if (!SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/table_leads?select=*&order=timestamp.desc`, {
      headers: SUPABASE_HEADERS
    });
    if (!res.ok) throw new Error("Falha ao buscar leads do Supabase");
    return await res.json();
  } catch (err) {
    console.error("Supabase Error:", err);
    return [];
  }
}

async function deleteLeadFromSupabase(id) {
  if (!SUPABASE_KEY || !id) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/table_leads?id=eq.${id}`, {
      method: "DELETE",
      headers: SUPABASE_HEADERS
    });
    if (!res.ok) throw new Error("Falha ao deletar lead no Supabase");
    return true;
  } catch (err) {
    console.error("Supabase Error:", err);
    return false;
  }
}
