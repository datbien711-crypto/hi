import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ServiceItem,
  DesignTemplate,
  OrderItem,
  WalletTransaction,
  NewsPost,
  AuditLog,
  UserRole,
  OrderStatus,
  OrderAttachment,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_TEMPLATES,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_NEWS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  services: ServiceItem[];
  templates: DesignTemplate[];
  orders: OrderItem[];
  transactions: WalletTransaction[];
  news: NewsPost[];
  auditLogs: AuditLog[];
  isDarkMode: boolean;
  activeTab: string;
  activeModal: string | null;
  selectedTemplate: DesignTemplate | null;
  selectedService: ServiceItem | null;
  selectedOrder: OrderItem | null;
  policyType: 'privacy' | 'terms' | 'refund' | null;
  favorites: string[];
  
  // Actions
  toggleDarkMode: () => void;
  setActiveTab: (tab: string) => void;
  setActiveModal: (modal: string | null) => void;
  setSelectedTemplate: (template: DesignTemplate | null) => void;
  setSelectedService: (service: ServiceItem | null) => void;
  setSelectedOrder: (order: OrderItem | null) => void;
  setPolicyType: (type: 'privacy' | 'terms' | 'refund' | null) => void;
  switchUserRole: (role: UserRole) => void;
  toggleFavorite: (templateId: string) => void;
  
  // Order actions
  placeOrder: (orderData: {
    serviceId: string;
    packageId: string;
    templateRefCode?: string;
    title: string;
    requirements: string;
    dimensions: string;
    colorPalette: string;
    designStyle: string;
    textContent: string;
    attachments: OrderAttachment[];
    isUrgent?: boolean;
  }) => { success: boolean; message: string; orderId?: string };
  
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignDesigner: (orderId: string, designerId: string) => void;
  submitOrderDraft: (orderId: string, fileUrl: string, note: string) => void;
  submitDeliverable: (orderId: string, deliverable: { fileName: string; fileType: string; fileSize: string; downloadUrl: string }) => void;
  requestOrderRevision: (orderId: string, note: string) => void;
  approveOrderCompleted: (orderId: string, rating: number, feedback: string) => void;
  sendOrderMessage: (orderId: string, content: string, attachmentUrl?: string) => void;
  
  // Wallet actions
  requestDeposit: (amount: number, method: 'vietqr' | 'bank_transfer') => { txCode: string; amount: number; bankContent: string };
  approveDeposit: (txId: string) => void;
  rejectDeposit: (txId: string, reason: string) => void;
  adjustUserBalance: (userId: string, amount: number, note: string) => void;
  
  // Admin management
  addTemplate: (template: Omit<DesignTemplate, 'id' | 'downloadsCount' | 'likesCount'>) => void;
  updateTemplate: (id: string, updates: Partial<DesignTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleUserStatus: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'inet24h_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or local storage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('inet24h_theme') === 'dark';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'refund' | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['tmpl_bn001', 'tmpl_lg001']);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem(`${STORAGE_KEY}_current_role`);
    const savedUsers = localStorage.getItem(`${STORAGE_KEY}_users`);
    const list: User[] = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    const found = list.find((u) => u.role === savedRole);
    return found || list[0]; // Default to customer
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [templates, setTemplates] = useState<DesignTemplate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_templates`);
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_txs`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [news] = useState<NewsPost[]>(INITIAL_NEWS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync dark mode class on HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('inet24h_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('inet24h_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_templates`, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_txs`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const switchUserRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(`${STORAGE_KEY}_current_role`, role);
    }
  };

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
  };

  // Place order
  const placeOrder = (data: {
    serviceId: string;
    packageId: string;
    templateRefCode?: string;
    title: string;
    requirements: string;
    dimensions: string;
    colorPalette: string;
    designStyle: string;
    textContent: string;
    attachments: OrderAttachment[];
    isUrgent?: boolean;
  }) => {
    const targetService = services.find((s) => s.id === data.serviceId);
    if (!targetService) return { success: false, message: 'Dịch vụ không tồn tại.' };

    const targetPkg = targetService.packages.find((p) => p.id === data.packageId);
    if (!targetPkg) return { success: false, message: 'Gói dịch vụ không hợp lệ.' };

    const basePrice = targetPkg.price;
    const urgentFee = data.isUrgent ? 50000 : 0;
    const totalPrice = basePrice + urgentFee;

    // Check customer balance
    if (currentUser.walletBalance < totalPrice) {
      return {
        success: false,
        message: `Số dư ví không đủ (${currentUser.walletBalance.toLocaleString('vi-VN')} đ). Cần thanh toán ${totalPrice.toLocaleString('vi-VN')} đ. Vui lòng nạp thêm tiền!`,
      };
    }

    const orderId = `ord_${Date.now()}`;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(100 + Math.random() * 900);
    const orderCode = `DH-${dateStr}-${randNum}`;

    const newOrder: OrderItem = {
      id: orderId,
      orderCode,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      serviceId: targetService.id,
      serviceName: targetService.title,
      packageId: targetPkg.id,
      packageName: targetPkg.name,
      templateRefCode: data.templateRefCode,
      title: data.title,
      requirements: data.requirements,
      dimensions: data.dimensions,
      colorPalette: data.colorPalette,
      designStyle: data.designStyle,
      textContent: data.textContent,
      attachments: data.attachments,
      price: totalPrice,
      isUrgent: data.isUrgent,
      urgentFee,
      status: 'pending_confirmation',
      createdAt: new Date().toLocaleString('vi-VN'),
      updatedAt: new Date().toLocaleString('vi-VN'),
      deadline: data.isUrgent ? 'Trong vòng 6 giờ' : targetPkg.turnaround,
      drafts: [],
      deliverables: [],
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderRole: 'customer',
          senderName: currentUser.name,
          content: `Khách hàng đã tạo đơn đặt thiết kế ${targetPkg.name} với giá trị ${totalPrice.toLocaleString('vi-VN')} đ.`,
          createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      revisionCount: 0,
      maxRevisions: typeof targetPkg.revisions === 'number' ? targetPkg.revisions : 99,
    };

    // Deduct wallet balance
    const updatedBalance = currentUser.walletBalance - totalPrice;
    const updatedUser = {
      ...currentUser,
      walletBalance: updatedBalance,
      totalSpent: currentUser.totalSpent + totalPrice,
    };

    // Record wallet transaction
    const txId = `tx_${Date.now()}`;
    const newTx: WalletTransaction = {
      id: txId,
      txCode: `TT-${dateStr}-${randNum}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'order_payment',
      amount: totalPrice,
      balanceBefore: currentUser.walletBalance,
      balanceAfter: updatedBalance,
      status: 'completed',
      method: 'wallet',
      description: `Thanh toán đơn thiết kế #${orderCode} (${targetService.title})`,
      referenceCode: `ORDER_${orderCode}`,
      createdAt: new Date().toLocaleString('vi-VN'),
      verifiedAt: new Date().toLocaleString('vi-VN'),
    };

    // Audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: 'system@inet24h.com',
      action: 'Tạo đơn hàng & Trừ ví',
      targetType: 'order',
      targetId: orderId,
      note: `Khách hàng ${currentUser.name} thanh toán ${totalPrice.toLocaleString('vi-VN')} đ cho đơn ${orderCode}`,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setOrders((prev) => [newOrder, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);
    setAuditLogs((prev) => [newLog, ...prev]);

    return { success: true, message: 'Đặt thiết kế thành công!', orderId };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            updatedAt: new Date().toLocaleString('vi-VN'),
            messages: note
              ? [
                  ...ord.messages,
                  {
                    id: `msg_${Date.now()}`,
                    senderRole: currentUser.role,
                    senderName: currentUser.name,
                    content: `[Cập nhật trạng thái]: ${note}`,
                    createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  },
                ]
              : ord.messages,
          };
        }
        return ord;
      })
    );
  };

  const assignDesigner = (orderId: string, designerId: string) => {
    const designer = users.find((u) => u.id === designerId);
    if (!designer) return;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            assignedDesignerId: designer.id,
            assignedDesignerName: designer.name,
            status: ord.status === 'pending_confirmation' ? 'designing' : ord.status,
            updatedAt: new Date().toLocaleString('vi-VN'),
            messages: [
              ...ord.messages,
              {
                id: `msg_${Date.now()}`,
                senderRole: 'admin',
                senderName: 'Quản trị viên',
                content: `Đơn hàng đã được phân công cho designer: ${designer.name}`,
                createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const submitOrderDraft = (orderId: string, fileUrl: string, note: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newDraft = {
            id: `draft_${Date.now()}`,
            version: ord.drafts.length + 1,
            url: fileUrl,
            note,
            createdAt: new Date().toLocaleString('vi-VN'),
          };
          return {
            ...ord,
            status: 'waiting_approval',
            drafts: [...ord.drafts, newDraft],
            updatedAt: new Date().toLocaleString('vi-VN'),
            messages: [
              ...ord.messages,
              {
                id: `msg_${Date.now()}`,
                senderRole: 'designer',
                senderName: currentUser.name,
                content: `Designer đã gửi bản demo V${newDraft.version}: ${note}`,
                attachmentUrl: fileUrl,
                createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const submitDeliverable = (
    orderId: string,
    deliverable: { fileName: string; fileType: string; fileSize: string; downloadUrl: string }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newDeliv = {
            id: `deliv_${Date.now()}`,
            ...deliverable,
            createdAt: new Date().toLocaleString('vi-VN'),
          };
          return {
            ...ord,
            deliverables: [...ord.deliverables, newDeliv],
            status: 'waiting_approval',
            updatedAt: new Date().toLocaleString('vi-VN'),
            messages: [
              ...ord.messages,
              {
                id: `msg_${Date.now()}`,
                senderRole: 'designer',
                senderName: currentUser.name,
                content: `Đã tải lên tệp hoàn chỉnh: ${deliverable.fileName} (${deliverable.fileSize})`,
                createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const requestOrderRevision = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'revision_requested',
            revisionCount: ord.revisionCount + 1,
            updatedAt: new Date().toLocaleString('vi-VN'),
            messages: [
              ...ord.messages,
              {
                id: `msg_${Date.now()}`,
                senderRole: 'customer',
                senderName: currentUser.name,
                content: `Yêu cầu chỉnh sửa lần ${ord.revisionCount + 1}: ${note}`,
                createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const approveOrderCompleted = (orderId: string, rating: number, feedback: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'completed',
            customerRating: rating,
            customerFeedback: feedback,
            updatedAt: new Date().toLocaleString('vi-VN'),
            messages: [
              ...ord.messages,
              {
                id: `msg_${Date.now()}`,
                senderRole: 'customer',
                senderName: currentUser.name,
                content: `Khách hàng đã phê duyệt bản thiết kế và đánh giá ${rating}⭐: "${feedback}"`,
                createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const sendOrderMessage = (orderId: string, content: string, attachmentUrl?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            messages: [
              ...ord.messages,
              {
                id: `msg_${Date.now()}`,
                senderRole: currentUser.role,
                senderName: currentUser.name,
                content,
                attachmentUrl,
                createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  // Wallet
  const requestDeposit = (amount: number, method: 'vietqr' | 'bank_transfer') => {
    const txId = `tx_${Date.now()}`;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(100 + Math.random() * 900);
    const txCode = `NAP-${dateStr}-${randNum}`;
    const bankContent = `INET24H CUST01 ${Math.floor(amount / 1000)}K`;

    const newTx: WalletTransaction = {
      id: txId,
      txCode,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'deposit',
      amount,
      balanceBefore: currentUser.walletBalance,
      balanceAfter: currentUser.walletBalance + amount,
      status: 'pending',
      method,
      description: `Yêu cầu nạp ${amount.toLocaleString('vi-VN')} đ qua ${method === 'vietqr' ? 'VietQR MB Bank' : 'Chuyển khoản'}`,
      referenceCode: bankContent,
      bankInfo: {
        bankName: 'MB Bank (Quân Đội)',
        accountNumber: '0987654321',
        accountName: 'CONG TY CP THIET KE INET24H',
        content: bankContent,
      },
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { txCode, amount, bankContent };
  };

  const approveDeposit = (txId: string) => {
    const targetTx = transactions.find((t) => t.id === txId);
    if (!targetTx || targetTx.status === 'completed') return;

    // Credit user balance
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetTx.userId) {
          const updatedBalance = u.walletBalance + targetTx.amount;
          if (currentUser.id === u.id) {
            setCurrentUser({ ...currentUser, walletBalance: updatedBalance });
          }
          return { ...u, walletBalance: updatedBalance };
        }
        return u;
      })
    );

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'completed', verifiedAt: new Date().toLocaleString('vi-VN') } : t))
    );

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Duyệt nạp tiền ví',
        targetType: 'transaction',
        targetId: txId,
        note: `Quản trị viên đã duyệt nạp ${targetTx.amount.toLocaleString('vi-VN')} đ cho người dùng ${targetTx.userName}`,
        createdAt: new Date().toLocaleString('vi-VN'),
      },
      ...prev,
    ]);
  };

  const rejectDeposit = (txId: string, reason: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'failed', adminNote: reason } : t))
    );

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Từ chối nạp tiền ví',
        targetType: 'transaction',
        targetId: txId,
        note: `Lý do từ chối: ${reason}`,
        createdAt: new Date().toLocaleString('vi-VN'),
      },
      ...prev,
    ]);
  };

  const adjustUserBalance = (userId: string, amount: number, note: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newBal = Math.max(0, u.walletBalance + amount);
          if (currentUser.id === u.id) {
            setCurrentUser({ ...currentUser, walletBalance: newBal });
          }
          return { ...u, walletBalance: newBal };
        }
        return u;
      })
    );

    const txId = `tx_${Date.now()}`;
    setTransactions((prev) => [
      {
        id: txId,
        txCode: `ADJ-${Date.now()}`,
        userId,
        userName: users.find((u) => u.id === userId)?.name || 'Người dùng',
        type: 'admin_adjust',
        amount,
        balanceBefore: users.find((u) => u.id === userId)?.walletBalance || 0,
        balanceAfter: (users.find((u) => u.id === userId)?.walletBalance || 0) + amount,
        status: 'completed',
        method: 'wallet',
        description: `Điều chỉnh số dư bởi Admin: ${note}`,
        referenceCode: `AUDIT_${txId}`,
        createdAt: new Date().toLocaleString('vi-VN'),
        verifiedAt: new Date().toLocaleString('vi-VN'),
        adminNote: note,
      },
      ...prev,
    ]);

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Điều chỉnh số dư ví',
        targetType: 'user',
        targetId: userId,
        note: `Thay đổi: ${amount > 0 ? '+' : ''}${amount.toLocaleString('vi-VN')} đ. Ghi chú: ${note}`,
        createdAt: new Date().toLocaleString('vi-VN'),
      },
      ...prev,
    ]);
  };

  // CRUD for templates
  const addTemplate = (data: Omit<DesignTemplate, 'id' | 'downloadsCount' | 'likesCount'>) => {
    const newTmpl: DesignTemplate = {
      ...data,
      id: `tmpl_${Date.now()}`,
      downloadsCount: 0,
      likesCount: 0,
    };
    setTemplates((prev) => [newTmpl, ...prev]);
  };

  const updateTemplate = (id: string, updates: Partial<DesignTemplate>) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // CRUD for services
  const addService = (data: Omit<ServiceItem, 'id'>) => {
    const newSrv: ServiceItem = {
      ...data,
      id: `srv_${Date.now()}`,
    };
    setServices((prev) => [...prev, newSrv]);
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        services,
        templates,
        orders,
        transactions,
        news,
        auditLogs,
        isDarkMode,
        activeTab,
        activeModal,
        selectedTemplate,
        selectedService,
        selectedOrder,
        policyType,
        favorites,
        toggleDarkMode,
        setActiveTab,
        setActiveModal,
        setSelectedTemplate,
        setSelectedService,
        setSelectedOrder,
        setPolicyType,
        switchUserRole,
        toggleFavorite,
        placeOrder,
        updateOrderStatus,
        assignDesigner,
        submitOrderDraft,
        submitDeliverable,
        requestOrderRevision,
        approveOrderCompleted,
        sendOrderMessage,
        requestDeposit,
        approveDeposit,
        rejectDeposit,
        adjustUserBalance,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addService,
        updateService,
        deleteService,
        toggleUserStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
