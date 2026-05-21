// ─────────────────────────────────────────────
// SERVICE – Dashboard
// Base URL : http://localhost:8080 (api-gateway)
// Toutes les routes sont documentées dans
// FitTech Sprint02 Status Report
// ─────────────────────────────────────────────
import axiosInstance from "./axiosInstance";

// ══════════════════════════════════════════════
// TYPES – correspondent aux modèles du backend
// ══════════════════════════════════════════════

export interface Member {
  id: string;
  firstName: string;
  secondName: string;
  gender: "MALE" | "FEMALE";
  subscriptionAmount?: number;
  subscriptionStatus?: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface FreeTrial {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  used: boolean;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;       // page courante
  size: number;
  hasMore: boolean;
}

// ══════════════════════════════════════════════
// 1. MEMBERSHIPS CARD
//    → Total membres
//    GET /users/members?page=0&size=1
//    Accès : ADMIN, SUPER_ADMIN
// ══════════════════════════════════════════════
export async function getTotalMembers(): Promise<number> {
  const res = await axiosInstance.get<PagedResponse<Member>>(
    "/users/members",
    { params: { page: 0, size: 1 } }
  );
  return res.data.totalElements;
}

// ══════════════════════════════════════════════
// 2. MEMBERSHIPS CHART
//    → Répartition hommes / femmes
//    GET /users/members?page=0&size=1000
//    On compte gender=MALE et gender=FEMALE
//    Accès : ADMIN, SUPER_ADMIN
// ══════════════════════════════════════════════
export async function getMembershipStats() {
  const res = await axiosInstance.get<PagedResponse<Member>>(
    "/users/members",
    { params: { page: 0, size: 1000 } }
  );

  const members = res.data.content;

  // Groupe par mois de création
  const byMonth: Record<string, { men: number; women: number }> = {};

  members.forEach((m) => {
    const month = new Date(m.createdAt).toLocaleString("fr-FR", { month: "2-digit" });
    if (!byMonth[month]) byMonth[month] = { men: 0, women: 0 };
    if (m.gender === "MALE")   byMonth[month].men++;
    if (m.gender === "FEMALE") byMonth[month].women++;
  });

  return Object.entries(byMonth).map(([month, counts]) => ({
    month,
    men: counts.men,
    women: counts.women,
  }));
}

// ══════════════════════════════════════════════
// 3. LAST PAYMENTS CARD
//    → 4 derniers membres inscrits
//    GET /users/members?page=0&size=4
//    Accès : ADMIN, SUPER_ADMIN
// ══════════════════════════════════════════════
export async function getLastPayments() {
  const res = await axiosInstance.get<PagedResponse<Member>>(
    "/users/members",
    { params: { page: 0, size: 4 } }
  );

  return res.data.content.map((m) => ({
    id: m.id,
    name: `${m.secondName} ${m.firstName}`,
    amount: m.subscriptionAmount ?? 0,
    // Initiales pour l'Avatar
    avatar: `${m.secondName[0]}${m.firstName[0]}`.toUpperCase(),
  }));
}

// ══════════════════════════════════════════════
// 4. FREE TRIALS COUNT
//    → Nombre de trials non utilisés
//    GET /users/trials?used=false&page=0&size=1
//    Accès : ADMIN, SUPER_ADMIN
// ══════════════════════════════════════════════
export async function getPendingTrialsCount(): Promise<number> {
  const res = await axiosInstance.get<PagedResponse<FreeTrial>>(
    "/users/trials",
    { params: { used: false, page: 0, size: 1 } }
  );
  return res.data.totalElements;
}

// ══════════════════════════════════════════════
// 5. PLANS SALES CARD
//    Pas de route stats dans le backend pour l'instant
//    TODO: ajouter GET /users/stats/plans quand disponible
// ══════════════════════════════════════════════
export async function getPlanSales() {
  // TODO: remplacer par une vraie route quand le backend l'expose
  return {
    period: "01-07 Dec, 2025",
    plans: [
      { name: "Pro plan",      value: 40, color: "#2d3a6e", orders: 23 },
      { name: "Beginner plan", value: 32, color: "#7b8fd4", orders: 18 },
      { name: "Customer plan", value: 28, color: "#c5cef0", orders: 15 },
    ],
  };
}

// ══════════════════════════════════════════════
// 6. REVENUE CARD
//    Pas de route stats dans le backend pour l'instant
//    TODO: ajouter GET /users/stats/revenue quand disponible
// ══════════════════════════════════════════════
export async function getRevenue() {
  // TODO: remplacer par une vraie route quand le backend l'expose
  return {
    total: 0,
    percentChange: 0,
    period: "01-07 Dec, 2025",
    chartData: [
      { day: "01", current: 0, previous: 0 },
      { day: "02", current: 0, previous: 0 },
      { day: "03", current: 0, previous: 0 },
      { day: "04", current: 0, previous: 0 },
      { day: "05", current: 0, previous: 0 },
      { day: "06", current: 0, previous: 0 },
      { day: "07", current: 0, previous: 0 },
    ],
  };
}