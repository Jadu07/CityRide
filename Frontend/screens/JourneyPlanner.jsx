import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { getJourney } from "../services/api";
import { diffMinutesHHMMSS } from "../utils/timeUtils";

export default function JourneyPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSearch = async () => {
    if (!from || !to) {
      setError("Enter both From and To stops");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getJourney(from, to);
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to fetch journeys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const diff = diffMinutesHHMMSS(item.start_time, item.end_time);
    const duration = Number.isNaN(diff)
      ? (item.stops_in_between || 0) * 3
      : diff;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="directions-bus" size={24} color="#90A17D" />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.routeNumber}>{item.route_number}</Text>
              <Text style={styles.headsign} numberOfLines={1}>
                {item.trip_headsign}
              </Text>
            </View>
            <Text style={styles.times}>
              {item.start_time} → {item.end_time} · {duration} mins
            </Text>
            <Text style={styles.times}>
              {item.stops_in_between} stops in between
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.bannerContainer}>
          <Image source={require("../assets/pune.png")} style={styles.bannerImage} />
        </View>
        <View style={styles.inputBlock}>
          <View style={styles.inputCard}>
            <MaterialIcons name="place" size={20} color="#90A17D" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="From stop"
              placeholderTextColor="#A0A0A0"
              value={from}
              onChangeText={setFrom}
            />
          </View>

          <View style={styles.inputCard}>
            <MaterialIcons name="flag" size={20} color="#90A17D" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="To stop"
              placeholderTextColor="#A0A0A0"
              value={to}
              onChangeText={setTo}
              onSubmitEditing={onSearch}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
            <MaterialIcons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Find Best Route</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionHeading}>Quick Picks</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickScroll}
        >
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => {
              setFrom("Katraj");
              setTo("Shivajinagar");
              onSearch();
            }}
          >
            <Text style={styles.quickTitle}>Katraj → Shivajinagar</Text>
            <Text style={styles.quickSubtitle}>Office route</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => {
              setFrom("Katraj");
              setTo("Pune Station");
              onSearch();
            }}
          >
            <Text style={styles.quickTitle}>Katraj → Pune Station</Text>
            <Text style={styles.quickSubtitle}>City center link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => {
              setFrom("Viman Nagar");
              setTo("Hinjawadi");
              onSearch();
            }}
          >
            <Text style={styles.quickTitle}>Viman Nagar → Hinjawadi</Text>
            <Text style={styles.quickSubtitle}>Tech commute</Text>
          </TouchableOpacity>
        </ScrollView>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#90A17D" />
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.scrollArea}>
          {results.length > 0 &&
            results.map((item, idx) => (
              <View key={idx}>{renderItem({ item, index: idx })}</View>
            ))}

          {!loading && results.length === 0 && (from || to) && (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No journey found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  inputBlock: { marginTop: 18, paddingHorizontal: 16 },
  inputCard: {
    backgroundColor: "#F7F8F4",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#2E2E2E" },
  searchButton: {
    backgroundColor: "#90A17D",
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E2E2E",
    marginTop: 22,
    marginLeft: 18,
  },
  quickScroll: { marginTop: 10, paddingLeft: 14 },
  quickCard: {
    backgroundColor: "#E8EFE2",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 12,
    width: 180,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2E2E",
  },
  quickSubtitle: {
    fontSize: 12,
    color: "#6D6D6D",
    marginTop: 4,
  },

  scrollArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
  },
  center: { padding: 20, alignItems: "center" },
  errorText: { color: "#D9534F", fontSize: 15, fontWeight: "500" },
  emptyText: { color: "#8A8A8A", fontSize: 15 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F5EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },
  routeNumber: { fontSize: 18, fontWeight: "bold", color: "#2E2E2E" },
  headsign: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  times: { fontSize: 14, color: "#666" },
});
