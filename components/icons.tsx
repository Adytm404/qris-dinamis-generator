import React from 'react';

interface IconProps {
  className?: string;
}

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <i className={`fa-solid fa-chevron-left ${className}`}></i>
);

export const MoreHorizontalIcon: React.FC<IconProps> = ({ className }) => (
  <i className={`fa-solid fa-ellipsis ${className}`}></i>
);

export const ImagePlusIcon: React.FC<IconProps> = ({ className }) => (
  <i className={`fa-solid fa-image ${className}`}></i>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
  <i className={`fa-solid fa-chevron-down ${className}`}></i>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <i className={`fa-solid fa-trash-can ${className}`}></i>
);

export const QrisLogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg width="60" height="20" viewBox="0 0 78 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M11.666 26C8.55467 26 5.82667 24.9692 3.482 22.9077C1.17867 20.8462 0.0266667 18.1538 0 15.8308V14.1385H8.334V15.8308C8.334 16.9231 8.706 17.8462 9.45 18.6C10.194 19.3154 11.044 19.6769 12 19.6769H12.942C13.882 19.6769 14.732 19.3154 15.486 18.5923C16.24 17.8231 16.612 16.9 16.612 15.8231V0H24.946V15.8308C24.946 19.2 23.67 21.8462 21.118 23.7692C18.6073 25.6462 15.448 26.5846 11.64 26H11.666Z" fill="black"/>
        <path d="M37.948 25.3333V0H46.282V25.3333H37.948Z" fill="black"/>
        <path d="M57.644 26C54.5327 26 51.8047 24.9692 49.46 22.9077C47.1567 20.8462 46.0047 18.1538 45.982 15.8308V0H54.316V15.8308C54.316 16.9231 54.688 17.8462 55.432 18.6C56.176 19.3154 57.026 19.6769 57.984 19.6769C58.924 19.6769 59.774 19.3154 60.528 18.5923C61.282 17.8231 61.654 16.9 61.654 15.8231V0H69.988V15.8308C69.988 19.2 68.712 21.8462 66.16 23.7692C63.6493 25.6462 60.49 26.5846 56.682 26H57.644Z" fill="black"/>
        <path d="M78 5.728L73.952 10.016L71.296 7.216L74.896 3.76L71.248 0.288L73.904 2.448e-05L78 4.288V5.728Z" fill="black"/>
        <path d="M78 12.016L73.952 16.304L71.296 13.504L74.896 10.048L71.248 6.576L73.904 6.288L78 10.576V12.016Z" fill="black"/>
    </svg>
);

export const GithubIcon: React.FC<IconProps> = ({ className }) => (
  <i className={`fa-brands fa-github ${className}`}></i>
);
