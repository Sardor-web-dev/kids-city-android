import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "./global.css";
import { PaperProvider } from "react-native-paper";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <PaperProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </CartProvider>
      </PaperProvider>
    </>
  );
}
