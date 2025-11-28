import React, { useState } from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-lg shadow-gray-800/20",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
      <input 
        className={`w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Selection Card ---
interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  icon?: string | React.ReactNode;
  subtext?: string;
  layout?: 'col' | 'row';
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ selected, onClick, label, icon, subtext, layout = 'col' }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer rounded-2xl border-2 transition-all duration-200 
        ${layout === 'col' ? 'flex flex-col items-center justify-center text-center p-4 h-32' : 'flex items-center text-left p-4 h-auto'}
        ${selected 
          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md ring-1 ring-orange-500/50' 
          : 'border-transparent bg-white text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50'
        }
      `}
    >
      {icon && (
        <span className={`${layout === 'col' ? 'text-4xl mb-2' : 'text-3xl mr-4'}`}>
          {icon}
        </span>
      )}
      <div>
        <span className="font-bold text-sm sm:text-base block">{label}</span>
        {subtext && <span className="text-xs opacity-70 block mt-1">{subtext}</span>}
      </div>
    </div>
  );
};

// --- Image Selection Card (For Meal Type) ---
interface ImageCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  imageSrc: string;
  icon?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ selected, onClick, label, imageSrc, icon }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 h-32 group
        ${selected ? 'ring-4 ring-orange-500 transform scale-[1.02]' : 'hover:shadow-lg'}
      `}
    >
      {/* Background Image */}
      <img src={imageSrc} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black/40 transition-colors ${selected ? 'bg-orange-900/40' : 'group-hover:bg-black/50'}`}></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl mb-1 filter drop-shadow-md">{icon}</span>
        <span className="font-bold text-lg tracking-wide filter drop-shadow-md">{label}</span>
      </div>
    </div>
  );
};

// --- Star Rating ---
interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`text-2xl transition-transform ${!readonly && 'hover:scale-110 focus:outline-none'}`}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <span className={`${star <= (hover || rating) ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

// --- Header ---
interface HeaderProps {
  onBack?: () => void;
  title?: string;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack, title, onProfileClick }) => {
  return (
    <div className="flex items-center p-4 sticky top-0 bg-f3f4f6/90 backdrop-blur-md z-10 border-b border-white/50">
      {onBack ? (
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-white/80 text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      ) : (
        <div className="w-10"></div> // Spacer
      )}
      
      <h1 className="flex-1 text-center font-bold text-lg text-gray-800 tracking-tight">{title}</h1>
      
      {onProfileClick ? (
        <button 
          onClick={onProfileClick}
          className="p-2 -mr-2 rounded-full hover:bg-white/80 text-gray-700 transition-colors"
          aria-label="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      ) : (
        <div className="w-10"></div> // Spacer
      )}
    </div>
  );
};

// --- Layout Wrapper ---
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50/50 min-h-screen shadow-2xl relative flex flex-col">
        {children}
      </div>
    </div>
  );
};