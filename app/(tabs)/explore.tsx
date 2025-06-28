import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function ProfileScreen() {
  const { token, isAuthenticated } = useAuth();
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
    <View className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-4">Ваши заказы</Text>
      {orders.length === 0 ? (
        <Text className="text-gray-500">У вас пока нет заказов.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-100 p-4 rounded-lg mb-2">
              <Text className="font-bold">
                Заказ №{item.id} ({item.status})
              </Text>
              <Text>Имя: {item.name}</Text>
              <Text>Сумма: {item.total.toLocaleString()} сум</Text>
              <Text>Дата: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
