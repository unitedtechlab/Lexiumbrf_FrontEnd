export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}


// Define the structure of the enterprise data response
export interface Enterprise {
  accountID: number;
  accountName: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseResponse {
  success: boolean;
  data?: Enterprise[];
  error?: string;
}
