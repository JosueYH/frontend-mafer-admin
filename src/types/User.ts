export interface User {
  IdUser?: number;
  FirstName: string;
  LastName: string;
  Dni: string;
  Address: string;
  Password: string;
  Phone: string;
  Mail: string;
  Rol?: number;
  BirthDate?:string;
}

export interface ErrorMessages {
  IdUser?: number;
  FirstName: string;
  LastName: string;
  Dni: string;
  Address: string;
  Password: string;
  Phone: string;
  Mail: string;
  Rol?: number;
  BirthDate?:string;
}

export interface Login {
  UserRequest: string;
  Password: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
