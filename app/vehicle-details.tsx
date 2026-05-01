import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useGarage } from "../context/GarageContext";
import { colors } from "../theme/colors";

export default function VehicleDetailsScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const { vehicles, serviceHistory } = useGarage();

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <Screen>
        <Stack.Screen options={{ title: "Vehicle Details" }} />

        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Vehicle not found</Text>
          <Text style={styles.emptyText}>
            This vehicle could not be loaded. Return to the garage and select a
            vehicle again.
          </Text>

          <Link href="/" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Back to Garage</Text>
            </Pressable>
          </Link>
        </View>
      </Screen>
    );
  }

  const vehicleServiceHistory = serviceHistory.filter(
    (event) => event.vehicleId === vehicle.id,
  );

  const milesUntilOilChange = vehicle.nextOilDue - vehicle.mileage;
  const oilChangeDueSoon = milesUntilOilChange <= 500;

  return (
    <Screen>
      <Stack.Screen options={{ title: "Vehicle Details" }} />

      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Vehicle Profile</Text>
        <Text style={styles.title}>{vehicle.name}</Text>
        <Text style={styles.subtitle}>
          Review mileage, maintenance status, notes, and service history.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Maintenance Summary</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {vehicle.mileage.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Current Miles</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {vehicle.nextOilDue.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Oil Due At</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBox,
            oilChangeDueSoon ? styles.warningBox : styles.successBox,
          ]}
        >
          {oilChangeDueSoon ? (
            <>
              <Text style={styles.warningText}>⚠ Oil change due soon</Text>
              <Text style={styles.cardBody}>
                This vehicle is within 500 miles of the next oil change.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.successText}>✓ Maintenance on track</Text>
              <Text style={styles.cardBody}>
                About {milesUntilOilChange.toLocaleString()} miles remaining
                before the next oil change.
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vehicle Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>VIN</Text>
          <Text style={styles.infoValue}>{vehicle.vin}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Notes</Text>
          <Text style={styles.infoValue}>
            {vehicle.notes || "No notes added for this vehicle yet."}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Service History</Text>
          <Text style={styles.sectionSubtitle}>
            Completed work and maintenance records.
          </Text>
        </View>

        <Text style={styles.sectionCount}>
          {vehicleServiceHistory.length}{" "}
          {vehicleServiceHistory.length === 1 ? "record" : "records"}
        </Text>
      </View>

      {vehicleServiceHistory.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No service history yet</Text>
          <Text style={styles.emptyText}>
            Log your first service event to start building this vehicle&apos;s
            maintenance record.
          </Text>
        </View>
      ) : (
        vehicleServiceHistory.map((s) => (
          <View key={s.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyMain}>{s.service}</Text>
                <Text style={styles.historyDate}>{s.date}</Text>
              </View>

              <Text style={styles.costBadge}>${s.cost.toFixed(2)}</Text>
            </View>

            <View style={styles.historyMetaBox}>
              <Text style={styles.historyMeta}>
                Odometer: {s.mileage.toLocaleString()} mi
              </Text>
            </View>

            {s.notes ? (
              <View style={styles.serviceNotesBox}>
                <Text style={styles.serviceNotesLabel}>Notes</Text>
                <Text style={styles.smallNote}>{s.notes}</Text>
              </View>
            ) : null}
          </View>
        ))
      )}

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
  heroCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    borderColor: colors.border,
    backgroundColor: colors.primary,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primarySoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.white,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.primarySoft,
  },

  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    gap: 12,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.subtext,
    marginTop: 2,
  },

  statusBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  warningBox: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  successBox: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },
  warningText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.warning,
  },
  successText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.success,
  },

  infoRow: {
    gap: 3,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },

  sectionHeader: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.subtext,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },

  historyCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    gap: 10,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  historyMain: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  historyDate: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },
  costBadge: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
    backgroundColor: colors.primarySoft,
  },
  historyMetaBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyMeta: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },

  serviceNotesBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 3,
  },
  serviceNotesLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  smallNote: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.subtext,
  },

  emptyCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    gap: 8,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },

  primaryButton: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
  },
});
