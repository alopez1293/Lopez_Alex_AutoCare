import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import { useGarage } from "../context/GarageContext";
import { colors } from "../theme/colors";

type FormErrors = {
  name?: string;
  mileage?: string;
  nextOilDue?: string;
  vin?: string;
};

export default function AddVehicleScreen() {
  const { addVehicle } = useGarage();

  const [name, setName] = useState("");
  const [mileage, setMileage] = useState("");
  const [nextOilDue, setNextOilDue] = useState("");
  const [vin, setVin] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm() {
    const newErrors: FormErrors = {};

    const mileageNumber = Number(mileage);
    const nextOilDueNumber = Number(nextOilDue);

    if (!name.trim()) {
      newErrors.name = "Vehicle name is required.";
    }

    if (!mileage.trim()) {
      newErrors.mileage = "Current mileage is required.";
    } else if (Number.isNaN(mileageNumber) || mileageNumber < 0) {
      newErrors.mileage = "Mileage must be a valid positive number.";
    }

    if (!nextOilDue.trim()) {
      newErrors.nextOilDue = "Next oil change mileage is required.";
    } else if (Number.isNaN(nextOilDueNumber) || nextOilDueNumber < 0) {
      newErrors.nextOilDue = "Next oil change must be a valid positive number.";
    } else if (
      !Number.isNaN(mileageNumber) &&
      nextOilDueNumber <= mileageNumber
    ) {
      newErrors.nextOilDue =
        "Next oil change mileage should be greater than the current mileage.";
    }

    if (!vin.trim()) {
      newErrors.vin = "VIN is required.";
    } else if (vin.trim().length < 8) {
      newErrors.vin = "VIN looks too short. Please enter a valid VIN.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleAddVehicle() {
    const formIsValid = validateForm();

    if (!formIsValid) {
      return;
    }

    addVehicle({
      name: name.trim(),
      mileage: Number(mileage),
      nextOilDue: Number(nextOilDue),
      vin: vin.trim().toUpperCase(),
      notes: notes.trim(),
    });

    router.replace("/");
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: "Add Vehicle" }} />

      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Garage Setup</Text>
        <Text style={styles.title}>Add Vehicle</Text>
        <Text style={styles.subtitle}>
          Add a vehicle to your garage so you can track mileage, service
          history, and upcoming maintenance.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Vehicle Information</Text>
            <Text style={styles.requiredNote}>
              Fields marked with * are required.
            </Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Name *</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={name}
            onChangeText={setName}
            placeholder="e.g., 2018 Toyota Camry"
            placeholderTextColor={colors.muted}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Current Mileage *</Text>
          <TextInput
            style={[styles.input, errors.mileage ? styles.inputError : null]}
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
            placeholder="e.g., 84250"
            placeholderTextColor={colors.muted}
          />
          {errors.mileage ? (
            <Text style={styles.errorText}>{errors.mileage}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Next Oil Change Due *</Text>
          <TextInput
            style={[styles.input, errors.nextOilDue ? styles.inputError : null]}
            value={nextOilDue}
            onChangeText={setNextOilDue}
            keyboardType="numeric"
            placeholder="e.g., 87000"
            placeholderTextColor={colors.muted}
          />
          {errors.nextOilDue ? (
            <Text style={styles.errorText}>{errors.nextOilDue}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>VIN *</Text>
          <TextInput
            style={[styles.input, errors.vin ? styles.inputError : null]}
            value={vin}
            onChangeText={setVin}
            placeholder="Enter VIN"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
          />
          {errors.vin ? (
            <Text style={styles.errorText}>{errors.vin}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes about the vehicle"
            placeholderTextColor={colors.muted}
            multiline
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleAddVehicle}>
          <Text style={styles.primaryButtonText}>Save Vehicle</Text>
        </Pressable>
      </View>
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
  cardHeader: {
    paddingBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  requiredNote: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.subtext,
    marginTop: 2,
  },

  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: colors.danger,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  primaryButton: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
  },
});
