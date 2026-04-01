export interface Payment {
  id?: string;
  memberId: string;
  amount: number;
  paymentType: 'Monthly Dues' | 'Registration' | 'Jersey' | 'Other';
  status: 'Paid' | 'Unpaid';
  date: string; // YYYY-MM-DD
}
