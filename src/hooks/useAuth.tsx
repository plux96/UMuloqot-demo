import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../app/slices/AuthSlice";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubsucribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log(currentUser);
      if (!currentUser) navigate("/");
      else {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
          })
        );
      }
    });
    return () => unsubsucribe();
  }, [dispatch, navigate]);
}

export default useAuth;
