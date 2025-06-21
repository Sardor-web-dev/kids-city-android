// app/product/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function ProductPage() {
  const { id } = useLocalSearchParams(); // <--- получаем id из URL
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`https://www.kidscity.uz/api/clothes/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Text>Загрузка...</Text>;
  if (!product) return <Text>Товар не найден</Text>;

  return (
    <View className="p-4">
      <Text className="text-xl font-bold">{product.name}</Text>
      <Text className="mt-2 text-gray-700">{product.description}</Text>
      <Text className="mt-2 text-black font-semibold">{product.price} сум</Text>
    </View>
  );
}
