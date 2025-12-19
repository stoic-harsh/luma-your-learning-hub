import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  Award, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import procdnaLogo from '@/assets/procdna-logo.png';
import { currentUser } from '@/data/mockData';
import { publicDecrypt } from 'crypto';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onOpenAIChat: () => void;
}

const navItems = [
  { to: '/dashboard', icon: Home, label: 'My Learning' },
  { to: '/courses', icon: BookOpen, label: 'Explore Courses' },
  { to: '/certifications', icon: Award, label: 'Certifications' },
  { to: '/team', icon: Users, label: 'Team Tracker', managerOnly: true },
  { to: '/organization', icon: Settings, label: 'Organization Overview', managerOnly: true },
];

const DashboardLayout = ({ children, onOpenAIChat }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNavItems = navItems.filter(
    item => !item.managerOnly || currentUser.role === 'manager' || currentUser.role === 'admin'
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img src={procdnaLogo} alt="ProcDNA" className="h-8 w-auto" />
          <span className="font-bold text-lg gradient-text">LUMA</span>
        </div>
        <Button variant="secondary" size="icon-sm" onClick={onOpenAIChat}>
          <Bot className="h-5 w-5" />
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50",
          collapsed ? "w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
              <img 
                src={procdnaLogo} 
                alt="ProcDNA" 
                className={cn("h-8 w-auto brightness-0 invert", collapsed && "h-6")} 
              />
              {!collapsed && <span className="font-bold text-lg">LUMA</span>}
            </div>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                  collapsed && "justify-center px-2"
                )}
                activeClassName="bg-sidebar-primary text-sidebar-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* AI Assistant Button */}
          <div className="px-3 pb-4">
            <Button
              variant="gradient"
              size={collapsed ? "icon" : "default"}
              className="w-full"
              onClick={() => {
                onOpenAIChat();
                setMobileMenuOpen(false);
              }}
            >
              <Bot className="h-5 w-5" />
              {!collapsed && <span>AI Assistant</span>}
            </Button>
          </div>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="h-10 w-10 rounded-full bg-sidebar-accent"
              />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">{currentUser.role}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" className="flex-1 text-sidebar-foreground/80 hover:bg-sidebar-accent">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-sidebar-foreground/80 hover:bg-sidebar-accent">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-16">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
