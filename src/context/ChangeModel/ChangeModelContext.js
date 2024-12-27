"use client";

import {
  GEMINI_1_5_FLASH,
  INTELLIHUB_SELECTED_MODEL,
} from "@/constant/appConstant";
import {
  createCookie,
  decryptData,
  encryptData,
  getCookie,
} from "@/utility/utils/utils";
import { createContext, useState } from "react";

const ChangeModelContext = createContext();

const ChangeModelProvider = ({ children }) => {
  console.log(getCookie(INTELLIHUB_SELECTED_MODEL));
  const sessionStorageData = decryptData(getCookie(INTELLIHUB_SELECTED_MODEL));

  const [selectedAIModel, setSelectedAIModel] = useState(
    sessionStorageData ? sessionStorageData : GEMINI_1_5_FLASH
  );

  const changeSelectedAIModel = (model) => {
    if (model) {
      setSelectedAIModel(model);
      createCookie(INTELLIHUB_SELECTED_MODEL, encryptData(model));
    }
  };

  const values = {
    selectedAIModel,
    setSelectedAIModel,
    changeSelectedAIModel,
  };

  return (
    <ChangeModelContext.Provider value={values}>
      {children}
    </ChangeModelContext.Provider>
  );
};

export { ChangeModelContext, ChangeModelProvider };
