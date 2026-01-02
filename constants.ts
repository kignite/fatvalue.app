
import { Rarity, MeatCard } from './types';
import img10000 from './assets/10000.webp';
import img6000 from './assets/6000.avif';
import img4500 from './assets/4500.jpg';
import img3000 from './assets/3000.jpeg';

export const CARD_DATA: Record<Rarity, Omit<MeatCard, 'id'>> = {
  [Rarity.SSR]: {
    name: '日本 A5 和牛級成就',
    rarity: Rarity.SSR,
    price: 10000,
    description: '這 1kg 的脂肪，背後是傳說級的意志力',
    congrats: '天啊！這 1 公斤的離去簡直是傳說級的壯舉！妳減掉的每一克，都閃耀著如同 A5 和牛般珍貴的光芒。',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    // 对应图1: 黑石板上的霜降和牛
    imageUrl: img10000,
  },
  [Rarity.UR]: {
    name: '頂級和牛級成就',
    rarity: Rarity.UR,
    price: 6000,
    description: '這 1kg 的蛻變，換來了華麗的身姿',
    congrats: '太棒了！這 1 公斤的告別是如此優雅，它的價值就像頂級和牛一樣令人讚嘆。',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    // 对应图4: 白盤上的厚切肋眼
    imageUrl: img6000,
  },
  [Rarity.SR]: {
    name: '精選和牛級成就',
    rarity: Rarity.SR,
    price: 4500,
    description: '這 1kg 的堅持，讓妳的線條更有質感',
    congrats: '很有質感的進步！這 1 公斤的減少，讓妳的身體質感得到了如同精選和牛般的升級。',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    // 对应图2: 疊放的菲力厚片
    imageUrl: img4500,
  },
  [Rarity.N]: {
    name: '優質牛肉級成就',
    rarity: Rarity.N,
    price: 3000,
    description: '這 1kg 的累積，是踏實且幸福的基礎',
    congrats: '穩紮穩打的成就！這 1 公斤代表了妳最真實的汗水，這份幸福感就像優質牛肉一樣讓人安心。',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    // 对应图3: 鋪在生菜上的薄片肉
    imageUrl: img3000,
  },
};

export const MAX_DRAWS = 15;

export const getRandomRarity = (): Rarity => {
  const rand = Math.random() * 100;
  if (rand < 1) return Rarity.SSR;
  if (rand < 24) return Rarity.UR;
  if (rand < 54) return Rarity.SR;
  return Rarity.N;
};
