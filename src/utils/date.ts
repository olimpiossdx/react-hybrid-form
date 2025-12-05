// Cria uma data no meio-dia local para evitar problemas de fuso horário
export const createDate = (year: number, month: number, day: number) => {
  return new Date(year, month, day, 12, 0, 0, 0);
};

export const getToday = () => {
  const now = new Date();
  return createDate(now.getFullYear(), now.getMonth(), now.getDate());
};

// YYYY-MM-DD (Para Input Value)
export const toISODate = (date?: Date | null) => {
  if (!date || isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// DD/MM/AAAA (Para Visualização)
export const toDisplayDate = (date?: Date | null) => {
  if (!date || isNaN(date.getTime())) return "__/__/____";
  return date.toLocaleDateString('pt-BR');
};

export const parseISODate = (isoStr: string) => {
  if (!isoStr) return null;
  const [y, m, d] = isoStr.split('-').map(Number);
  return createDate(y, m - 1, d);
};

// --- ARITMÉTICA ---

export const addDays = (date: Date, amount: number) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + amount);
  return newDate;
};

export const addMonths = (date: Date, amount: number) => {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + amount);
  return newDate;
};

export const startOfMonth = (date: Date) => createDate(date.getFullYear(), date.getMonth(), 1);
export const endOfMonth = (date: Date) => createDate(date.getFullYear(), date.getMonth() + 1, 0);

// --- COMPARAÇÕES ---

export const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isAfter = (d1: Date, d2: Date) => d1.getTime() > d2.getTime();
export const isBefore = (d1: Date, d2: Date) => d1.getTime() < d2.getTime();

export const isBetween = (target: Date, start: Date, end: Date) => {
  return target.getTime() >= start.getTime() && target.getTime() <= end.getTime();
};

export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0=Dom, 6=Sab
};

// --- CALENDÁRIO ---

export const getDaysInMonthGrid = (currentMonth: Date) => {
  const days: (Date | null)[] = [];
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  
  // Dias vazios antes do dia 1 (Padding)
  const startDayOfWeek = firstDay.getDay(); // 0-6
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Dias do mês
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(createDate(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  return days;
};