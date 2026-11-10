import React from 'react';

export type LogoVariant = 'main' | 'secondary' | 'icon' | 'monochrome' | 'social';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPayoff?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'main',
  className = '',
  size = 'md',
  showPayoff = true,
}) => {
  const isMonochrome = variant === 'monochrome';

  // Palette definitions
  const colors = {
    cacao: isMonochrome ? '#000000' : '#57382E',
    strawberry: isMonochrome ? '#333333' : '#F28BA6',
    peach: isMonochrome ? '#555555' : '#F5A16C',
    butter: isMonochrome ? '#CCCCCC' : '#FFE29A',
    mint: isMonochrome ? '#888888' : '#A8D8BD',
    white: '#FFFFFF',
    cream: isMonochrome ? '#F5F5F5' : '#FFF8EF',
  };

  // Icon symbol: Cute smiling golden brioche / sourdough loaf with baker's slash and sparkles
  const BakeryIcon = ({ iconSize = 44 }: { iconSize?: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:rotate-6 hover:scale-105"
    >
      {/* Background soft halo */}
      <circle cx="50" cy="50" r="46" fill={colors.butter} opacity={isMonochrome ? '0.3' : '0.45'} />
      <circle cx="50" cy="50" r="42" fill={colors.cream} />

      {/* Sourdough smiling bread / croissant puff */}
      <path
        d="M22 62C22 44.3269 34.536 30 50 30C65.464 30 78 44.3269 78 62C78 68.6274 72.6274 74 66 74H34C27.3726 74 22 68.6274 22 62Z"
        fill={colors.peach}
      />
      {/* Golden crust upper arch */}
      <path
        d="M24 58C25 43 36 32 50 32C64 32 75 43 76 58C71 54 62 52 50 52C38 52 29 54 24 58Z"
        fill={colors.butter}
      />

      {/* Artisan baker slash scores on crust */}
      <path d="M38 38C40 43 42 47 42 47" stroke={colors.cacao} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M50 35C50 41 50 46 50 46" stroke={colors.cacao} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M62 38C60 43 58 47 58 47" stroke={colors.cacao} strokeWidth="3.5" strokeLinecap="round" />

      {/* Sweet happy eyes */}
      <circle cx="41" cy="59" r="3" fill={colors.cacao} />
      <circle cx="59" cy="59" r="3" fill={colors.cacao} />
      {/* Cheerful rosy cheeks */}
      <circle cx="34" cy="64" r="4" fill={colors.strawberry} />
      <circle cx="66" cy="64" r="4" fill={colors.strawberry} />

      {/* Happy mouth smile */}
      <path
        d="M45 64C46.5 68 53.5 68 55 64"
        stroke={colors.cacao}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Baker's stylish small toque on top */}
      <path
        d="M44 26C44 23 46 21 50 21C54 21 56 23 56 26H44Z"
        fill={colors.strawberry}
      />
      {/* Floating magic bakery stars / aroma sparkle */}
      <path
        d="M78 28L80 23L85 25L81 29L83 34L78 31L74 34L75 29L71 26L76 24L78 28Z"
        fill={colors.strawberry}
        transform="scale(0.55) translate(40, 0)"
      />
      <circle cx="21" cy="38" r="2.5" fill={colors.mint} />
    </svg>
  );

  // Favicon / Minimal Icon
  if (variant === 'icon') {
    const iconDimension = size === 'sm' ? 32 : size === 'lg' ? 64 : size === 'xl' ? 84 : 44;
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <BakeryIcon iconSize={iconDimension} />
      </div>
    );
  }

  // Social profile square avatar
  if (variant === 'social') {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-3xl p-6 text-center shadow-lg ${className}`}
        style={{
          background: `radial-gradient(circle, ${colors.cream} 0%, #FEEFE6 100%)`,
          border: `3px solid ${colors.peach}`,
          width: '280px',
          height: '280px',
        }}
      >
        <BakeryIcon iconSize={110} />
        <span
          className="mt-3 text-2xl font-black tracking-wider"
          style={{ color: colors.cacao }}
        >
          SFORNAMÌ
        </span>
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.strawberry }}
        >
          Roma • Laboratorio Artigianale
        </span>
      </div>
    );
  }

  // Secondary compact horizontal layout (e.g. mobile sticky header)
  if (variant === 'secondary') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <BakeryIcon iconSize={36} />
        <div className="flex flex-col">
          <span
            className="text-xl font-black tracking-tight leading-none"
            style={{ color: colors.cacao }}
          >
            SFORNAM<span style={{ color: colors.strawberry }}>Ì</span>
          </span>
          <span
            className="text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: colors.peach }}
          >
            Roma
          </span>
        </div>
      </div>
    );
  }

  // Main full brand logo with icon, wordmark and payoff
  const scaleClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5',
  }[size];

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
  }[size];

  const iconSizes = {
    sm: 36,
    md: 46,
    lg: 58,
    xl: 72,
  }[size];

  return (
    <div className={`inline-flex items-center ${scaleClasses} ${className} select-none`}>
      <BakeryIcon iconSize={iconSizes} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className={`${titleSizes} font-black tracking-tight leading-tight transition-colors duration-200`}
            style={{ color: colors.cacao }}
          >
            SFORNAM<span style={{ color: colors.strawberry }}>Ì</span>
          </span>
          {!isMonochrome && (
            <span
              className="inline-block px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full tracking-wider shadow-xs"
              style={{ backgroundColor: colors.butter, color: colors.cacao }}
            >
              Roma
            </span>
          )}
        </div>
        {showPayoff && (
          <span
            className="text-[11px] md:text-xs font-medium tracking-tight -mt-0.5"
            style={{ color: colors.cacao, opacity: 0.85 }}
          >
            Il buono fatto a mano, con un pizzico di felicità.
          </span>
        )}
      </div>
    </div>
  );
};
