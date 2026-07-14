import { FileText, LayoutDashboard, BarChart3, Upload, Users, Settings, GitCompare, type LucideIcon } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  candidateCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'upload', label: 'Upload Resumes', icon: Upload },
    ],
  },
  {
    label: 'Review',
    items: [
      { id: 'candidates', label: 'Candidates', icon: Users, badge: true },
      { id: 'compare', label: 'Compare', icon: GitCompare },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
];

export default function Sidebar({ activeView, onViewChange, candidateCount }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] glass-sidebar flex flex-col z-50">
      <div className="px-4 py-5">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}
          >
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="text-[13px] font-semibold text-white tracking-tight">CVInsight</h1>
            <p className="text-[9px] text-slate-600 font-medium tracking-wider uppercase">Screening Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 space-y-6 overflow-y-auto">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="section-label px-3 mb-2">{section.label}</p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-blue-400'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                      boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                    } : undefined}
                  >
                    <Icon className="w-[15px] h-[15px] flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && candidateCount > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' }}
                      >
                        {candidateCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2.5 py-3 border-t border-white/[0.04]">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-200 ${
            activeView === 'settings'
              ? 'text-blue-400'
              : 'text-slate-600 hover:text-slate-400'
          }`}
          style={activeView === 'settings' ? {
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.15)',
          } : undefined}
        >
          <Settings className="w-[15px] h-[15px] flex-shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
