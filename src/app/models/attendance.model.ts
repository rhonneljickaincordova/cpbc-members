export interface Attendance {
  id?: string;
  date: string; // YYYY-MM-DD
  eventType: 'Practice' | 'Game' | 'Meeting';
  attendees: string[]; // array of member IDs
}
