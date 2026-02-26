import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";

export default function AddServiceScreen() {
  const { vehicleId, vehicleName } = useLocalSearchParams<{
    vehicleId?: string;
    vehicleName?: string;
  }>();

  const [date, setDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [odometer, setOdometer] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Screen>
      <Stack.Screen options={{ title: "Add Service Event" }} />

      <Text style={styles.title}>Add Service Event</Text>
      <Text style={styles.subtitle}>
        Vehicle: {vehicleName ?? "Unknown"} (ID: {vehicleId ?? "?"})
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Service Details (Draft)</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD (example: 2026-02-24)"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Service Type</Text>
          <TextInput
            style={styles.input}
            value={serviceType}
            onChangeText={setServiceType}
            placeholder="Oil Change, Brakes, Tire Rotation..."
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Odometer</Text>
          <TextInput
            style={styles.input}
            value={odometer}
            onChangeText={setOdometer}
            keyboardType="numeric"
            placeholder="e.g., 142500"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Cost</Text>
          <TextInput
            style={styles.input}
            value={cost}
            onChangeText={setCost}
            keyboardType="numeric"
            placeholder="e.g., 59.99"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes… (brand, shop name, next reminder, etc.)"
            multiline
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          I’ll add saving functionality later.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 16, lineHeight: 22 },

  card: { padding: 12, borderWidth: 1, borderRadius: 12, gap: 10 },

  cardTitle: { fontSize: 16, fontWeight: "700" },

  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  multiline: { minHeight: 90, textAlignVertical: "top" },

  previewLine: { fontSize: 14, lineHeight: 20 },
  smallNote: { fontSize: 12, lineHeight: 18 },
});
