import { useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export type Cloth = {
  id: number;
  name: string;
  description: string;
  authorId: number;
  Image: string;
  gender: string;
  price: number;
  size: string[];
};

export default function useFavorites() {
  const [favorites, setFavorites] = useState<Cloth[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    axios
      .get("http://192.168.100.39:8080/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const validFavorites = res.data.favorites
          ?.map((item: any, i: number) => {
            const cloth = item.Cloth; // ✅ исправлено

            console.log(`🎯 cloth[${i}]:`, cloth);

            if (!cloth) return null;

            return {
              id: cloth.id,
              name: cloth.name,
              description: cloth.description,
              authorId: cloth.authorId,
              Image: cloth.Image || cloth.image || "",
              gender: cloth.gender,
              price: cloth.price,
              size: cloth.size || [],
            };
          })
          .filter(Boolean);

        setFavorites(validFavorites || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки избранного", err);
        Alert.alert("Ошибка", "Не удалось загрузить избранное");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (cloth: Cloth) => {
    const exists = favorites.some((fav) => fav.id === cloth.id);

    setFavorites((prev) =>
      exists ? prev.filter((fav) => fav.id !== cloth.id) : [...prev, cloth]
    );

    try {
      if (exists) {
        await axios.delete(
          `http://192.168.100.39:8080/api/favorites/${cloth.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const res = await axios.put(
          "http://192.168.100.39:8080/api/favorites/add",
          { clothId: cloth.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const added = res.data?.cloth;
        if (!added) return;

        const newCloth: Cloth = {
          id: added.id,
          name: added.name,
          description: added.description,
          authorId: added.authorId,
          Image: added.Image || added.image || "",
          gender: added.gender,
          price: added.price,
          size: added.size || [],
        };

        setFavorites((prev) =>
          prev.some((fav) => fav.id === newCloth.id)
            ? prev
            : [...prev, newCloth]
        );
      }
    } catch (err) {
      console.error("Ошибка обновления избранного", err);
      Alert.alert("Ошибка", "Не удалось изменить избранное");
    }
  };

  return { favorites, toggleFavorite, loading };
}
