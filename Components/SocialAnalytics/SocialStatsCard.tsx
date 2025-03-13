"use client";


interface StatProps {
    label: string;
    value: number;
    icon?: string;
  }
  
  interface CardProps {
    title: string;
    stats: StatProps[];
    theme?: 'blue' | 'purple';
  }
  
  export default function SocialStatsCard({ title, stats, theme = 'blue' }: CardProps) {
    const themeClasses = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        title: 'text-blue-900',
        value: 'text-blue-600',
        label: 'text-blue-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        title: 'text-purple-900',
        value: 'text-purple-600',
        label: 'text-purple-600'
      }
    };
  
    const classes = themeClasses[theme];
  
    return (
      <div className={`${classes.bg} border ${classes.border} rounded-lg p-6 shadow-sm`}>
        <h3 className={`text-lg font-semibold ${classes.title} mb-4`}>
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <p className={`text-sm ${classes.label} mb-1`}>
                {label}
              </p>
              <p className={`text-2xl font-bold ${classes.value}`}>
                {value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }