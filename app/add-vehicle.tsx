import { router, Stack } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Screen from "../components/Screen";
import { useGarage } from "../context/GarageContext";
import { colors } from "../theme/colors";

export default function AddVehicleScreen() {
  const { addVehicle } = useGarage();

  const [name, setName] = useState("");
  const [mileage, setMileage] = useState("");
  const [nextOilDue, setNextOilDue] = useState("");
  const [vin, setVin] = useState("");
  const [notes, setNotes] = useState("");

  function handleAddVehicle() {
    if (!name.trim() || !mileage.trim() || !nextOilDue.trim() || !vin.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill out all required fields.",
      );
      return;
    }

    const mileageNumber = Number(mileage);
    const nextOilDueNumber = Number(nextOilDue);

    if (Number.isNaN(mileageNumber) || Number.isNaN(nextOilDueNumber)) {
      Alert.alert(
        "Invalid Input",
        "Mileage and next oil due must be valid numbers.",
      );
      return;
    }

    addVehicle({
      name: name.trim(),
      mileage: mileageNumber,
      nextOilDue: nextOilDueNumber,
      vin: vin.trim(),
      notes: notes.trim(),
    });

    router.replace("/");
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: "Add Vehicle" }} />

      <Text style={styles.title}>Add Vehicle</Text>
      <Text style={styles.subtitle}>
        Enter the vehicle details to add it to your garage.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vehicle Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., 2018 Toyota Camry"
            placeholderTextColor={colors.subtext}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Current Mileage</Text>
          <TextInput
            style={styles.input}
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
            placeholder="e.g., 84250"
            placeholderTextColor={colors.subtext}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Next Oil Change Due</Text>
          <TextInput
            style={styles.input}
            value={nextOilDue}
            onChangeText={setNextOilDue}
            keyboardType="numeric"
            placeholder="e.g., 87000"
            placeholderTextColor={colors.subtext}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>VIN</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="Enter VIN"
            placeholderTextColor={colors.subtext}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes about the vehicle"
            placeholderTextColor={colors.subtext}
            multiline
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleAddVehicle}>
          <Text style={styles.primaryButtonText}>Add Vehicle</Text>
        </Pressable>
      </View>
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
    gap: 10,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  field: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    color: colors.text,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },

  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
