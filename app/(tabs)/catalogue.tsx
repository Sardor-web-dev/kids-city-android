import { IconSymbol } from "@/components/ui/IconSymbol";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabFourScreen() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    fetch("https://www.kidscity.uz/api/clothes")
      .then((res) => res.json())
      .then((data) => setClothes(data))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (item: any) => {
    const size = selectedSizes[item.id];
    if (!size) {
      Alert.alert("Ошибка", "Пожалуйста, выберите размер.");
      return;
    }

    Alert.alert("Добавлено", `${item.name} (${size}) добавлен в корзину.`);
    // addItem({ ...item, selectedSize: size }) — можно позже
  };

  return (
    <ScrollView className="bg-gray-700 px-2 pt-10">
      <Text className="text-white font-bold text-2xl mb-2">Clothes:</Text>

      {loading ? (
        <Text className="text-gray-700">Загрузка...</Text>
      ) : (
        <View className="flex flex-row flex-wrap justify-between">
          {clothes.map((item: any) => (
            <View
              key={item.id}
              className="w-[48%] mb-4 p-2 bg-gray-100 rounded-xl shadow"
            >
              {item.Image ? (
                <Image
                  source={{ uri: item.Image }}
                  style={{ width: "100%", height: 120, borderRadius: 10 }}
                  resizeMode="cover"
                  onError={() => console.warn("Ошибка загрузки изображения")}
                />
              ) : (
                <View className="bg-gray-300 h-120 justify-center items-center rounded-md">
                  <Text className="text-xs text-gray-600">Нет фото</Text>
                </View>
              )}
              <Text className="text-base font-bold mt-2">{item.name}</Text>
              <Text className="text-gray-600 text-xs">{item.description}</Text>
              <Text className="text-black font-semibold mt-1 text-sm">
                {item.price} сум
              </Text>

              <Text className="mt-2 text-gray-700 text-sm">Размеры:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              >
                <View className="flex flex-row items-center space-x-2">
                  {Array.isArray(item.size) && item.size.length > 0 ? (
                    <Picker
                      selectedValue={selectedSizes[item.id] ?? item.size[0]}
                      onValueChange={(itemValue) =>
                        setSelectedSizes((prev) => ({
                          ...prev,
                          [item.id]: itemValue,
                        }))
                      }
                      style={{ height: 40, width: 140 }}
                    >
                      {item.size.map((size: string, i: number) => (
                        <Picker.Item key={i} label={size} value={size} />
                      ))}
                    </Picker>
                  ) : (
                    <Text className="text-xs text-red-500">Нет размеров</Text>
                  )}

                  {/* {item.size.map((size: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        setSelectedSizes((prev) => ({
                          ...prev,
                          [item.id]: size,
                        }))
                      }
                      className={`px-3 py-1 text-center rounded-full ${
                        selectedSizes[item.id] === size
                          ? "bg-blue-500"
                          : "bg-blue-200"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          selectedSizes[item.id] === size
                            ? "text-white"
                            : "text-blue-800"
                        } font-medium`}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))} */}
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                className="mt-3 bg-black py-2 rounded-xl flex-row items-center justify-center"
              >
                <IconSymbol size={20} name="cart.fill" color={"white"} />
                <Text className="text-white text-sm font-medium ml-2">
                  В корзину
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
