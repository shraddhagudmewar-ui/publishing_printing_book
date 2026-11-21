import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ items = [], title = 'Workspace' }) => {
  return (
    <aside className="w-64 bg-white border-r border-[#A8B9C8] min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between shrink-0 shadow-xs">
      <div className="space-y-6">
        <div className="px-3 py-2 border-b border-[#A8B9C8]/40">
          <h2 className="text-xs uppercase font-bold text-[#A8B9C8] tracking-widest">{title}</h2>
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#48779E] text-white shadow-xs'
                      : 'text-[#202020] hover:bg-[#EAF1F7] hover:text-[#48779E]'
                  }`
                }
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-slate-100 text-[#202020] px-2 py-0.5 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-[#EAF1F7] rounded-md border border-[#A8B9C8]/50 text-xs">
        <p className="font-semibold text-[#202020]">KA Publishing Hub</p>
        <p className="text-[#202020]/70 mt-0.5 text-[11px]">System Status: Connected</p>
      </div>
    </aside>
  );
};

export default Sidebar;
