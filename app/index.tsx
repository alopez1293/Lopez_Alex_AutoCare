import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

  const weatherLabel = weather ? getWeatherLabel(weather.weathercode) : "";
  const drivingTip = weather
    ? getDrivingTip(weather.weathercode, weather.temperature)
    : "";

  return (
    <Screen>
      <Stack.Screen options={{ title: "Garage" }} />

      <Text style={styles.title}>AutoCare Log</Text>
      <Text style={styles.subtitle}>
        Track vehicles, view service history, and log maintenance events.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Driving Conditions</Text>

        {loadingWeather ? (
          <Text style={styles.cardBody}>Loading weather...</Text>
        ) : weatherError ? (
          <Text style={styles.errorText}>{weatherError}</Text>
        ) : weather ? (
          <>
            <Text style={styles.cardBody}>Location: Hastings, NE</Text>
            <Text style={styles.cardBody}>Condition: {weatherLabel}</Text>
            <Text style={styles.cardBody}>
              Temperature: {weather.temperature}°F
            </Text>
            <Text style={styles.cardBody}>
              Wind Speed: {weather.windspeed} mph
            </Text>
            <Text style={styles.tipText}>{drivingTip}</Text>
          </>
        ) : (
          <Text style={styles.cardBody}>No weather data available.</Text>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Vehicles</Text>

        <Link href="/add-vehicle" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Vehicle</Text>
          </Pressable>
        </Link>
      </View>

      {vehicles.map((v) => {
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.subtext,
    marginBottom: 4,
  },

  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    gap: 6,
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
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.danger,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    marginTop: 6,
    color: colors.primary,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },

  vehicleRow: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.subtext,
  },

  badgeDueSoon: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.warning,
  },
  badgeOk: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.success,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
