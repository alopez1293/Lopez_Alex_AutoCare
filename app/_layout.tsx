import { Stack } from "expo-router";
import { GarageProvider } from "../context/GarageContext";

export default function RootLayout() {
  return (
    <GarageProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
        }}
      />
    </GarageProvider>
  );
}
