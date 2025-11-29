import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import SearchBar from "../components/SearchBar";
import RouteCard from "../components/RouteCard";
import { searchRoutes } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = React.useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query.length === 0) {
      setRoutes([]);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchRoutes(query);
        setRoutes(results);
      } catch (err) {
        setError("Failed to fetch routes. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500); 
  };

  const renderItem = ({ item }) => (
    <RouteCard
      route={item}
      onPress={() =>
        navigation.navigate("RouteDetails", {
          tripId: item.example_trip_id,
          route: item,
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
  <View style={styles.header}>
    <Text style={styles.title}>CityRide</Text>
    <Text style={styles.subtitle}>Find your bus route</Text>
  </View>

  <SearchBar
    value={searchQuery}
    onChangeText={handleSearch}
    onSubmit={() => handleSearch(searchQuery)}
  />


  <Text style={styles.sectionHeading}>Explore Places</Text>
  <View style={styles.sliderContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Image source={require("../assets/explore1.png")} style={styles.sliderImage} />
      <Image source={require("../assets/explore2.png")} style={styles.sliderImage} />
      <Image source={require("../assets/explore3.png")} style={styles.sliderImage} />
    </ScrollView>
  </View>

   <Text style={styles.sectionHeading}>Popular Routes</Text>
  <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
    <TouchableOpacity style={styles.popularCard} onPress={() => navigation.navigate("RouteDetails", {})}>
      <Text style={styles.popularText}>103 → Hinjawadi Phase 3</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.popularCard} onPress={() => navigation.navigate("RouteDetails", {})}>
      <Text style={styles.popularText}>235 → Kharadi</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.popularCard} onPress={() => navigation.navigate("RouteDetails", {})}>
      <Text style={styles.popularText}>2 → Shivajinagar</Text>
    </TouchableOpacity>
  </View>

  <TouchableOpacity
    style={styles.journeyButton}
    onPress={() => navigation.navigate("Journey")}
  >
    <Text style={styles.journeyButtonText}>Plan your journey</Text>
  </TouchableOpacity>

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

  <FlatList
    data={routes}
    renderItem={renderItem}
    keyExtractor={(item) => item.route_id}
    contentContainerStyle={styles.listContent}
    ListEmptyComponent={
      !loading && searchQuery.length > 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No routes found</Text>
        </View>
      ) : null
    }
  />
</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E2E2E",
  },
  subtitle: {
    fontSize: 16,
    color: "#6E6E6E",
    marginTop: 4,
  },

  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2E2E2E",
    marginTop: 18,
    marginLeft: 20,
  },
  sliderContainer: {
    marginTop: 12,
    height: 210,
  },
  sliderImage: {
    width: 270,
    height: 200,
    borderRadius: 14,
    marginLeft: 16,
    resizeMode: "cover",
  },
  popularCard: {
    backgroundColor: "#F4F6F0",
    padding: 14,
    borderRadius: 12,
    marginBottom: 5,
  },
  popularText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2E2E2E",
  },
  journeyButton: {
    backgroundColor: "#6d7762ff",
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  journeyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  listContent: {
    paddingBottom: 25,
  },
  center: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#D9534F",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  emptyText: {
    color: "#8A8A8A",
    fontSize: 16,
    marginTop: 20,
  },
});
