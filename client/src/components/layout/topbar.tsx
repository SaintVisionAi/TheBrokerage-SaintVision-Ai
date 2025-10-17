import { Star, Circle } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  plan: string;
  avatar: string;
}

interface SystemStatus {
  status?: string;
  uptime?: number;
}

interface TopBarProps {
  user: User;
  systemStatus?: SystemStatus;
}

export default function TopBar({ user, systemStatus }: TopBarProps) {
  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'text-purple-400 border-purple-500/20 bg-purple-500/10';
      case 'enterprise':
        return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      default:
        return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
    }
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Assistant Dashboard</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Circle className="w-3 h-3 text-emerald-500 fill-current" />
            <span>Vite Client Connected</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Plan Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-1 border rounded-lg ${getPlanColor(user.plan)}`}>
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{user.plan} Plan</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar}
              alt="User avatar" 
              className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20" 
            />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
