import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";

const VEHICLES = [
  {
    id: "1",
    name: "2016 Ford F-150",
    mileage: 142300,
    vin: "1FTEXXXXXDRAFT",
    notes: "Needs new wipers soon.",
  },
  {
    id: "2",
    name: "2012 Honda Accord",
    mileage: 186050,
    vin: "1HGXXXXXZDRAFT",
    notes: "Check tire pressure monthly.",
  },
];

const SERVICE_HISTORY_DRAFT = [
  { date: "2025-11-02", service: "Oil Change", mileage: 139800, cost: 58.99 },
  { date: "2025-08-14", service: "Tire Rotation", mileage: 136200, cost: 25.0 },
];

export default function VehicleDetailsScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const vehicle = VEHICLES.find((v) => v.id === vehicleId) ?? VEHICLES[0];

  return (
    <Screen>
      <Stack.Screen options={{ title: "Vehicle Details" }} />

      <Text style={styles.title}>{vehicle.name}</Text>
      <Text style={styles.subtitle}>
        Draft details page for a selected vehicle.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vehicle Info</Text>
        <Text style={styles.cardBody}>
          Mileage: {vehicle.mileage.toLocaleString()} mi
        </Text>
        <Text style={styles.cardBody}>VIN: {vehicle.vin}</Text>
        <Text style={styles.cardBody}>Notes: {vehicle.notes}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Service History</Text>
        {SERVICE_HISTORY_DRAFT.map((s, idx) => (
          <View key={idx} style={styles.historyRow}>
            <Text style={styles.historyMain}>{s.service}</Text>
            <Text style={styles.historyMeta}>
              {s.date} • {s.mileage.toLocaleString()} mi • ${s.cost}
            </Text>
          </View>
        ))}
        <Text style={styles.smallNote}>
          Later I’ll load real history per vehicle and allow edit/delete.
        </Text>
      </View>

      <Link
        href={{
          pathname: "/add-service",
          params: { vehicleId: vehicle.id, vehicleName: vehicle.name },
        }}
        asChild
      >
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Log a Service Event</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 16, lineHeight: 22 },

  card: { padding: 12, borderWidth: 1, borderRadius: 12, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardBody: { fontSize: 14, lineHeight: 20 },

  historyRow: { gap: 2, paddingVertical: 6, borderTopWidth: 1 },
  historyMain: { fontSize: 14, fontWeight: "700" },
  historyMeta: { fontSize: 14 },

  smallNote: { fontSize: 12, lineHeight: 18 },

  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  primaryButtonText: { fontSize: 16, fontWeight: "700" },
});
