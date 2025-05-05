export interface Booking {
  id?: number;
  court_id: number;
  weekday: string;
  start_time: string;
  end_time: string;
  status: string;
}
