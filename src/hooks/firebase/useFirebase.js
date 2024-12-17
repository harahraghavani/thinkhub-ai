import { useContext } from "react";
import { FirebaseContext } from "@/context/Firebase/FirebaseContext";

export const useFirebase = () => useContext(FirebaseContext);
