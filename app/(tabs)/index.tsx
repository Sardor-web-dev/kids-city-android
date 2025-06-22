import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ProductCard from "@/components/custom/ProductCard";

export default function HomeScreen() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://kids-city-go.onrender.com/api/cloths")
      .then((res) => res.json())
      .then((data) => setClothes(data))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView className="px-2 pt-10">
      <Text className="text-black text-center font-bold text-4xl mb-4">
        Clothes
      </Text>

      {loading ? (
        <Text className="text-gray-700">Загрузка...</Text>
      ) : (
        <View className="flex flex-row flex-wrap justify-between">
          {clothes.map((item: any) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
