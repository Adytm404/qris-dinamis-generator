import React from 'react';
import { ChevronLeftIcon, GithubIcon } from './icons';

interface HeaderProps {
    title: string;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-200">
      {onBack ? (
         <button onClick={onBack} className="p-2 text-zinc-600 hover:text-zinc-900">
            <ChevronLeftIcon />
         </button>
      ) : (
        <div className="w-9 h-9"></div> // Placeholder for spacing
      )}
      <h1 className="text-lg font-semibold text-zinc-800">{title}</h1>
      {onBack ? (
         <div className="w-9 h-9"></div> // Placeholder for spacing
      ) : (
        <a 
          href="https://github.com/dika-wahyudi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-zinc-600 hover:text-zinc-900"
          aria-label="GitHub Repository"
        >
            <GithubIcon className="text-2xl" />
        </a>
      )}
    </header>
  );
};
