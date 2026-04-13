import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getUserData } from "../utils/storage";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getUserData().then((data) => {
      if (data) {
        router.replace("/home");
      } else {
        router.replace("/setup");
      }
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e8e4de" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return null;
}
