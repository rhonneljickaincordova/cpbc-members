export interface Member {
  id?: string;
  name: string;
  nickname: string;
  contactNumber: string;
  dateJoined: string;
  status: 'Active' | 'Inactive';
}
