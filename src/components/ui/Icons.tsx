import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IconChevronRight: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}><path d="M9 6l6 6-6 6" /></svg>
);

export const IconChevronLeft: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}><path d="M15 6l-6 6 6 6" /></svg>
);

export const IconCheck: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
);

export const IconClose: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const IconFlame: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 21c4.2 0 7-2.8 7-6.5 0-2.6-1.6-4.6-2.8-6.2-.4-.5-1.1-.3-1.2.3-.2 1.4-1 2.6-1.7 2.2-.6-.3-.6-1.4-.5-2.4.2-2.4-.9-4.6-2.8-5.9-.4-.3-1 0-.9.5.4 2-.2 3.6-1.6 5.1C6 9.7 5 11.6 5 14.5 5 18.2 7.8 21 12 21z" />
  </svg>
);

export const IconBolt: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" /></svg>
);

export const IconBurst: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 2v5M12 17v5M4.2 4.2l3.5 3.5M16.3 16.3l3.5 3.5M2 12h5M17 12h5M4.2 19.8l3.5-3.5M16.3 7.7l3.5-3.5" />
  </svg>
);

export const IconSliders: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M20 18h0" />
    <circle cx="14" cy="6" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const IconGamepad: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="7.5" width="19" height="10" rx="4" />
    <path d="M7 10.5v4M5 12.5h4" />
    <circle cx="15.5" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLightbulb: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.8-4.8" />
  </svg>
);

export const IconEye: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l1.4 4.2L18 8.6l-4.6 1.4L12 14.2l-1.4-4.2L6 8.6l4.6-1.4L12 3z" />
    <path d="M19 15l.7 2.1 2.1.7-2.1.7L19 20.5l-.7-2-2.1-.7 2.1-.7.7-2.1z" />
  </svg>
);

export const IconSmile: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 13.5c1 1.5 2.4 2.3 4 2.3s3-.8 4-2.3" />
    <path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.5} />
  </svg>
);

export const IconShock: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="15.5" r="1.6" />
    <path d="M9 9.2h.01M15 9.2h.01" strokeWidth={2.5} />
  </svg>
);

export const IconClap: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M9 11.5l-2.6-2.6a1.6 1.6 0 00-2.3 2.3L8 15.1" />
    <path d="M8 15.1l-1.4-1.4a1.6 1.6 0 00-2.3 2.3l3.4 3.4c2 2 4.6 2 6.9 0l3.6-3.4a3.6 3.6 0 001-2.5V9.5" />
    <path d="M13 9.5V5a1.6 1.6 0 013.2 0v4.5M16.2 9.3V6.2a1.6 1.6 0 013.2 0V12" />
  </svg>
);

export const IconCrown: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M4 18h16M4.5 18l-1-9 5 3.5L12 6l3.5 6.5 5-3.5-1 9" strokeLinejoin="round" />
  </svg>
);
