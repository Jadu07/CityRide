import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import RouteDetails from "./screens/RouteDetails";
import JourneyPlanner from "./screens/JourneyPlanner";
import Favorites from "./screens/Favorites";
import Recent from "./screens/Recent";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs shown ONLY after welcome
function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#007AFF" }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journey"
        component={JourneyPlanner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Recent"
        component={Recent}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Welcome screen first — NO TABS */}
        <Stack.Screen name="Welcome" component={Welcome} />

        {/* Tabs come after welcome */}
        <Stack.Screen name="AppTabs" component={AppTabs} />

        {/* Stack screens on top of tabs */}
        <Stack.Screen name="RouteDetails" component={RouteDetails} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
