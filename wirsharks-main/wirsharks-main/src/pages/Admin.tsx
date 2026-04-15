import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, BookOpen, Gamepad2, Settings } from 'lucide-react';

export default function Admin() {
  const { profile, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-sleek-muted">Loading...</div>;
  
  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-sleek-muted">Manage platform content and users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { title: 'Total Users', value: '1,234', icon: Users, color: 'text-sleek-cyan' },
          { title: 'Active Courses', value: '12', icon: BookOpen, color: 'text-sleek-green' },
          { title: 'Mini-Games', value: '4', icon: Gamepad2, color: 'text-sleek-purple' },
          { title: 'System Status', value: 'Healthy', icon: Settings, color: 'text-sleek-muted' },
        ].map((stat, i) => (
          <div key={i} className="bg-sleek-card border border-sleek-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-sleek-muted">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="bg-sleek-card border border-sleek-border rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-sleek-border">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-black/20 border border-sleek-border hover:border-sleek-purple/50 text-white p-6 rounded-2xl text-left transition-colors">
            <div className="font-bold mb-1">Add New Course</div>
            <div className="text-sm text-sleek-muted">Create a new learning module</div>
          </button>
          <button className="bg-black/20 border border-sleek-border hover:border-sleek-purple/50 text-white p-6 rounded-2xl text-left transition-colors">
            <div className="font-bold mb-1">Manage Users</div>
            <div className="text-sm text-sleek-muted">View and edit user profiles</div>
          </button>
          <button className="bg-black/20 border border-sleek-border hover:border-sleek-purple/50 text-white p-6 rounded-2xl text-left transition-colors">
            <div className="font-bold mb-1">View Analytics</div>
            <div className="text-sm text-sleek-muted">Platform usage statistics</div>
          </button>
        </div>
      </div>
    </div>
  );
}
