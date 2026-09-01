export const COLORS = [
  '#F5A623',
  '#3b82f6',
  '#a855f7',
  '#22c55e',
  '#ef4444',
  '#FF5C38',
  '#14b8a6',
  '#f43f5e',
  '#84cc16',
  '#0ea5e9',
  '#6C8EBF'
];

export interface TeamMember {
  name: string;
  nick: string;
  color: string;
  facts: string[];
  photo?: string;
  imgSrc?: string;
  ggEmail?: string;
}

export interface GameRoundItem extends TeamMember {
  currentFact: string;
}

export function makeSVG(emoji: string, bg: string) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="300" height="300" fill="${bg}"/>
      <text x="150" y="155" font-size="120" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`
  );
}

export interface Opponent {
  name: string;
  nick: string;
  color: string;
  score: number;
  streak: number;
  maxStreak: number;
}

