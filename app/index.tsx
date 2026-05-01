import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useGarage } from "../context/GarageContext";
import { colors } from "../theme/colors";

type WeatherData = {
  temperature: number;
  windspeed: number;
  weathercode: number;
};

function isDueSoon(mileage: number, dueAt: number) {
  return mileage >= dueAt - 500;
}

function getWeatherLabel(code: number) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

function getDrivingTip(code: number, temperature: number) {
  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return "Wet conditions today. Check wiper blades and tire tread.";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Cold and snowy conditions. Drive carefully and monitor tire pressure.";
  }

  if (temperature >= 90) {
    return "Hot weather today. Watch tire pressure and coolant levels.";
  }

  if (temperature <= 32) {
    return "Freezing temperatures. Battery and tire pressure checks are a good idea.";
  }

  return "Conditions look normal today. Great time to stay on top of routine maintenance.";
}

export default function GarageScreen() {
  const { vehicles } = useGarage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  const [vehiclePhotos, setVehiclePhotos] = useState<Record<string, string>>(
    {},
  );
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoadingWeather(true);
        setWeatherError("");

        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.2565&longitude=-95.9345&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();

        setWeather({
          temperature: data.current_weather.temperature,
          windspeed: data.current_weather.windspeed,
          weathercode: data.current_weather.weathercode,
        });
      } catch (error) {
        setWeatherError("Unable to load driving conditions right now.");
      } finally {
        setLoadingWeather(false);
      }
    }

    fetchWeather();
  }, []);

  async function pickVehiclePhoto(vehicleId: string) {
    try {
      setPhotoError("");

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        setPhotoError(
          "Photo library permission is required to add a vehicle photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const selectedImageUri = result.assets[0].uri;

      setVehiclePhotos((currentPhotos) => ({
        ...currentPhotos,
        [vehicleId]: selectedImageUri,
      }));
    } catch (error) {
      setPhotoError("Something went wrong while selecting the photo.");
    }
  }

  const vehiclesDueSoon = vehicles.filter((vehicle) =>
    isDueSoon(vehicle.mileage, vehicle.nextOilDue),
  ).length;

  const weatherLabel = weather ? getWeatherLabel(weather.weathercode) : "";
  const drivingTip = weather
    ? getDrivingTip(weather.weathercode, weather.temperature)
    : "";

  return (
    <Screen>
      <Stack.Screen options={{ title: "Garage" }} />

      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Vehicle Maintenance Dashboard</Text>
        <Text style={styles.title}>AutoCare Log</Text>
        <Text style={styles.subtitle}>
          Track your vehicles, service history, mileage, and upcoming
          maintenance in one place.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{vehicles.length}</Text>
          <Text style={styles.summaryLabel}>
            {vehicles.length === 1 ? "Vehicle" : "Vehicles"}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{vehiclesDueSoon}</Text>
          <Text style={styles.summaryLabel}>Due Soon</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Driving Conditions</Text>
            <Text style={styles.cardSubTitle}>Hastings, NE</Text>
          </View>
          <Text style={styles.weatherIcon}>☁️</Text>
        </View>

        {loadingWeather ? (
          <Text style={styles.cardBody}>Loading current weather...</Text>
        ) : weatherError ? (
          <Text style={styles.errorText}>{weatherError}</Text>
        ) : weather ? (
          <>
            <View style={styles.weatherGrid}>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherValue}>{weatherLabel}</Text>
                <Text style={styles.weatherLabel}>Condition</Text>
              </View>

              <View style={styles.weatherItem}>
                <Text style={styles.weatherValue}>{weather.temperature}°F</Text>
                <Text style={styles.weatherLabel}>Temperature</Text>
              </View>

              <View style={styles.weatherItem}>
                <Text style={styles.weatherValue}>{weather.windspeed} mph</Text>
                <Text style={styles.weatherLabel}>Wind</Text>
              </View>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>{drivingTip}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.cardBody}>No weather data available.</Text>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
          <Text style={styles.sectionSubtitle}>
            Manage saved vehicles and maintenance records.
          </Text>
        </View>

        <Link href="/add-vehicle" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Vehicle</Text>
          </Pressable>
        </Link>
      </View>

      {photoError ? <Text style={styles.errorText}>{photoError}</Text> : null}

      {vehicles.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No vehicles yet</Text>
          <Text style={styles.emptyText}>
            Add your first vehicle to start tracking mileage, service history,
            and maintenance reminders.
          </Text>
        </View>
      ) : (
        vehicles.map((v) => {
          const dueSoon = isDueSoon(v.mileage, v.nextOilDue);
          const vehicleId = String(v.id);
          const photoUri = vehiclePhotos[vehicleId];

          return (
            <View key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleTopRow}>
                <View style={styles.photoColumn}>
                  {photoUri ? (
                    <Image
                      source={{ uri: photoUri }}
                      style={styles.vehicleImage}
                    />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>No Photo</Text>
                    </View>
                  )}

                  <Pressable
                    style={styles.photoButton}
                    onPress={() => pickVehiclePhoto(vehicleId)}
                  >
                    <Text style={styles.photoButtonText}>
                      {photoUri ? "Change" : "Add Photo"}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.vehicleInfo}>
                  <View style={styles.vehicleTitleRow}>
                    <Text style={styles.vehicleName}>{v.name}</Text>

                    {dueSoon ? (
                      <Text style={styles.badgeDueSoon}>Due Soon</Text>
                    ) : (
                      <Text style={styles.badgeOk}>On Track</Text>
                    )}
                  </View>

                  <Text style={styles.meta}>
                    Mileage: {v.mileage.toLocaleString()} mi
                  </Text>
                  <Text style={styles.meta}>
                    Next oil due: {v.nextOilDue.toLocaleString()} mi
                  </Text>
                </View>
              </View>

              <Link
                href={{
                  pathname: "/vehicle-details",
                  params: { vehicleId: v.id },
                }}
                asChild
              >
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>View Details</Text>
                </Pressable>
              </Link>
            </View>
          );
        })
      )}
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
    fontSize: 30,
    fontWeight: "800",
    color: colors.white,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.primarySoft,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  cardSubTitle: {
    fontSize: 13,
    color: colors.subtext,
  },
  weatherIcon: {
    fontSize: 24,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.danger,
    fontWeight: "600",
  },

  weatherGrid: {
    flexDirection: "row",
    gap: 8,
  },
  weatherItem: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  weatherLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  tipBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.primaryDark,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
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

  addButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },

  emptyCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
    gap: 6,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
  },

  vehicleCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    gap: 12,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  vehicleTopRow: {
    flexDirection: "row",
    gap: 12,
  },
  photoColumn: {
    width: 86,
    gap: 8,
    alignItems: "center",
  },
  vehicleImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  photoButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  photoButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },

  vehicleInfo: {
    flex: 1,
    gap: 5,
  },
  vehicleTitleRow: {
    gap: 6,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.subtext,
  },

  badgeDueSoon: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "800",
    color: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  badgeOk: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "800",
    color: colors.success,
    backgroundColor: colors.successSoft,
  },

  button: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
});
