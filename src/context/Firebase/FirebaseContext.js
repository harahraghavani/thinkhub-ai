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
import { v4 as uuidv4 } from "uuid";

import {
  clearCookie,
  createCookie,
  getCookie,
} from "../../utility/utils/utils";
import {
  COLLECTION_NAMES,
  INTELLIHUB_SELECTED_MODEL,
  USER_ACCESS_TOKEN,
  USER_DATA,
} from "../../constant/appConstant";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteFile } from "@/server/server";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  // REACT ROUTER
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  // FIREBASE
  const auth = getAuth(MY_APP);
  const googleProvider = new GoogleAuthProvider();
  const DATABASE = getFirestore(MY_APP);

  // hooks
  const toast = useToast();
  const startChatBtnClick = useRef(false);
  const isChatGenerating = useRef(false);

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [getMessageLoader, setGetMessageLoader] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCurrentUserChecking, setIsCurrentUserChecking] = useState(false);
  const [shareChatChecking, setShareChatChecking] = useState(false);
  const [getChatLoading, setGetChatLoading] = useState(false);

  // COOKIE DATA
  const accessToken = getCookie(USER_ACCESS_TOKEN);
  const userData = getCookie(USER_DATA);

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // CREATE A USER REFERENCE TO STORE THE DATA IN THE FIRESTORE
            const USER_REF = doc(DATABASE, COLLECTION_NAMES.USERS, user?.uid);

            // CHECK IF THE USER EXIST OR NOT
            const userSnapshot = await getDoc(USER_REF);
            if (!userSnapshot.exists()) {
              await setDoc(USER_REF, {
                uid: user.uid ?? "",
                name: user.displayName ?? "",
                email: user.email ?? "",
                photoURL: user.photoURL ?? "",
                createAt: new Date().valueOf(),
              });
            }
            if (chatId) {
              const isCurrentUser = await isCurrentUserChat(chatId);
              if (isCurrentUser) {
                router.replace(`/chat/${chatId}`);
              } else {
                const newId = uuidv4();
                await getChatById(chatId, newId, user?.uid).then(() => {
                  router.push(`/chat/${newId}`);
                });
              }
            } else {
              router.push("/");
            }
          }
        });
        createCookie(USER_ACCESS_TOKEN, result?.user?.accessToken);
        createCookie(USER_DATA, result?.user);
        toast({
          title: `Welcome, ${result?.user?.displayName}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
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
      console.log("user: ", user);
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
        router.push("/login");
        setUser(null);
        clearCookie(USER_ACCESS_TOKEN);
        clearCookie(USER_DATA);
        clearCookie(INTELLIHUB_SELECTED_MODEL);
        setMessages([]);

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

  const createMessageReference = async (
    messages,
    chatId,
    sharedId,
    oldChatId
  ) => {
    try {
      // Reference to the specific chat document for the current user
      const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);

      // Check if the document exists
      const chatDocSnap = await getDoc(chatDocRef);
      const userId = user ? user?.uid : auth.currentUser?.uid;

      if (oldChatId) {
        updateSharedUserId(oldChatId, {
          userId: sharedId,
          chatId: chatId,
        });
      }

      if (chatDocSnap.exists()) {
        await updateDoc(chatDocRef, {
          messages: arrayUnion(...messages),
        });
      } else {
        await setDoc(chatDocRef, {
          chatId,
          userId: userId,
          messages: arrayUnion(...messages),
          createdAt: new Date().valueOf(),
          sharedWith: [],
        });
      }
    } catch (error) {}
  };

  const updateSharedUserId = async (chatId, sharedChat) => {
    try {
      if (chatId && sharedChat) {
        const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);
        const chatDocSnap = await getDoc(chatDocRef);

        if (chatDocSnap.exists()) {
          await updateDoc(chatDocRef, {
            sharedWith: arrayUnion(sharedChat),
          });
        }
      }
    } catch (error) {}
  };

  const getChatByChatID = async (chatId) => {
    setGetMessageLoader(true);
    isChatGenerating.current = true;

    try {
      const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const messagesData = chatDocSnap.data();

        setMessages(messagesData?.messages);
        setGetMessageLoader(false);
      }
      isChatGenerating.current = false;
    } catch (error) {
      setGetMessageLoader(false);
      isChatGenerating.current = false;
    }

    setGetMessageLoader(false);
    isChatGenerating.current = false;
  };

  const getChatById = async (chatId, newChatId, sharedId) => {
    setGetChatLoading(true);
    try {
      const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const messagesData = chatDocSnap.data()?.messages;
        await createMessageReference(messagesData, newChatId, sharedId, chatId);
      }
      setGetChatLoading(false);
    } catch (error) {
      setGetChatLoading(false);
    }
  };

  const sharedChatById = async (chatId) => {
    setShareChatChecking(true);
    try {
      const auth = getAuth();
      const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        return { isCreated: false, chatId: null };
      }

      const chatData = chatDocSnap.data();
      const sharedChatArray = chatData?.sharedWith || [];

      if (sharedChatArray.length === 0) {
        return { isCreated: false, chatId: null };
      }

      const filteredChat = sharedChatArray.find(
        (item) => item?.userId === auth?.currentUser?.uid
      );

      if (!filteredChat) {
        return { isCreated: false, chatId: null };
      }

      const newChatId = filteredChat.chatId;
      const newChatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, newChatId);
      const newChatDocSnap = await getDoc(newChatDocRef);

      if (!newChatDocSnap.exists()) {
        return { isCreated: false, chatId: null };
      }

      const newMessageData = newChatDocSnap.data()?.messages || [];
      const oldMessageData = chatData?.messages || [];

      if (newMessageData.length === oldMessageData.length) {
        return { isCreated: true, chatId: newChatId };
      }

      // Update the new chat document with messages from the old chat
      await updateDoc(newChatDocRef, {
        messages: arrayUnion(...oldMessageData),
      });
      setShareChatChecking(false);
      return { isCreated: true, chatId: newChatId };
    } catch (error) {
      setShareChatChecking(false);
      return { isCreated: false, chatId: null };
    }
  };

  const isCurrentUserChat = async (chatId) => {
    setIsCurrentUserChecking(true);
    try {
      const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const userId = await chatDocSnap?.data()?.userId;
        const isCurrentUser = userId === userData?.uid;
        setIsCurrentUserChecking(false);
        return isCurrentUser;
      }
    } catch (error) {
      setIsCurrentUserChecking(false);
      return false;
    }
  };

  const createNewChat = async () => {
    router.push("/");
    setMessages([]);
  };

  const getChatHistoryData = async () => {
    setIsChatLoading(true);
    try {
      // Reference to the COLLECTION_NAMES.CHATS collection
      const chatRef = collection(DATABASE, COLLECTION_NAMES.CHATS);

      // Query to filter chats by the logged-in user's UID
      const chatQueryRef = query(
        chatRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      // Execute the query and retrieve the documents
      const querySnapshot = await getDocs(chatQueryRef);

      const userChats = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
        };
      });

      setChatHistory(userChats);
      setIsChatLoading(false);
    } catch (error) {
      setIsChatLoading(false);
    }
  };

  const deleteChatHistoryById = async (chatId) => {
    setIsDeleting(true);
    try {
      const chatDocRef = doc(DATABASE, COLLECTION_NAMES.CHATS, chatId);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const messagesData = chatDocSnap.data().messages;
        const imageArray = messagesData
          ?.filter((item) => item?.image)
          ?.map((data) => data?.image?.public_id);

        let result;

        if (imageArray?.length > 0) {
          result = await Promise.all(
            imageArray.map(async (image) => {
              const result = await deleteFile({ sourceFilePath: image });
              return result;
            })
          );
        }
        const isRemoveImgSuccess =
          result?.map((item) => item.isSuccess).filter(Boolean)?.length > 0;

        await deleteDoc(chatDocRef);
        await getChatHistoryData();
        toast({
          title: "Chat deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }

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
      isCurrentUserChat,
      getChatById,
      sharedChatById,
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
      isCurrentUserChecking,
      shareChatChecking,
      getChatLoading,
    },
    accessToken,
    userData,
    startChatBtnClick,
    isChatGenerating,
  };

  return (
    <FirebaseContext.Provider value={values}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
