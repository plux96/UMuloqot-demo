import React, { useEffect, useState } from "react";
import { useAppSelector } from "../app/hook";
import { userRef } from "../utils/FirebaseConfig";
import { query, where, getDocs } from "firebase/firestore";
import { UserType } from "../utils/Types";

export default function useFetchUsers() {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const uid = useAppSelector((data) => data.auth.userInfo?.uid);

  useEffect(() => {
    if (uid) {
      const getUsers = async () => {
        const firestoreQuery = query(userRef, where("uid", "!=", uid));
        const data = await getDocs(firestoreQuery);
        console.log("Salom", data);
        const firebaseUsers: Array<UserType> = [];
        data.forEach((user) => {
          const userData = user.data() as UserType;
          firebaseUsers.push({
            ...userData,
            label: userData.name,
          });
        });
        setUsers(firebaseUsers);
      };
      getUsers();
    }
  }, [uid]);
  return [users];
}
