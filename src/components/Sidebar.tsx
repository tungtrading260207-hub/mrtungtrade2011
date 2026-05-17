
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigationItems = [
    "Tổng quan thị trường",
    "Dấu vết On-chain (Crypto Algorithmic)",
    "Tiêu chí Vĩ mô (VN-Stock Intensive)",
    "Bộ lọc Kèo Vàng",
    "Kho Pine Script Hub",
    "Cấu hình API Hệ thống",
    "Giám sát & Tự bảo dưỡng",
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8 neon-glow-white">
        MrTungtrade2011
      </div>
      <nav className="flex-1">
        <ul>
          {navigationItems.map((item) => (
            <li key={item} className="mb-2">
              <button
                onClick={() => onTabChange(item)}
                className={`w-full text-left p-2 rounded-md transition-colors
                  ${activeTab === item
                    ? "bg-sidebar-primary text-sidebar-primary-foreground neon-glow-blue"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
