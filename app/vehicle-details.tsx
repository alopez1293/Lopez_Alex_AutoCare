import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useGarage } from "../context/GarageContext";
import { colors } from "../theme/colors";

export default function VehicleDetailsScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const { vehicles, serviceHistory } = useGarage();

  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];

  const vehicleServiceHistory = serviceHistory.filter(
    (event) => event.vehicleId === vehicle.id,
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: "Vehicle Details" }} />

      <Text style={styles.title}>{vehicle.name}</Text>
      <Text style={styles.subtitle}>
        Details and service history for this vehicle.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vehicle Info</Text>
        <Text style={styles.cardBody}>
          Mileage: {vehicle.mileage.toLocaleString()} mi
        </Text>
        <Text style={styles.cardBody}>VIN: {vehicle.vin}</Text>
        <Text style={styles.cardBody}>
          Notes: {vehicle.notes || "No notes added yet."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Service History</Text>

        {vehicleServiceHistory.length === 0 ? (
          <Text style={styles.cardBody}>No service history recorded yet.</Text>
        ) : (
          vehicleServiceHistory.map((s) => (
            <View key={s.id} style={styles.historyRow}>
              <Text style={styles.historyMain}>{s.service}</Text>
              <Text style={styles.historyMeta}>
                {s.date} • {s.mileage.toLocaleString()} mi • $
                {s.cost.toFixed(2)}
              </Text>
              {s.notes ? <Text style={styles.smallNote}>{s.notes}</Text> : null}
            </View>
          ))
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.subtext,
  },

  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    gap: 8,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },

  historyRow: {
    gap: 4,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  historyMain: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  historyMeta: {
    fontSize: 14,
    color: colors.subtext,
  },

  smallNote: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.subtext,
  },

  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
