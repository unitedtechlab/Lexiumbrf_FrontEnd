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
  accountname: string;
  createdAt: string;
  updatedAt: string;
}

// The response structure when fetching enterprises
export interface EnterpriseResponse {
  success: boolean;
  data: Enterprise[];
}
