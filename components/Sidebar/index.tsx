import React, { useState } from 'react';
import { Settings, FileText, CheckSquare, Users, Grid } from 'lucide-react';
import Link from 'next/link';

interface TeamItem {
  label: string;
  color: string;
  route: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const menuItems: MenuItem[] = [
    {
      icon: <Grid size={20} className="text-blue-500" />,
      label: "Project List",
      route: "/",
    },
    {
      icon: <Users size={20} />,
      label: "Teams",
      route: "/teams",
    },
    {
      icon: <CheckSquare size={20} />,
      label: "Tasks",
      route: "/tasks",
    },
    {
      icon: <FileText size={20} />,
      label: "Reports",
      route: "/reports",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      route: "/settings",
    },
  ];

  const teamItems: TeamItem[] = [
    {
      label: "Development",
      color: "bg-purple-500",
      route:'/development'
    },
    {
      label: "Design",
      color: "bg-pink-500",
      route:'/design'
    },
    {
      label: "Marketing",
      color: "bg-orange-500",
      route:'/marketing'
    },
  ];

  const toggleSidebar = (): void => setIsOpen(!isOpen);

  return (
    <div className="h-screen bg-gray-50 border-r border-gray-200 w-60 flex flex-col">
      {/* Main menu items */}
      <div className="flex flex-col p-4 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.route}
            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Teams section */}
      <div className="mt-6 px-4">
        <div className="text-xs font-semibold text-gray-500 mb-3">TEAMS</div>
        <div className="flex flex-col gap-3">
          {teamItems.map((team) => (
            <Link
              key={team.label}
              href={team.route}
              className="flex items-center gap-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3"
            >
              <span className={`h-2 w-2 rounded-full ${team.color}`}></span>
              <span>{team.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;