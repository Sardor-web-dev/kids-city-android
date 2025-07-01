import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

export default function ProfileScreen() {
  const { token, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://kids-city-go.onrender.com/api/orders/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Ошибка при получении заказов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 mb-2">
          Пожалуйста, войдите в систему.
        </Text>
        <Text
          className="text-blue-500 underline"
          onPress={() => router.replace("/login/page")}
        >
          Войти
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-3xl font-black mb-2">Ваши заказы</Text>
      <View className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.length === 0 ? (
          <Text className="text-gray-500">У вас пока нет заказов.</Text>
        ) : (
          orders.map((order: any) => (
            <View key={order.id} className="rounded-xl bg-white p-4 shadow-lg">
              <Text>
                🧾Заказ был сделан в:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
              <Text className="font-bold mb-1">
                📦Статус:{" "}
                {(order.status === "canceled" && "Заказ отменен") ||
                  (order.status === "process" && "В обработке") ||
                  (order.status === "done" && "Доставлен")}
              </Text>
              <View className="mt-2 space-y-1">
                {order.items.map((item: any) => (
                  <View
                    key={item.id}
                    className="flex-row items-center gap-2 mb-1"
                  >
                    <Image
                      source={{ uri: item.Image }}
                      style={{ width: 50, height: 50, borderRadius: 6 }}
                      resizeMode="cover"
                    />
                    <Text>
                      {item.name} × {item.quantity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        onPress={logout}
        className="mt-6 py-3 px-4 bg-black rounded-xl"
      >
        <Text className="text-white text-center font-semibold">Выйти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
