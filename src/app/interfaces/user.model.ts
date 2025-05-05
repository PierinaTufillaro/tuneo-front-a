export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; // Omití si no lo querés exponer
  phone?: string;
}
