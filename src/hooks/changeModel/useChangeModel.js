import { useContext } from "react";
import { ChangeModelContext } from "@/context/ChangeModel/ChangeModelContext";

export const useChangeModel = () => useContext(ChangeModelContext);
