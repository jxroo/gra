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
        <rect x="6" y="8" width="12" height="10" rx="3" />
        <path d="M6 12h12" />
        <path d="M10 8V5a1 1 0 0 1 2 0v3" />
        <path d="M14 8V6a1 1 0 0 1 2 0v2" />
        <path d="M6 8V7a1 1 0 0 1 2 0v1" />
    </IconWrapper>
);

export const BadgeIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </IconWrapper>
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

// Utility Icons
export const InfoIcon = (props) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </IconWrapper>
);

export const CheckIcon = (props) => (
    <IconWrapper {...props}>
        <polyline points="20 6 9 17 4 12" />
    </IconWrapper>
);

export const CrossIcon = (props) => (
    <IconWrapper {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </IconWrapper>
);

export const AlertIcon = (props) => (
    <IconWrapper {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </IconWrapper>
);

export const RobotIcon = (props) => (
    <IconWrapper {...props}>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
    </IconWrapper>
);

export const SearchIcon = (props) => (
    <IconWrapper {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </IconWrapper>
);

export const IconsComplete = {
    Pipe: PipeIcon,
    Bulb: BulbIcon,
    Fist: FistIcon,
    Badge: BadgeIcon,
    Book: BookIcon,
    Necklace: NecklaceIcon,
    Eye: EyeIcon,
    Skull: SkullIcon,
    Info: InfoIcon,
    Check: CheckIcon,
    Cross: CrossIcon,
    Alert: AlertIcon,
    Robot: RobotIcon,
    Search: SearchIcon
};

export const ICONS = IconsComplete;
