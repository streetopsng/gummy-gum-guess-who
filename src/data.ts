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
  fact: string;
  hint: string;
  photo: string;
  imgSrc?: string;
}

export const TEAM: TeamMember[] = [
  { name: 'Chidinma Obi', nick: 'QuietStorm', color: COLORS[0], fact: 'I once won a jollof rice cooking competition against 40 people and I wasn\'t even trying.', hint: 'She works in Product', photo: '😊' },
  { name: 'Emeka Eze', nick: 'IronFist', color: COLORS[1], fact: 'I have never eaten at a fast food restaurant. Not once in 31 years.', hint: 'He\'s in Engineering', photo: '😎' },
  { name: 'Zara Ahmed', nick: 'FlashZee', color: COLORS[2], fact: 'I learned to drive in 3 countries before I finally passed my test in Lagos.', hint: 'She\'s on the Design team', photo: '🙂' },
  { name: 'Adaeze Okafor', nick: 'AceOps', color: COLORS[3], fact: 'I can solve a Rubik\'s cube in under 2 minutes while holding a conversation.', hint: 'She runs Operations', photo: '😄' },
  { name: 'Kelvin Nwosu', nick: 'KelFast', color: COLORS[4], fact: 'My ringtone has been the same Fela Kuti song since 2014 and I refuse to change it.', hint: 'He\'s in Sales', photo: '🤩' },
  { name: 'Sade Bello', nick: 'SadeG', color: COLORS[5], fact: 'I did stand-up comedy once at a friend\'s wedding. I killed it.', hint: 'She\'s in Marketing', photo: '😁' },
  { name: 'Dami Lawal', nick: 'DamiDynamo', color: COLORS[6], fact: 'I have read every Harry Potter book at least 4 times. In English and Yoruba translation.', hint: 'He\'s in Finance', photo: '😏' },
  { name: 'Uche Okonkwo', nick: 'UcheK', color: COLORS[7], fact: 'I trained as a professional swimmer before pivoting into tech.', hint: 'She\'s in Data', photo: '😌' },
];

export function makeSVG(emoji: string, bg: string) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="300" height="300" fill="${bg}"/>
      <text x="150" y="155" font-size="120" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`
  );
}

export const TEAM_WITH_IMAGES = TEAM.map((m, i) => {
  const bgColors = ['#2a1a0a', '#0a1a2a', '#1a0a2a', '#0a2a1a', '#2a0a0a', '#2a1a0a', '#0a2a2a', '#2a0a1a'];
  return {
    ...m,
    imgSrc: makeSVG(m.photo, bgColors[i % bgColors.length])
  };
});

export interface Opponent {
  name: string;
  nick: string;
  color: string;
  score: number;
  streak: number;
  maxStreak: number;
}

export const INITIAL_OPPONENTS: Opponent[] = [
  { name: 'Emeka Eze', nick: 'IronFist', color: COLORS[1], score: 0, streak: 0, maxStreak: 0 },
  { name: 'Zara Ahmed', nick: 'FlashZee', color: COLORS[2], score: 0, streak: 0, maxStreak: 0 },
  { name: 'Kelvin Nwosu', nick: 'KelFast', color: COLORS[4], score: 0, streak: 0, maxStreak: 0 },
];
