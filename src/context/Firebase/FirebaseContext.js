"use client";

import { createContext, useEffect, useRef, useState } from "react";
import MY_APP from "../../config/FirebaseConfig";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import {
  clearCookie,
  createCookie,
  getCookie,
} from "../../utility/utils/utils";
import {
  CHATS_PER_PAGE,
  INTELLIHUB_SELECTED_MODEL,
  USER_ACCESS_TOKEN,
  USER_DATA,
} from "../../constant/appConstant";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  // REACT ROUTER
  const router = useRouter();
  const params = useParams();

  // FIREBASE
  const auth = getAuth(MY_APP);
  const googleProvider = new GoogleAuthProvider();
  const DATABASE = getFirestore(MY_APP);

  // hooks
  const toast = useToast();
  const startChatBtnClick = useRef(false);

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [getMessageLoader, setGetMessageLoader] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // COOKIE DATA
  const accessToken = getCookie(USER_ACCESS_TOKEN);
  const userData = getCookie(USER_DATA);

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        createCookie(USER_ACCESS_TOKEN, result?.user?.accessToken);
        createCookie(USER_DATA, result?.user);
        toast({
          title: "Logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
        router.push("/");
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isUserExist = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  };

  const logoutUser = async () => {
    await signOut(auth)
      .then(() => {
        setUser(null);
        clearCookie(USER_ACCESS_TOKEN);
        clearCookie(USER_DATA);
        clearCookie(INTELLIHUB_SELECTED_MODEL);
        setMessages([]);
        router.push("/");
        toast({
          title: "Logged out successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {});
    clearCookie(USER_ACCESS_TOKEN);
    clearCookie(USER_DATA);
  };

  const createMessageReference = async (messages, chatId) => {
    try {
      // Reference to the specific chat document for the current user
      const chatDocRef = doc(DATABASE, "users", user.uid, "chats", chatId);

      // Check if the document exists
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        await updateDoc(chatDocRef, {
          messages: arrayUnion(...messages),
        });
      } else {
        await setDoc(chatDocRef, {
          messages: arrayUnion(...messages),
        });
      }
    } catch (error) {}
  };

  const getChatByChatID = async (id) => {
    setGetMessageLoader(true);
    if (user && id) {
      const chatDocRef = doc(DATABASE, "users", user.uid, "chats", id);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const messagesData = chatDocSnap.data().messages;
        setMessages(messagesData);
        setGetMessageLoader(false);
      }
    }

    setGetMessageLoader(false);
  };

  const createNewChat = async () => {
    router.push("/");
    setMessages([]);
  };

  const getChatHistoryData = async () => {
    setIsChatLoading(true);
    try {
      const chatsRef = collection(DATABASE, "users", user.uid, "chats");
      const chatSnapshot = await getDocs(chatsRef);

      const chatsPromises = chatSnapshot.docs.map(async (chatDoc) => {
        const chatId = chatDoc.id;
        const messagesRef = doc(DATABASE, "users", user.uid, "chats", chatId);
        const messagesSnap = await getDoc(messagesRef);
        const messagesData = messagesSnap.data();

        return {
          id: chatId,
          messages: messagesData?.messages || [],
        };
      });

      const chatsData = await Promise.all(chatsPromises);

      // update the states
      setChatHistory(chatsData);
      setIsChatLoading(false);
    } catch (error) {
      setIsChatLoading(false);
    }
  };

  const deleteChatHistoryById = async (chatId) => {
    setIsDeleting(true);
    try {
      const chatDocRef = doc(DATABASE, "users", user.uid, "chats", chatId);
      await deleteDoc(chatDocRef);
      await getChatHistoryData(); // Refresh the chat list
      toast({
        title: "Chat deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setIsDeleting(false);
    } catch (error) {
      toast({
        title: "Error occurred while deleting chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    isUserExist();
    // eslint-disable-next-line
  }, []);

  const values = {
    firebaseMethods: {
      signUpWithGoogle,
      logoutUser,
      createMessageReference,
      getChatByChatID,
      createNewChat,
      getChatHistoryData,
      deleteChatHistoryById,
    },
    states: {
      isLoading,
      user,
      messages,
      setMessages,
      isGenerating,
      setIsGenerating,
      getMessageLoader,
      isChatLoading,
      chatHistory,
      setIsChatLoading,
      isDeleting,
    },
    accessToken,
    userData,
    startChatBtnClick,
  };

  return (
    <FirebaseContext.Provider value={values}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
