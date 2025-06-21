import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.kidscity.uz/api/clothes/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <Text>Загрузка...</Text>;
  }

  if (!product) {
    return <Text>Товар не найден</Text>;
  }

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text>{product.price} сум</Text>
      {/* Add more product details and actions here */}
    </View>
  );
}