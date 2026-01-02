
export enum Rarity {
  SSR = 'SSR',
  UR = 'UR',
  SR = 'SR',
  N = 'N'
}

export interface MeatCard {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  description: string;
  congrats: string;
  color: string;
  bgColor: string;
  imageUrl: string;
}

export interface GameState {
  stage: 'INTRO' | 'DRAWING' | 'SUMMARY';
  results: MeatCard[];
  currentDrawIndex: number;
  isAnimating: boolean;
}
