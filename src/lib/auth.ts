export interface UserDetails {
  email: string;
  name: string;
  phone: string;
  address: string;
  password?: string;
}

const getRegisteredUsers = (): Record<string, UserDetails> => {
  if (typeof window === "undefined") return {};
  const users = localStorage.getItem("registered_users");
  return users ? JSON.parse(users) : {};
};

export const signup = (
  email: string,
  password: string,
  name: string,
  phone: string,
  address: string
): { success: boolean; message: string } => {
  if (typeof window === "undefined") return { success: false, message: "Cannot register on server side." };
  const users = getRegisteredUsers();
  if (users[email]) {
    return { success: false, message: "User already exists with this email." };
  }
  
  users[email] = { email, password, name, phone, address };
  localStorage.setItem("registered_users", JSON.stringify(users));
  
  login(email);
  return { success: true, message: "Registration successful!" };
};

export const verifyCredentials = (email: string, password: string): boolean => {
  if (typeof window === "undefined") return false;
  const users = getRegisteredUsers();
  const userObj = users[email];
  return userObj ? userObj.password === password : false;
};

export const login = (email: string) => {
  if (typeof window === "undefined") return;
  const users = getRegisteredUsers();
  const userObj = users[email];
  if (userObj) {
    const sessionUser = {
      email: userObj.email,
      name: userObj.name,
      phone: userObj.phone,
      address: userObj.address,
    };
    localStorage.setItem("user", JSON.stringify(sessionUser));
  }
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
};

export const getUser = (): UserDetails | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};


