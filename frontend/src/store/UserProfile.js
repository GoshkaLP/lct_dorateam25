import { createContext, useContext, useState, useEffect } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Пример запроса профиля пользователя
const fetchUserProfile = async () => {
  // Здесь может быть реальный API-запрос
  return {
    name: "Иванов В.П.",
    email: "ivanov@example.com",
    role: "Диспетчер",
  };
};

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
  const [isAuth, setIsAuth] = useState(false);
  const handleAuthChange = (flag) => {
    setIsAuth(flag);
    data.name = "Иванов В.П.";
  };

  // Если имя не пустое, считаем авторизованным
  const effectiveIsAuth = isAuth;

  return (
    <UserProfileContext.Provider
      value={{
        data,
        isLoading,
        error,
        isAuth: effectiveIsAuth,
        handleAuthChange,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);

// Для корневого компонента
export const queryClient = new QueryClient();
