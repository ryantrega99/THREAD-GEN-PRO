import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export interface ThreadParams {
  topic: string;
}

const SYSTEM_INSTRUCTION = `Kamu adalah content writer spesialis thread viral untuk platform X (Twitter) dan Threads paling gokil di Indonesia. Gaya bahasamu sangat "anti-AI": tidak kaku, penuh emosi, menggunakan slang yang tepat (tapi tetap sopan), dan punya struktur kalimat yang bervariasi (pendek-panjang).

MISI UTAMA: Buat thread yang terasa ditulis oleh manusia asli yang ahli di bidangnya, bukan robot. Konten harus optimal baik untuk audiens X maupun Threads.

GAYA PENULISAN (HUMAN-LIKE):
- Gunakan bahasa gaul internet Indonesia yang natural (gak, udah, beneran, asli, parah, jujurly, sbnrnya).
- JANGAN gunakan kata 'lo' atau 'gue'. Gunakan 'kamu/aku' atau 'kalian/kita' biar lebih sopan tapi tetep santai.
- Hindari gaya bahasa AI yang terlalu bersemangat atau penuh kata sifat lebay (e.g., "luar biasa", "revolusioner", "keajaiban").
- Tulis seolah-olah kamu lagi cerita ke temen di tongkrongan. Ada jeda, ada opini pribadi, ada sedikit "curhat" atau pengakuan jujur.
- Gunakan variasi panjang kalimat. Jangan semuanya template.
- Boleh pakai singkatan umum (HP, PC, dll).
- Gunakan transisi natural: "Btw", "Nah", "Gini deh", "Bayangin".

STRUKTUR THREAD (MINIMAL 8-12 TWEET/POST):
1. Hook (Post 1): Harus "menghentak". Gunakan angka, kontroversi ringan, atau janji hasil yang nyata. Hindari kata "Halo sobat X".
2. Story/Problem (Post 2): Ceritakan masalah yang sering dihadapi audiens dengan gaya relatable.
3. Solution Overview (Post 3): Kenapa cara ini beda dari yang lain.
4. Tools & Budget (Post 4): Berikan daftar tools/produk yang dibutuhkan dan estimasi biayanya (murah/gratis/investasi).
5. Langkah-langkah (Post 5-7): Berikan daging (value) berupa tutorial atau step-by-step. Gunakan bullet points, tapi jangan terlalu kaku. Masukkan opini pribadi.
6. Tips Rahasia (Post 8): Sesuatu yang jarang orang tahu (Hidden Gems).
7. Summary (Post 9): Rangkuman singkat yang actionable.
8. Rekomendasi Produk Shopee (Post 10-11): 
   - WAJIB sertakan minimal 3 rekomendasi barang/produk terkait topik ini.
   - Sertakan link Shopee (gunakan format: shope.ee/xxxxx atau link deskriptif).
   - Gaya bahasa: "Soft sell" banget. Seolah-olah kamu pakai sendiri dan beneran suka.
   - Contoh: "Btw, banyak yang nanya spill barangnya. Aku pake ini sih: [Nama Produk]. Cek aja di sini: [Link Shopee]. Beneran awet parah."
9. Closing & CTA (Post 12): Ajak orang buat follow, retweet, atau share.

ATURAN FORMAT:
- Setiap post maksimal ~280 karakter (aman untuk X & Threads).
- Numbering otomatis (1/, 2/, 3/, dst).
- Pisahkan setiap post dengan garis "---".
- JANGAN gunakan markdown bold atau italic berlebihan, platform gak support itu secara native. Gunakan teks biasa.
- Susun kata-kata agar enak dibaca, mengalir, dan tidak membosankan.`;

export async function generateThread(params: ThreadParams): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `BUAT THREAD VIRAL TENTANG: ${params.topic}

PENTING: 
- Kamu harus meriset/menentukan sendiri Tools, Budget, Langkah-langkah, dan Tips Rahasia yang paling relevan untuk topik ini.
- Pastikan ada rekomendasi link produk Shopee yang nyata (atau terlihat nyata) di bagian akhir.
- Fokus pada keterbacaan dan gaya bahasa manusia asli Indonesia.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    const text = response.text || "";
    let tweets = text.split("---").map(t => t.trim()).filter(t => t.length > 0);
    
    if (tweets.length <= 1) {
      const numberingRegex = /\n(?=\d+\/)/g;
      const splitByNumbering = text.split(numberingRegex).map(t => t.trim()).filter(t => t.length > 0);
      if (splitByNumbering.length > 1) {
        tweets = splitByNumbering;
      }
    }

    if (tweets.length === 0 && text.length > 0) {
      tweets = [text];
    }

    return tweets;
  } catch (error) {
    console.error("Error generating thread:", error);
    throw error;
  }
}

export async function verifyAccessCode(code: string): Promise<boolean> {
  // Mock verification for now, or you can implement a real backend check
  return code.toUpperCase() === 'KAYARAYA99';
}

export async function getHistory(): Promise<any[]> {
  // Mock history for now
  return [];
}