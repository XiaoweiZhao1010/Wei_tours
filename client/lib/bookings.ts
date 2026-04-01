const API_BASE = "/api/v1";

export interface BookingTour {
  _id: string;
  name: string;
  imageCover?: string;
  price: number;
  duration: number;
  difficulty: string;
  slug?: string;
}

export interface Booking {
  _id: string;
  tour: BookingTour | null;
  price: number;
  paid: boolean;
  createdAt?: string;
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings/me`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load bookings");
  }
  return data.data?.bookings ?? [];
}

export async function createBooking(tourId: string): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tourId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not complete booking");
  }
  return data.data?.booking;
}

export async function createCheckoutSession(bookingId: string): Promise<{
  url: string;
  sessionId: string;
}> {
  const res = await fetch(`${API_BASE}/bookings/checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ bookingId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not start checkout");
  }
  return {
    url: data.data?.url,
    sessionId: data.data?.sessionId,
  };
}
