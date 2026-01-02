
import { GoogleGenAI } from "@google/genai";
import { MeatCard } from "../types";

export const generateFinalEvaluation = async (results: MeatCard[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const meatCounts = results.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPrice = results.reduce((sum, card) => sum + card.price, 0);

  const prompt = `
    玩家完成了「減脂成就價值衡量遊戲」。
    他成功減重了 15 公斤。
    遊戲核心概念：將「減掉的每一公斤脂肪」比喻為「高品質牛肉的價值」。這不是抽獎吃肉，而是衡量玩家減重成就的昂貴程度。
    
    15 公斤的價值組成（抽卡結果）：
    - 日本 A5 和牛級 (SSR): ${meatCounts['SSR'] || 0} 公斤
    - 頂級和牛級 (UR): ${meatCounts['UR'] || 0} 公斤
    - 精選和牛級 (SR): ${meatCounts['SR'] || 0} 公斤
    - 優質牛肉級 (N): ${meatCounts['N'] || 0} 公斤
    - 總成就估值：$${totalPrice.toLocaleString()} TWD
    
    請扮演一位「可愛、溫柔、帶一點儀式感」的主持人，給出一段「整體成就評語」。
    
    要求：
    1. 語氣溫柔，充滿陪伴感與肯定。
    2. 強調玩家減掉的這 15 公斤脂肪，其背後的意志力與自律是多麼「昂貴」與「珍貴」。
    3. 讚美玩家現在擁有更輕盈、更有質感的身體，這就是最好的禮物。
    4. 不要提到抽獎中獎、吃大餐、賭博等字眼。
    5. 繁體中文回答，約 150-200 字，使用適量的 emoji。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "親愛的，看著這 15 公斤轉化成的璀璨價值，我真的為妳感到驕傲。這不僅僅是體重的減少，更是妳對生命熱愛的具現化。妳值得這份閃閃發光的成就！✨";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "親愛的，這 15 公斤的減重成果真的太令人敬佩了！每一公斤的減少，都是妳堅持與自律的甜美回報。妳的意志力如同最高級的和牛般珍貴，請一定要好好愛護這個全新的、更輕盈的自己。💖";
  }
};
