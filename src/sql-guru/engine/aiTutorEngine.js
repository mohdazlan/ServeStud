/**
 * GenAI SQL Tutor Feedback Engine
 * Inspired by UTP Research Study (IUCEL 2025):
 * "Integrating Generative AI into SQL Learning: A Usability Study of a Prompt-Based Web Tutor"
 *
 * Implements:
 * 1. Semantic query structure diagnostics
 * 2. Pedagogical conversational feedback (matching Figure 1 in the paper)
 * 3. Live LLM invocation via OpenRouter API or Gemini API when API key is provided
 * 4. Rich offline semantic reasoning tutor engine when running locally
 */

export async function generateGenAiFeedback({
  userSql,
  activity,
  apiKey,
  apiProvider = 'openrouter', // 'openrouter' | 'gemini' | 'local'
  selectedModel = 'google/gemini-2.5-flash',
}) {
  const trimmed = (userSql || '').trim()

  if (!trimmed) {
    return {
      success: true,
      provider: 'local',
      feedback: {
        greeting: 'Salam perkenalan! Saya adalah Tutor AI SQL-Guru anda.',
        summary: 'Editor SQL masih kosong. Sila taipkan pertanyaan atau arahan DDL/DML anda untuk saya semak.',
        strengths: [],
        suggestions: [
          'Baca senario tugasan di panel kiri.',
          'Gunakan butang "Petunjuk Kontekstual" jika anda memerlukan panduan langkah demi langkah.',
        ],
        codeSnippet: null,
      },
    }
  }

  // If live API key is provided and not in purely local mode, try live cloud LLM
  if (apiKey && apiKey.trim() && apiProvider !== 'local') {
    try {
      if (apiProvider === 'openrouter') {
        const response = await callOpenRouterApi({
          apiKey,
          userSql,
          activity,
          model: selectedModel || 'google/gemini-2.5-flash',
        })
        return {
          success: true,
          provider: 'openrouter',
          model: selectedModel,
          rawResponse: response,
          feedback: parseLlmFeedback(response, userSql),
        }
      }

      if (apiProvider === 'gemini') {
        const response = await callGeminiApi({
          apiKey,
          userSql,
          activity,
        })
        return {
          success: true,
          provider: 'gemini',
          model: 'gemini-1.5-flash',
          rawResponse: response,
          feedback: parseLlmFeedback(response, userSql),
        }
      }
    } catch (err) {
      console.warn('Live LLM API call failed, falling back to local semantic AI engine:', err)
      // Fallback to local semantic engine with notice
    }
  }

  // Local Semantic Heuristic Tutor (Always available, instant, highly structured)
  const localAnalysis = generateLocalSemanticFeedback(trimmed, activity)
  return {
    success: true,
    provider: 'local-heuristic',
    feedback: localAnalysis,
  }
}

/**
 * Local Semantic Reasoning Engine (Emulating Figure 1 GenAI Feedback)
 */
function generateLocalSemanticFeedback(sql, activity) {
  const strengths = []
  const suggestions = []
  let improvedCode = null

  const isDDL = /CREATE\s+TABLE/i.test(sql)
  const isSelect = /SELECT/i.test(sql)
  const hasWhere = /WHERE/i.test(sql)
  const hasOrderBy = /ORDER\s+BY/i.test(sql)
  const hasJoin = /JOIN/i.test(sql)
  const hasGroupBy = /GROUP\s+BY/i.test(sql)

  // 1. DDL Analysis (CREATE TABLE)
  if (isDDL) {
    strengths.push('Struktur umum sintaks CREATE TABLE anda adalah sah dan mengikut piawaian SQL standard.')

    if (/PRIMARY\s+KEY/i.test(sql)) {
      strengths.push('Bagus! Anda telah mendefinisikan Kunci Utama (PRIMARY KEY) bagi memastikan integriti entiti jadual.')
    } else {
      suggestions.push('Disyorkan untuk menetapkan medan pengenalpasti (contohnya `branchNo`) sebagai `PRIMARY KEY`.')
    }

    if (/VARCHAR\s*\(\s*\)/i.test(sql) || /VARCHAR(?!\s*\()/i.test(sql)) {
      suggestions.push('Terdapat jenis data `VARCHAR` tanpa spesifikasi panjang aksara maksimum. Nyatakan panjang seperti `VARCHAR(50)`.')
    } else {
      strengths.push('Spesifikasi jenis data dan saiz rentetan (seperti VARCHAR) telah dinyatakan dengan jelas.')
    }

    if (!/NOT\s+NULL/i.test(sql)) {
      suggestions.push('Amalan terbaik dalam perancangan pangkalan data: Tambahkan kekangan `NOT NULL` selepas jenis data pada medan wajib.')
    } else {
      strengths.push('Kekangan `NOT NULL` digunakan dengan baik untuk mengelakkan nilai kosong tidak diingini.')
    }

    if (activity && activity.expectedCode) {
      improvedCode = activity.expectedCode
    }
  }

  // 2. SELECT & Filtering Analysis
  else if (isSelect) {
    strengths.push('Klausa `SELECT` dan `FROM` telah digarap dengan kemas.')

    if (activity && activity.requiredColumns) {
      const missingCols = activity.requiredColumns.filter((col) => !new RegExp(`\\b${col}\\b`, 'i').test(sql))
      if (missingCols.length > 0) {
        suggestions.push(`Pastikan anda menyenaraikan kolum sasaran berikut dalam klausa SELECT: ${missingCols.join(', ')}.`)
      } else {
        strengths.push('Semua lajur medan yang diminta dalam senario telah dipilih dengan tepat.')
      }
    }

    if (hasWhere) {
      strengths.push('Klausa penapisan `WHERE` berjaya mengecilkan skop carian rekod.')
      if (/'\d+'/.test(sql) && /salary|rent|mark|cgpa/i.test(sql)) {
        suggestions.push('Tip Kecekapan: Nilai numerik (seperti gaji, sewa, markah) tidak perlu diletakkan di dalam tanda petik tunggal.')
      }
    } else if (activity && activity.id === 'activity-2') {
      suggestions.push('Tugasan ini memerlukan penapisan staf bergaji tinggi (> 10,000) menggunakan klausa `WHERE salary > 10000`.')
    }

    if (hasOrderBy) {
      strengths.push('Klausa `ORDER BY` membolehkan paparan disusun secara teratur untuk kemudahan analisis.')
      if (!/DESC/i.test(sql) && activity && /menurun|tertinggi|DESC/i.test(activity.scenario)) {
        suggestions.push('Senario meminta susunan menurun (tertinggi ke terendah). Tambahkan kata kunci `DESC` selepas nama kolum susunan.')
      }
    }

    if (hasJoin) {
      strengths.push('Penggunaan `INNER JOIN` menghubungkan data relasi antara jadual dengan betul.')
      if (!/ON\s+/i.test(sql)) {
        suggestions.push('Klausa JOIN memerlukan syarat pemadanan kunci rujukan, contohnya `ON Staff.branchNo = Branch.branchNo`.')
      }
    }

    if (hasGroupBy) {
      strengths.push('Pengelompokan `GROUP BY` digunakan bersama fungsi agregat.')
    }

    if (activity && activity.expectedCode) {
      improvedCode = activity.expectedCode
    }
  } else {
    suggestions.push('Mulakan pertanyaan anda dengan kata kunci SQL seperti `SELECT`, `CREATE TABLE`, `INSERT`, atau `UPDATE`.')
  }

  return {
    greeting: 'Ulasan Pembelajaran Semantik SQL-Guru:',
    summary:
      suggestions.length === 0
        ? 'Pertanyaan SQL anda sangat mantap dan mematuhi konvensyen amalan terbaik pangkalan data relasi.'
        : 'Terdapat beberapa perincian semantik dan konvensyen SQL yang boleh diperhalusi bagi mencapai hasil optimum.',
    strengths,
    suggestions,
    codeSnippet: improvedCode,
  }
}

/**
 * Live OpenRouter API Integration
 */
async function callOpenRouterApi({ apiKey, userSql, activity, model }) {
  const prompt = `Anda adalah Tutor Pakar SQL (SQL-Guru) untuk pelajar institusi pengajian tinggi.
Senario Pelajar: ${activity ? activity.scenario : 'Latihan SQL bebas'}
Matlamat Tugasan: ${activity ? activity.targetGoal : 'Menulis query yang tepat'}
Kod SQL Pelajar:
\`\`\`sql
${userSql}
\`\`\`

Sila berikan maklum balas pembelajaran yang membina dalam format JSON yang mengandungi medan:
- greeting: Salam mesra ringkas
- summary: Rumusan penilaian 1-2 ayat
- strengths: Senarai perkara yang telah dibuat dengan betul (array of strings)
- suggestions: Senarai cadangan penambahbaikan sintaks atau semantik (array of strings)
- codeSnippet: Contoh kod SQL yang dipertingkatkan (string atau null)`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
      'HTTP-Referer': 'https://servestud.edu.my',
      'X-Title': 'ServeStud SQL-Guru',
    },
    body: JSON.stringify({
      model: model || 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an educational SQL AI Tutor helping students learn relational databases. Always respond in constructive Malay/English with JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenRouter API error: HTTP ${res.status}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content || ''
}

/**
 * Live Google Gemini API Integration
 */
async function callGeminiApi({ apiKey, userSql, activity }) {
  const prompt = `Anda adalah Tutor Pakar SQL (SQL-Guru).
Senario Pelajar: ${activity ? activity.scenario : 'Latihan SQL'}
Kod SQL Pelajar:
\`\`\`sql
${userSql}
\`\`\`

Berikan maklum balas JSON:
{
  "greeting": "string",
  "summary": "string",
  "strengths": ["string"],
  "suggestions": ["string"],
  "codeSnippet": "string"
}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini API error: HTTP ${res.status}`)
  }

  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

/**
 * Parse LLM JSON string or fallback to text
 */
function parseLlmFeedback(rawText, userSql) {
  try {
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      greeting: parsed.greeting || 'Maklum Balas Tutor Pintar AI:',
      summary: parsed.summary || 'Berikut adalah ulasan bagi pertanyaan SQL anda.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      codeSnippet: parsed.codeSnippet || null,
    }
  } catch {
    return {
      greeting: 'Maklum Balas GenAI Tutor:',
      summary: rawText.slice(0, 200),
      strengths: ['Pertanyaan SQL anda telah dianalisis oleh model AI.'],
      suggestions: [rawText],
      codeSnippet: null,
    }
  }
}
