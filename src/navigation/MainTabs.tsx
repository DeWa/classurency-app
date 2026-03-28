import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";

// Icons
import { Feather } from "@expo/vector-icons";

import { useAuth } from "../auth/AuthContext";
import { colors } from "../theme/colors";
import { font } from "../theme/typography";
import { AdminMenuScreen } from "../screens/admin/AdminMenuScreen";
import { CreateAccountScreen } from "../screens/admin/CreateAccountScreen";
import { CreateItemProviderScreen } from "../screens/admin/CreateItemProviderScreen";
import { CreateUserScreen } from "../screens/admin/CreateUserScreen";
import { MintScreen } from "../screens/admin/MintScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { CreateItemScreen } from "../screens/provider/CreateItemScreen";
import { ProviderItemsScreen } from "../screens/provider/ProviderItemsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TransactionDetailScreen } from "../screens/TransactionDetailScreen";
import { TransactionsScreen } from "../screens/TransactionsScreen";
import type {
  AdminStackParamList,
  ProviderItemsStackParamList,
  TransactionsStackParamList,
} from "./types";

const Tab = createBottomTabNavigator();
const TransactionsStack =
  createNativeStackNavigator<TransactionsStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const ProviderItemsStack =
  createNativeStackNavigator<ProviderItemsStackParamList>();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.deepScholastic },
  headerTintColor: colors.paperWhite,
  headerTitleStyle: { fontFamily: font.bodySemi, fontSize: 17 },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.deepScholastic },
};

function TransactionsNavigator() {
  const { t } = useTranslation();
  return (
    <TransactionsStack.Navigator screenOptions={stackScreenOptions}>
      <TransactionsStack.Screen
        name="TransactionList"
        component={TransactionsScreen}
        options={{ title: t("transactions.title") }}
      />
      <TransactionsStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
    </TransactionsStack.Navigator>
  );
}

function AdminNavigator() {
  const { t } = useTranslation();
  return (
    <AdminStack.Navigator screenOptions={stackScreenOptions}>
      <AdminStack.Screen
        name="AdminMenu"
        component={AdminMenuScreen}
        options={{ title: t("tabs.admin") }}
      />
      <AdminStack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{ title: t("createUser.title") }}
      />
      <AdminStack.Screen
        name="CreateItemProvider"
        component={CreateItemProviderScreen}
        options={{ title: t("createProvider.title") }}
      />
      <AdminStack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ title: t("createAccount.title") }}
      />
      <AdminStack.Screen
        name="Mint"
        component={MintScreen}
        options={{ title: t("mint.title") }}
      />
    </AdminStack.Navigator>
  );
}

function ProviderItemsNavigator() {
  const { t } = useTranslation();
  return (
    <ProviderItemsStack.Navigator screenOptions={stackScreenOptions}>
      <ProviderItemsStack.Screen
        name="ItemList"
        component={ProviderItemsScreen}
        options={{ title: t("items.title") }}
      />
      <ProviderItemsStack.Screen
        name="CreateItem"
        component={CreateItemScreen}
        options={{ title: t("items.add") }}
      />
    </ProviderItemsStack.Navigator>
  );
}

export function MainTabs() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const user = state.status === "authenticated" ? state.user : null;
  const isAdmin = user?.type === "admin";
  const isProvider = user?.type === "provider";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.deepScholastic },
        headerTintColor: colors.paperWhite,
        headerTitleStyle: { fontFamily: font.bodySemi, fontSize: 17 },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.electricIndigo,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontFamily: font.body, fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsNavigator}
        options={{
          title: t("tabs.transactions"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" color={color} size={size} />
          ),
        }}
      />
      {isProvider ? (
        <Tab.Screen
          name="Items"
          component={ProviderItemsNavigator}
          options={{ title: t("tabs.items"), headerShown: false }}
        />
      ) : null}
      {isAdmin ? (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            title: t("tabs.admin"),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="monitor" color={color} size={size} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
