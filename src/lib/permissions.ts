import { UserRole } from '@/types';

// ----------------------------------------------------------
// PERMISSION HELPERS
// All authorization decisions flow through these helpers.
// Backend enforces real security; this is UX-level access control.
// ----------------------------------------------------------

export function canViewAllShipments(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewShipment(role: UserRole): boolean {
  return role !== 'public';
}

export function canRegisterShipment(role: UserRole): boolean {
  return role === 'admin' || role === 'manufacturer';
}

export function canTransferCustody(role: UserRole): boolean {
  return (
    role === 'admin' ||
    role === 'manufacturer' ||
    role === 'transporter' ||
    role === 'distributor'
  );
}

export function canAcceptCustody(role: UserRole): boolean {
  return (
    role === 'transporter' ||
    role === 'distributor' ||
    role === 'retailer' ||
    role === 'admin'
  );
}

export function canGenerateReport(role: UserRole): boolean {
  return role === 'admin' || role === 'distributor' || role === 'retailer';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewAdminSettings(role: UserRole): boolean {
  return role === 'admin';
}

export function canAcknowledgeAlert(role: UserRole): boolean {
  return role !== 'public';
}

export function canInvestigateBreach(role: UserRole): boolean {
  return role === 'admin' || role === 'distributor';
}

export function canVerifyShipment(_role: UserRole): boolean {
  // Public verification is open to all — the /verify route handles no-auth
  return true;
}

export function canViewReports(role: UserRole): boolean {
  return (
    role === 'admin' ||
    role === 'manufacturer' ||
    role === 'distributor' ||
    role === 'retailer'
  );
}

export function canViewBlockchainProof(role: UserRole): boolean {
  return role !== 'public';
}

// ----------------------------------------------------------
// SHIPMENT VISIBILITY — which custodians can see which status
// ----------------------------------------------------------

export function getVisibleShipmentStatuses(role: UserRole) {
  switch (role) {
    case 'admin':
      return ['registered', 'in_transit', 'at_distributor', 'delivered', 'on_hold', 'recalled'];
    case 'manufacturer':
      return ['registered', 'in_transit', 'at_distributor', 'delivered', 'on_hold', 'recalled'];
    case 'transporter':
      return ['in_transit', 'on_hold'];
    case 'distributor':
      return ['in_transit', 'at_distributor', 'on_hold'];
    case 'retailer':
      return ['at_distributor', 'delivered'];
    default:
      return [];
  }
}

// ----------------------------------------------------------
// NAVIGATION FILTER
// ----------------------------------------------------------

export function getNavigationForRole(role: UserRole) {
  const allItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Shipments', href: '/shipments', icon: 'Package' },
    { label: 'Alerts', href: '/alerts', icon: 'Bell' },
    { label: 'Custody', href: '/custody', icon: 'GitBranch' },
    { label: 'Reports', href: '/reports', icon: 'FileText', restricted: !canViewReports(role) },
    { label: 'Users', href: '/admin/users', icon: 'Users', restricted: !canManageUsers(role) },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings', restricted: !canViewAdminSettings(role) },
  ];
  return allItems.filter((item) => !item.restricted);
}
