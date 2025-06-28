import React, { useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext"; // подключи

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // ← вместо AsyncStorage напрямую
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://192.168.100.39:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при входе");
      }

      await login(data.token, data.role, data.userId.toString());
      Alert.alert("Успех", "Вы успешно вошли!");
      router.replace("/(tabs)"); // можно использовать replace
    } catch (err: any) {
      setError(err.message || "Ошибка подключения");
      Alert.alert("Ошибка", err.message || "Ошибка подключения");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <TextInput
          className="border border-gray-300 p-2 rounded mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 p-2 rounded mb-4"
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && (
          <Text className="text-red-600 mb-4 text-center">{error}</Text>
        )}
        <Button
          mode="contained"
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-500"
          loading={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </Button>
        {loading && (
          <ActivityIndicator size="small" color="#0000ff" className="mt-4" />
        )}
      </View>
    </View>
  );
}
