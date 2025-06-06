import React from 'react';
import Card from '../shared/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changePercent?: number;
  changeLabel?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  changePercent,
  changeLabel,
  color = 'bg-primary-500',
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex items-center">
        <div className={`${color} p-4 rounded-lg text-white`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          
          {changePercent !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {changePercent >= 0 ? '+' : ''}{changePercent}%
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-500 ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;