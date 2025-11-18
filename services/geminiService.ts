import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePropertyListing = async function* (url: string) {
  try {
    const ai = getAiClient();
    
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: `Analyzuj túto nehnuteľnosť na základe odkazu: ${url}.
      
      Lokalita: Bratislava - Staré Mesto (ak je inzerát z inej lokality, upozorni na to).
      
      Tvojou úlohou je napísať luxusný, expertný posudok pre klienta značky ONE LIFE. Text musí byť rozdelený do prehľadných vizuálnych blokov.
      
      Štruktúra odpovede:
      
      1. **Úvod**
      Napíš pútavý, sofistikovaný úvod o nehnuteľnosti a jej charaktere.
      
      2. **Silné stránky**
      Vymenuj kľúčové benefity v odrážkach, ale každú odrážku detailne a kvetnato rozvini.
      
      3. **Slabé stránky**
      Kriticky, ale profesionálne popíš nevýhody v odrážkach.
      
      4. **ONE LIFE Verdikt**
      Zhrň investičný potenciál do 2-3 viet.
      Na úplný záver napíš jednu samostatnú, údernú vetu ako citát (použi > na začiatku riadku), ktorá slúži ako definitívne odporúčanie ("Buy", "Pass", alebo "Invest with caution").
      
      Tón: Exkluzívny, vecný, expertný. Formátovanie Markdown. Používaj tučné písmo pre zvýraznenie kľúčových vlastností.`,
      config: {
        systemInstruction: "Si senior realitný expert pre ONE LIFE, prémiovú realitnú kanceláriu. Tvojim cieľom je poskytnúť klientovi absolútnu pravdu o nehnuteľnosti. Výstup formátuj do čistých blokov textu. Používaj Google Search na overenie informácií o lokalite a cenách.",
        tools: [{ googleSearch: {} }],
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error analyzing property:", error);
    throw error;
  }
};