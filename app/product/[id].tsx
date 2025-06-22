import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useCart } from "@/contexts/CartContext";
import ButtonCart from "@/components/custom/ButtonCart";

export default function ProductPage() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { items } = useCart();

  // Проверка если уже есть в корзине
  useEffect(() => {
    const cartItem = items.find((i) => i.id === Number(id));
    if (cartItem?.selectedSize) setSelectedSize(cartItem.selectedSize);
  }, [items, id]);

  useEffect(() => {
    if (!id) return;
    fetch(`https://kids-city-go.onrender.com/api/cloths/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Text>Загрузка...</Text>;
  if (!product) return <Text>Товар не найден</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{ uri: product.Image }}
        style={{ width: "100%", height: 250, borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 8 }}>
        {product.name}
      </Text>
      <Text style={{ color: "#555", marginBottom: 10 }}>
        {product.description}
      </Text>

      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Размеры:</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {product.size?.map((size: string, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedSize(size)}
            style={{
              borderWidth: 1,
              borderColor: selectedSize === size ? "black" : "#ccc",
              backgroundColor: selectedSize === size ? "#eee" : "#f9f9f9",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text>{size} см</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 12 }}>
        {product.price.toLocaleString()} сум
      </Text>

      <ButtonCart item={product} selectedSize={selectedSize} />
    </ScrollView>
  );
}
