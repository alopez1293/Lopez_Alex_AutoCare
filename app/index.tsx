import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";

const VEHICLES = [
  { id: "1", name: "2016 Ford F-150", mileage: 142300, nextOilDue: 145000 },
  { id: "2", name: "2012 Honda Accord", mileage: 186050, nextOilDue: 186500 },
];

function isDueSoon(mileage: number, dueAt: number) {
  // “Due soon” within 500 miles (draft rule)
  return mileage >= dueAt - 500;
}

export default function GarageScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: "Garage" }} />

      <Text style={styles.title}>AutoCare Log</Text>
      <Text style={styles.subtitle}>
        Track vehicles, view service history, and log maintenance events.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Due Soon (Draft)</Text>
        <Text style={styles.cardBody}>
          I’ll flag services that are within ~500 miles of the next due mileage.
          I'll make this customizable later.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>My Vehicles</Text>

      {VEHICLES.map((v) => {
        const dueSoon = isDueSoon(v.mileage, v.nextOilDue);
        return (
          <View key={v.id} style={styles.vehicleRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.vehicleName}>{v.name}</Text>
              <Text style={styles.meta}>
                Mileage: {v.mileage.toLocaleString()} mi
              </Text>
              <Text style={styles.meta}>
                Next oil due: {v.nextOilDue.toLocaleString()} mi
              </Text>

              {dueSoon ? (
                <Text style={styles.badgeDueSoon}>⚠ Due Soon</Text>
              ) : (
                <Text style={styles.badgeOk}>✓ On Track</Text>
              )}
            </View>

            <Link
              href={{
                pathname: "/vehicle-details",
                params: { vehicleId: v.id },
              }}
              asChild
            >
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Details</Text>
              </Pressable>
            </Link>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 16, lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 6 },

  card: { padding: 12, borderWidth: 1, borderRadius: 12, gap: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardBody: { fontSize: 14, lineHeight: 20 },

  vehicleRow: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  vehicleName: { fontSize: 16, fontWeight: "700" },
  meta: { fontSize: 14 },

  badgeDueSoon: { fontSize: 14, fontWeight: "700" },
  badgeOk: { fontSize: 14, fontWeight: "700" },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: { fontSize: 14, fontWeight: "700" },
});
