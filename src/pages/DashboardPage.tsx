import { FileSliders, Smartphone, Users, History } from 'lucide-react';
import { MaterialCard } from '../components/ui/material-card';
import { MaterialButton } from '../components/ui/material-button';
import { Link } from 'react-router-dom';

const statsCards = [
  {
    title: 'Categorias Ativas',
    value: '12',
    icon: FileSliders,
    color: 'bg-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Dispositivos',
    value: '28',
    icon: Smartphone,
    color: 'bg-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Operadores Ativos',
    value: '15',
    icon: Users,
    color: 'bg-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    title: 'Etapas Configuradas',
    value: '34',
    icon: History,
    color: 'bg-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const quickActions = [
  { name: 'Nova Categoria', path: '/categoria-chamado' },
  { name: 'Novo Dispositivo', path: '/dispositivo' },
  { name: 'Novo Operador', path: '/operador' },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão hospitalar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <MaterialCard key={index} hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </MaterialCard>
          );
        })}
      </div>

      {/* Quick Actions */}
      <MaterialCard className="p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <MaterialButton
                variant="outline"
                className="w-full justify-start"
                elevated={false}
              >
                <span className="mr-2">+</span>
                {action.name}
              </MaterialButton>
            </Link>
          ))}
        </div>
      </MaterialCard>
    </div>
  );
}
