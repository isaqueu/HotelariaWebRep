import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Função para renderizar emojis como componente
const EmojiIcon = ({ emoji }: { emoji: string }) => (
  <span className="text-lg">{emoji}</span>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: any;
  color: string;
  children?: MenuItem[];
}

interface MenuGroup {
  name: string;
  icon: any;
  color: string;
  items: MenuItem[];
}

const menuStructure: MenuGroup[] = [
  {
    name: "Dashboard",
    icon: () => <EmojiIcon emoji="📊" />,
    color: "bg-blue-500",
    items: [],
  },
  {
    name: "Configurações",
    icon: () => <EmojiIcon emoji="⚙️" />,
    color: "bg-emerald-500",
    items: [
      {
        name: "Categorias de Chamado",
        path: "/categoria-chamado",
        icon: () => <EmojiIcon emoji="🏷️" />,
        color: "bg-emerald-400",
      },
      {
        name: "Dispositivos",
        path: "/dispositivos",
        icon: () => <EmojiIcon emoji="📱" />,
        color: "bg-emerald-400",
      },
      { 
        name: "Etapas de Processo", 
        path: "/etapas", 
        icon: () => <EmojiIcon emoji="🔄" />, 
        color: "bg-emerald-400" 
      },
      {
        name: "Checklist Hospitalar",
        icon: () => <EmojiIcon emoji="📋" />,
        color: "bg-teal-500",
        children: [
          {
            name: "Itens do Leito",
            path: "/item-leito",
            icon: () => <EmojiIcon emoji="🛏️" />,
            color: "bg-teal-400",
          },
          {
            name: "Localização",
            path: "/item-local",
            icon: () => <EmojiIcon emoji="📍" />,
            color: "bg-teal-400",
          },
        ],
      },
      {
        name: "Tipos de Limpeza",
        path: "/tipo-limpeza",
        icon: () => <EmojiIcon emoji="🧽" />,
        color: "bg-cyan-500",
      },
      {
        name: "Gestão de Pessoas",
        icon: () => <EmojiIcon emoji="👥" />,
        color: "bg-purple-500",
        children: [
          {
            name: "Operadores",
            path: "/operador",
            icon: () => <EmojiIcon emoji="👨‍⚕️" />,
            color: "bg-purple-400",
          },
          {
            name: "Tipos de Operador",
            path: "/tipo-operador",
            icon: () => <EmojiIcon emoji="👔" />,
            color: "bg-purple-400",
          },
          {
            name: "Níveis de Acesso",
            path: "/tipo-acesso",
            icon: () => <EmojiIcon emoji="🔒" />,
            color: "bg-purple-300",
          },
        ],
      },
      {
        name: "Controle de Erros QR",
        path: "/status-erro-qrcode",
        icon: () => <EmojiIcon emoji="📱" />,
        color: "bg-red-500",
      },
    ],
  },
];

/**
 * SIDEBAR COMPONENT - REGRAS E FUNCIONAMENTO
 *
 * HIERARQUIA DE MENU:
 * 1. Grupos principais (Dashboard, Gestão, etc.)
 * 2. Itens secundários (dentro dos grupos)
 * 3. Sub-itens (filhos dos itens secundários)
 *
 * REGRAS DE ATIVAÇÃO:
 * - Dashboard: fica ativo apenas quando na rota "/"
 * - Grupos: ficam azuis APENAS quando uma página filha está renderizada
 * - Expandir grupo NÃO ativa o estado azul do grupo pai
 * - Itens pais só ficam azuis se um item filho tem página ativa
 *
 * COMPORTAMENTO DE EXPANSÃO:
 * - Clicar no grupo expande/colapsa os itens
 * - Estado de expansão independe do estado ativo
 * - Mobile: menu fecha automaticamente ao navegar
 *
 * ESTILIZAÇÃO:
 * - Background: gradiente suave (slate) harmonioso com área principal
 * - Itens ativos: azul com sombra e escala
 * - Hover: efeitos suaves de escala e sombra
 * - Ícones: diferentes cores baseadas no estado ativo
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const sidebarRef = useRef<HTMLDivElement>(null);

  /**
   * FUNÇÃO DE BUSCA DE HIERARQUIA
   * - Localiza grupo e item baseado no path da URL atual
   * - Suporta até 3 níveis: grupo > item > subitem
   * - Usado para auto-expansão do menu na página atual
   */
  const findGroupAndItemForPath = (path: string) => {
    for (const group of menuStructure) {
      for (const item of group.items) {
        if (item.path === path) {
          return { groupName: group.name, itemName: item.name };
        }
        if (item.children) {
          for (const subItem of item.children) {
            if (subItem.path === path) {
              return {
                groupName: group.name,
                itemName: item.name,
                subItemName: subItem.name,
              };
            }
          }
        }
      }
    }
    return null;
  };

  /**
   * AUTO-EXPANSÃO BASEADA NA ROTA ATUAL
   * - Dashboard: todos os grupos ficam fechados
   * - Outras páginas: expande automaticamente o grupo/item da página atual
   * - Mantém a hierarquia visível até o item ativo
   */
  useEffect(() => {
    if (location.pathname && location.pathname !== "/") {
      const pathInfo = findGroupAndItemForPath(location.pathname);
      if (pathInfo) {
        const groupsToExpand = new Set<string>();
        groupsToExpand.add(pathInfo.groupName);

        // Se for um subitem, também expande o item pai
        if (pathInfo.subItemName) {
          groupsToExpand.add(`${pathInfo.groupName}-${pathInfo.itemName}`);
        }

        setExpandedGroups(groupsToExpand);
      }
    } else {
      // Se for a página inicial (dashboard), fecha todos os grupos
      setExpandedGroups(new Set());
    }
  }, [location.pathname]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set();
      // Se o grupo já está expandido, fecha tudo (comportamento accordion)
      if (!prev.has(groupName)) {
        // Se não estava expandido, abre apenas este grupo
        newSet.add(groupName);
        // Se for um subgrupo, mantém o grupo pai aberto também
        if (groupName.includes("-")) {
          const parentGroup = groupName.split("-")[0];
          newSet.add(parentGroup);
        }
      }
      // Se estava expandido, newSet fica vazio (fecha tudo)
      return newSet;
    });
  };

  // Função para garantir que todos os itens expandidos sejam visíveis
  useEffect(() => {
    if (sidebarRef.current && expandedGroups.size > 0) {
      setTimeout(() => {
        const expandedContainer = sidebarRef.current?.querySelector(
          '[data-expanded="true"]:last-child',
        );
        if (expandedContainer) {
          expandedContainer.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }, 300); // Aguarda a animação de expansão
    }
  }, [expandedGroups]);

  /**
   * FUNÇÕES DE VERIFICAÇÃO DE ESTADO ATIVO
   */
  const isItemActive = (path: string) => location.pathname === path;

  /**
   * Verifica se algum item do grupo está ativo
   * - Percorre recursivamente todos os níveis
   * - Usado para determinar estado ativo dos grupos pais
   */
  const isGroupActive = (items: MenuItem[]): boolean => {
    return items.some((item) => {
      if (item.path && location.pathname === item.path) return true;
      if (item.children) return isGroupActive(item.children);
      return false;
    });
  };

  /**
   * FUNÇÃO DE VERIFICAÇÃO DE HIERARQUIA ATIVA
   * - Determina se um elemento está na hierarquia da página atual
   * - Usado para aplicar estilos visuais corretos
   * - Fundamental para a lógica de ativação correta do menu
   */
  const isInActiveHierarchy = (
    groupName: string,
    itemName?: string,
    subItemName?: string,
  ): boolean => {
    if (location.pathname === "/dashboard" && groupName === "Dashboard") return true;

    for (const group of menuStructure) {
      if (group.name === "Cadastro") {
        for (const item of group.items) {
          if (item.path && location.pathname === item.path) {
            if (groupName === "Cadastro" && !itemName) return true;
            if (groupName === "Cadastro" && itemName === item.name) return true;
            return false;
          }
          if (item.children) {
            for (const child of item.children) {
              if (child.path && location.pathname === child.path) {
                if (groupName === "Cadastro" && !itemName) return true;
                if (
                  groupName === "Cadastro" &&
                  itemName === item.name &&
                  !subItemName
                )
                  return true;
                if (
                  groupName === "Cadastro" &&
                  itemName === item.name &&
                  subItemName === child.name
                )
                  return true;
                return false;
              }
            }
          }
        }
      }
    }
    return false;
  };

  /**
   * FUNÇÃO DE COR DOS ÍCONES BASEADA NA HIERARQUIA
   * - Aplica cores diferentes baseadas no estado ativo
   * - Simplificada para usar mesmo tom azul em todos os casos
   * - Pode ser expandida futuramente para mais variações
   */
  const getIconColor = (
    groupName: string,
    itemName?: string,
    subItemName?: string,
    originalColor?: string,
  ): string => {
    // Todos os ícones agora usam fundo branco
    return "bg-white";
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed lg:relative z-50 sidebar-gradient shadow-xl w-72 min-h-screen transition-transform duration-300",
          "transform lg:transform-none border-r border-blue-200 flex flex-col overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 pt-6 px-6"></div>

        {/* 
          SEÇÃO DE NAVEGAÇÃO PRINCIPAL
          - Renderiza todos os grupos e itens do menu
          - Aplica lógica de ativação correta (apenas quando página está renderizada)
          - Suporte completo para mobile e desktop
        */}
        <div className="flex-1 px-6 pb-6">
          <nav className="space-y-2">
            {menuStructure.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = expandedGroups.has(group.name);
              const hasActiveItem = isGroupActive(group.items);
              const isInHierarchy = isInActiveHierarchy(group.name);
              // REGRA CRÍTICA: hasActiveChild verifica se alguma página filha está REALMENTE ativa
              const hasActiveChild = group.items.some((item) => {
                if (item.path && location.pathname === item.path) return true;
                if (item.children) {
                  return item.children.some((child) => child.path === location.pathname);
                }
                return false;
              });

              // Dashboard é tratado como item individual
              if (group.items.length === 0) {
                const isActive = location.pathname === "/dashboard";
                return (
                  <Link key={group.name} to="/dashboard">
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                        "hover:shadow-lg hover:scale-105 transform",
                        isActive
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 border-2 p-2",
                          isActive ? "bg-white/20 border-white/60" : "bg-white border-gray-400",
                        )}
                      >
                        <GroupIcon />
                      </div>
                      <span className="font-semibold text-base">
                        {group.name}
                      </span>
                    </div>
                  </Link>
                );
              }

              return (
                <div key={group.name} className="space-y-1">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group",
                      "hover:shadow-lg hover:scale-105 transform",
                      hasActiveChild
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 border-2 p-2",
                        hasActiveChild ? "shadow-md scale-110" : "",
                        hasActiveChild ? "bg-white border-blue-400" : "bg-white border-gray-400",
                      )}
                    >
                      <GroupIcon />
                    </div>
                    <span className="font-semibold text-base flex-1 text-left">
                      {group.name}
                    </span>
                    <div
                      className={cn(
                        "transition-transform duration-300",
                        isExpanded ? "rotate-90" : "",
                      )}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Group Items */}
                  <div
                    className={cn(
                      "ml-4 pl-4 border-l-2 border-blue-300 space-y-1 transition-all duration-300",
                      isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden",
                    )}
                  >
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isItemInHierarchy = isInActiveHierarchy(
                        group.name,
                        item.name,
                      );

                      // If item has children, render as expandable
                      if (item.children) {
                        const hasActiveChild =
                          item.children?.some(
                            (child) => child.path === location.pathname,
                          ) || false;
                        const isItemExpanded = expandedGroups.has(
                          `${group.name}-${item.name}`,
                        );

                        return (
                          <div key={item.name} className="space-y-1">
                            <button
                              onClick={() =>
                                toggleGroup(`${group.name}-${item.name}`)
                              }
                              className={cn(
                                "w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 group relative",
                                "hover:shadow-lg hover:scale-105 transform",
                                hasActiveChild
                                  ? "bg-blue-500 text-white shadow-sm"
                                  : "text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                              )}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all duration-300 border-2 p-1.5",
                                  hasActiveChild ? "shadow-sm scale-110" : "",
                                  hasActiveChild
                                    ? "bg-white border-blue-400"
                                    : "bg-white border-gray-400",
                                )}
                              >
                                <ItemIcon />
                              </div>
                              <span className="text-sm font-medium flex-1 text-left">
                                {item.name}
                              </span>
                              <div
                                className={cn(
                                  "transition-transform duration-300",
                                  isItemExpanded ? "rotate-90" : "",
                                )}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </div>
                            </button>

                            {/* Sub Items */}
                            <div
                              className={cn(
                                "ml-6 pl-4 border-l-2 border-slate-100 space-y-1 transition-all duration-300",
                                isItemExpanded
                                  ? "max-h-96 opacity-100"
                                  : "max-h-0 opacity-0 overflow-hidden",
                              )}
                            >
                              {item.children.map((subItem) => {
                                const SubItemIcon = subItem.icon;
                                const isActive = isItemActive(subItem.path!);
                                const isSubItemInHierarchy =
                                  isInActiveHierarchy(
                                    group.name,
                                    item.name,
                                    subItem.name,
                                  );

                                return (
                                  <Link key={subItem.path} to={subItem.path!}>
                                    <div
                                      className={cn(
                                        "flex items-center px-3 py-2 rounded-lg transition-all duration-300 group relative cursor-pointer",
                                        "hover:shadow-lg hover:scale-105 transform",
                                        isActive
                                          ? "bg-blue-500 text-white shadow-md scale-102 border-l-4 border-blue-600"
                                          : "text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                                      )}
                                      onClick={() => {
                                        if (window.innerWidth < 1024) {
                                          onClose();
                                        }
                                      }}
                                    >
                                      <div
                                        className={cn(
                                          "w-7 h-7 rounded-full flex items-center justify-center mr-3 transition-all duration-300 border-2 p-1",
                                          isActive ? "shadow-sm scale-110" : "",
                                          isActive ? "bg-white border-blue-400" : "bg-white border-gray-400",
                                        )}
                                      >
                                        <SubItemIcon />
                                      </div>
                                      <span className="text-sm font-medium">
                                        {subItem.name}
                                      </span>
                                      {isActive && (
                                        <div className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Regular item without children
                      const isActive = isItemActive(item.path!);

                      return (
                        <Link key={item.path} to={item.path!}>
                          <div
                            className={cn(
                              "flex items-center px-3 py-2 rounded-lg transition-all duration-300 group relative cursor-pointer",
                              "hover:shadow-lg hover:scale-105 transform",
                              isActive
                                ? "bg-blue-500 text-white shadow-md scale-102 border-l-4 border-blue-600"
                                : "text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                            )}
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                onClose();
                              }
                            }}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all duration-300 border-2 p-1.5",
                                isActive ? "shadow-sm scale-110" : "",
                                isActive ? "bg-white border-blue-400" : "bg-white border-gray-400",
                              )}
                            >
                              <ItemIcon />
                            </div>
                            <span className="text-sm font-medium">
                              {item.name}
                            </span>
                            {isActive && (
                              <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}