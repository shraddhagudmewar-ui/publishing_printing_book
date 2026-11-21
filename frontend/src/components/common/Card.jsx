import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = '',
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-white border border-[#A8B9C8] rounded-md shadow-sm overflow-hidden transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-[#48779E]' : ''
      } ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-[#A8B9C8]/40 flex items-center justify-between bg-slate-50/50">
          <div>
            {title && <h3 className="text-base font-semibold text-[#202020] tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-[#A8B9C8] mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
