import { Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import useFavorites from "@/hooks/useFavorites";
import ProductCard from "@/components/custom/ProductCard";

const Favorites = () => {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold">Избранное</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Здесь будут ваши избранные товары
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2} // 2 карточки в строке
      columnWrapperStyle={{
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 12,
      }}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => <ProductCard item={item} />}
    />
  );
};

export default Favorites;
