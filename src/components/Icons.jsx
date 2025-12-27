import React from 'react';

export const IconWrapper = ({ children, size = 24, color = "currentColor", ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {children}
    </svg>
);

export const PipeIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M17 10c0-3-2.5-5-5-5h-2c-3 0-5 2-5 5v3c0 3 4 5 7 5h1" />
        <path d="M13 18l3 0" />
        <path d="M18 16l3-1" />
        <path d="M17.8 19.3L21 21" />
        <path d="M12 5h1a4 4 0 0 1 4 4v2" />
        <path d="M8 5h4" />
        <path d="M7 8c-1.5 0-3-1.5-3-3" />
    </IconWrapper>
);

export const BulbIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2 2 3 4 4.5V18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4.5C17 12 19 11 19 9a7 7 0 0 0-7-7z" />
        <path d="M9 9l6 0" />
        <path d="M12 5v4" />
    </IconWrapper>
);

export const FistIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M10 14L8 12l6-6 2.5 1.5M10.5 15.5l-2.5-3L3.5 16 10 22l8-7-2.5-4-3 3" />
        {/* Actually fit/hand is hard to draw in path manually, let's use a simpler "Hand/Glove" metaphor or a solid fist */}
        <path d="M11 11.5v-3a2.5 2.5 0 0 1 5 0v3" />
        <path d="M11 13.5v-3" />
        <path d="M8 12.5v-2" />
        <path d="M5 14v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-4" />
        <path d="M15 14h2" />
        {/* Let's try a simpler 'Rock' or Punch shape from Lucide 'Grab' or similar */}
        <path d="M16 11c0-2-1-3-3-3s-3 1-3 3v2h6v-2z" />
        <path d="M16 13h-6v4c0 1 1 2 3 2s3-1 3-2v-4z" />
        <path d="M10 13l-2 2" />
        <line x1="8" y1="15" x2="6" y2="15" />
    </IconWrapper>
);
// Let's replace with better path data from standard sets.

export const BadgeIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </IconWrapper> // Star/Badge shape
);

export const BookIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M6 7h9" />
        <path d="M6 11h9" />
    </IconWrapper>
);

export const NecklaceIcon = (props) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="7" />
        <path d="M12 12v.01" />
        <path d="M9 16c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v4z" />
        <path d="M12 5v3" />
    </IconWrapper>
);

export const EyeIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M2.5 12c.5-1 3.5-6 9.5-6s9 5 9.5 6c-.5 1-3.5 6-9.5 6s-9-5-9.5-6z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 10v.01" />
    </IconWrapper>
);

export const SkullIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M12 2c-4 0-7 3-7 7 0 2 1.5 4 3.5 5L7 19h10l-1.5-5c2-1 3.5-3 3.5-5 0-4-3-7-7-7z" />
        <path d="M9 11l.01 0" />
        <path d="M15 11l.01 0" />
        <path d="M11 16h2" />
    </IconWrapper>
);

// Improved paths attempts
export const IconsComplete = {
    Pipe: (props) => (
        <IconWrapper {...props} viewBox="0 0 24 24">
            <path d="M13 12h-2.5a2.5 2.5 0 0 0-2.5 2.5V19a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-4.5a2.5 2.5 0 0 0-2.5-2.5z" />
            <path d="M13 12V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2" />
            <path d="M15 12h2a3 3 0 0 1 3 3" />
            <path d="M16 8h-4" />
        </IconWrapper>
    ),
    Bulb: (props) => (
        <IconWrapper {...props}>
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-7 7c0 2 2 3 4 4.5V18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4.5C17 12 19 11 19 9a7 7 0 0 0-7-7z" />
            <polyline points="9 9 12 12 15 9" />
        </IconWrapper>
    ),
    Fist: (props) => (
        <IconWrapper {...props}>
            <rect x="6" y="8" width="12" height="10" rx="3" />
            <path d="M6 12h12" />
            <path d="M10 8V5a1 1 0 0 1 2 0v3" />
            <path d="M14 8V6a1 1 0 0 1 2 0v2" />
            <path d="M6 8V7a1 1 0 0 1 2 0v1" />
        </IconWrapper>
    ),
    Badge: (props) => (
        <IconWrapper {...props}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8l2 5h-4z" />
        </IconWrapper>
    ),
    Book: (props) => (
        <IconWrapper {...props}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </IconWrapper>
    ),
    Necklace: (props) => (
        <IconWrapper {...props}>
            <path d="M12 22a9 9 0 0 1-9-9 9 9 0 0 1 13.5-7.6L12 12l4.5 6.6A9 9 0 0 1 12 22z" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2v2" />
        </IconWrapper>
    ),
    Eye: (props) => (
        <IconWrapper {...props}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </IconWrapper>
    ),
    Skull: (props) => (
        <IconWrapper {...props}>
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <path d="M8 20v2h8v-2" />
            <path d="M12 16v0" />
            <path d="M12.5 17l-.5-4" />
            <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
        </IconWrapper>
    )
};

export const ICONS = IconsComplete;
