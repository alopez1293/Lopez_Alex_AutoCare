import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import { useGarage } from "../context/GarageContext";
import { colors } from "../theme/colors";

type FormErrors = {
  vehicle?: string;
  date?: string;
  serviceType?: string;
  odometer?: string;
  cost?: string;
};

export default function AddServiceScreen() {
  const { vehicleId, vehicleName } = useLocalSearchParams<{
    vehicleId?: string;
    vehicleName?: string;
  }>();

  const { addServiceEvent } = useGarage();

  const [date, setDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [odometer, setOdometer] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm() {
    const newErrors: FormErrors = {};

    const mileageNumber = Number(odometer);
    const costNumber = Number(cost);

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!vehicleId) {
      newErrors.vehicle =
        "Vehicle information is missing. Please go back and try again.";
    }

    if (!date.trim()) {
      newErrors.date = "Service date is required.";
    } else if (!datePattern.test(date.trim())) {
      newErrors.date = "Use the date format YYYY-MM-DD.";
    }

    if (!serviceType.trim()) {
      newErrors.serviceType = "Service type is required.";
    }

    if (!odometer.trim()) {
      newErrors.odometer = "Odometer reading is required.";
    } else if (Number.isNaN(mileageNumber) || mileageNumber < 0) {
      newErrors.odometer = "Odometer must be a valid positive number.";
    }

    if (cost.trim() && (Number.isNaN(costNumber) || costNumber < 0)) {
      newErrors.cost = "Cost must be a valid positive number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    const formIsValid = validateForm();

    if (!formIsValid || !vehicleId) {
      return;
    }

    addServiceEvent({
      vehicleId,
      date: date.trim(),
      service: serviceType.trim(),
      mileage: Number(odometer),
      cost: cost.trim() ? Number(cost) : 0,
      notes: notes.trim(),
    });

    router.replace({
      pathname: "/vehicle-details",
      params: { vehicleId },
    });
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: "Add Service Event" }} />

      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Maintenance Record</Text>
        <Text style={styles.title}>Add Service Event</Text>
        <Text style={styles.subtitle}>
          Record work completed for {vehicleName ?? "this vehicle"} and keep the
          maintenance history up to date.
        </Text>
      </View>

      {errors.vehicle ? (
        <Text style={styles.errorText}>{errors.vehicle}</Text>
      ) : null}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Service Details</Text>
          <Text style={styles.requiredNote}>
            Fields marked with * are required.
          </Text>
        </View>

        <View style={styles.vehicleContextBox}>
          <Text style={styles.contextLabel}>Selected Vehicle</Text>
          <Text style={styles.contextValue}>
            {vehicleName ?? "Unknown Vehicle"}
          </Text>
          <Text style={styles.contextMeta}>
            Vehicle ID: {vehicleId ?? "Missing"}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={[styles.input, errors.date ? styles.inputError : null]}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.muted}
          />
          {errors.date ? (
            <Text style={styles.errorText}>{errors.date}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Service Type *</Text>
          <TextInput
            style={[
              styles.input,
              errors.serviceType ? styles.inputError : null,
            ]}
            value={serviceType}
            onChangeText={setServiceType}
            placeholder="Oil Change, Brakes, Tire Rotation..."
            placeholderTextColor={colors.muted}
          />
          {errors.serviceType ? (
            <Text style={styles.errorText}>{errors.serviceType}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Odometer *</Text>
          <TextInput
            style={[styles.input, errors.odometer ? styles.inputError : null]}
            value={odometer}
            onChangeText={setOdometer}
            keyboardType="numeric"
            placeholder="e.g., 142500"
            placeholderTextColor={colors.muted}
          />
          {errors.odometer ? (
            <Text style={styles.errorText}>{errors.odometer}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Cost</Text>
          <TextInput
            style={[styles.input, errors.cost ? styles.inputError : null]}
            value={cost}
            onChangeText={setCost}
            keyboardType="decimal-pad"
            placeholder="Optional, e.g., 59.99"
            placeholderTextColor={colors.muted}
          />
          {errors.cost ? (
            <Text style={styles.errorText}>{errors.cost}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes... shop name, reminder, parts used, etc."
            placeholderTextColor={colors.muted}
            multiline
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>Add Event</Text>
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

  vehicleContextBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 3,
    borderColor: colors.border,
    backgroundColor: colors.primarySoft,
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  contextValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  contextMeta: {
    fontSize: 13,
    color: colors.subtext,
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
