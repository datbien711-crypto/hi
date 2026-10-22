export type UserRole = 'customer' | 'designer' | 'admin' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
  totalSpent: number;
  createdAt: string;
  status: 'active' | 'blocked';
  notes?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  revisions: number | string;
  turnaround: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceItem {
  id: string;
  key: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  bannerImage: string;
  basePrice: number;
  turnaround: string;
  isPopular?: boolean;
  packages: ServicePackage[];
}

export interface DesignTemplate {
  id: string;
  code: string;
  title: string;
  category: 'Banner' | 'Logo' | 'Avatar' | 'Poster' | 'Menu' | 'Thumbnail' | 'Game' | 'Standee';
  dimensions: string;
  formats: string;
  priceRef: number;
  previewUrl: string;
  detailImages: string[];
  tags: string[];
  isFeatured?: boolean;
  downloadsCount: number;
  likesCount: number;
  description: string;
}

export type OrderStatus =
  | 'pending_confirmation'
  | 'pending_payment'
  | 'paid'
  | 'designing'
  | 'waiting_approval'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface OrderDraft {
  id: string;
  version: number;
  url: string;
  note: string;
  createdAt: string;
}

export interface OrderDeliverable {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  createdAt: string;
}

export interface OrderMessage {
  id: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  createdAt: string;
  attachmentUrl?: string;
}

export interface OrderAttachment {
  name: string;
  url: string;
  size?: string;
}

export interface OrderItem {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  templateRefCode?: string;
  title: string;
  requirements: string;
  dimensions: string;
  colorPalette: string;
  designStyle: string;
  textContent: string;
  attachments: OrderAttachment[];
  price: number;
  isUrgent?: boolean;
  urgentFee?: number;
  status: OrderStatus;
  assignedDesignerId?: string;
  assignedDesignerName?: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  drafts: OrderDraft[];
  deliverables: OrderDeliverable[];
  messages: OrderMessage[];
  revisionCount: number;
  maxRevisions: number;
  customerRating?: number;
  customerFeedback?: string;
}

export type TransactionType = 'deposit' | 'order_payment' | 'refund' | 'admin_adjust';
export type TransactionStatus = 'pending' | 'verifying' | 'completed' | 'failed' | 'cancelled';

export interface WalletTransaction {
  id: string;
  txCode: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  method: 'vietqr' | 'bank_transfer' | 'momo' | 'wallet';
  description: string;
  proofImage?: string;
  referenceCode: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    content: string;
  };
  createdAt: string;
  verifiedAt?: string;
  adminNote?: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetType: 'order' | 'transaction' | 'user' | 'service' | 'template' | 'setting';
  targetId: string;
  note: string;
  createdAt: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  thumbnail: string;
  tags: string[];
  views: number;
}
