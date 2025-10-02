import React from "react";

import { useUserProfile } from "../../store/UserProfile";
import { useData } from "../../components/Filters/components/DataContext/DataContext";

const Account = () => {
  const { data } = useUserProfile();
  const { apiVersion } = useData();

  return (
    <div style={{ padding: "85px 40px" }}>
      <ul>
        <li>ФИО: {data?.name}</li>
        <li>Email: {data?.email}</li>
        <li>Полномочия: {data?.role}</li>
      </ul>
      Версия API: {apiVersion}
    </div>
  );
};

export default Account;
