import React from "react";

import { useUserProfile } from "../../store/UserProfile";

const Account = () => {
  const { data } = useUserProfile();

  return (
    <div style={{ padding: "85px 40px" }}>
      <ul>
        <li>ФИО: {data?.name}</li>
        <li>Email: {data?.email}</li>
        <li>Полномочия: {data?.role}</li>
      </ul>
    </div>
  );
};

export default Account;
