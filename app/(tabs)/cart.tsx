import { useCart } from "@/contexts/CartContext";
import React, { useState } from "react";
import { View, Text, FlatList, Alert, ScrollView } from "react-native";
import CartItemCard from "@/components/custom/CartItemCard";
import { useAuth } from "@/contexts/AuthContext";

import {
  Button,
  Modal,
  Portal,
  TextInput,
  Provider,
  RadioButton,
} from "react-native-paper";

const TELEGRAM_TOKEN = "7542522767:AAGZUwMexxZwuuoBZknLraF-n-41WexGgmM";
const CHAT_IDS = ["5809549678", "22215359"]; // можно массивом

const CartScreen = () => {
  const { items, clearCart } = useCart();
  const { token} = useAuth();

  const [visible, setVisible] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [adress, setAdress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState("");

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const resetForm = () => {
    setName("");
    setSurname("");
    setAdress("");
    setNumber("");
    setEmail("");
    setPayment("");
  };

  const sendOrder = async () => {
    if (!name || !surname || !adress || !number || !email || !payment) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля.");
      return;
    }

    const orderNumber = `ORDER-${Date.now()}`;

    const orderData = {
      name,
      surname,
      adress,
      number,
      email,
      payment,
      items: items // 💥 вот ключ
    };

    try {
      // 1. Отправка заказа на API Golang
      await fetch("https://kids-city-go.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 добавляем токен
        },
        body: JSON.stringify(orderData),
      });

      // 2. Отправка в Telegram
      for (const chatId of CHAT_IDS) {
        for (const item of items) {
          const caption = `
  🧾 Заказ: ${orderNumber}
  👕 Товар: ${item.name}
  📏 Размер: ${item.selectedSize}
  🔢 Кол-во: ${item.quantity}
  💵 Цена: ${(item.price * item.quantity).toLocaleString()} сум
  👤 Владелец: ${name} ${surname}
          `;

          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chat_id: chatId,
                photo: item.Image,
                caption: caption,
              }),
            }
          );
        }

        const summary = `
  🧾 Заказ: ${orderNumber}
  👤 Имя: ${name}
  👤 Фамилия: ${surname}
  🏠 Адрес: ${adress}
  📞 Телефон: +998 ${number}
  📧 Email: ${email}
  💳 Оплата: ${payment}
  💰 Сумма: ${totalPrice.toLocaleString()} сум
  🔗 https://www.kidscity.uz/admin/orders
        `;

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: summary,
            }),
          }
        );
      }

      Alert.alert("Успех", "Заказ отправлен!");
      clearCart();
      resetForm();
      setVisible(false);
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
      Alert.alert("Ошибка", "Не удалось отправить заказ.");
    }
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Корзина пуста 🛒
        </Text>
      </View>
    );
  }

  return (
    <Provider>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => <CartItemCard item={item} />}
      />

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Итого: {totalPrice.toLocaleString()} сум
        </Text>
        <Button
          mode="contained"
          style={{ marginTop: 10 }}
          onPress={() => setVisible(true)}
        >
          Оформить заказ
        </Button>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <ScrollView>
            <TextInput
              label="Имя"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Фамилия"
              value={surname}
              onChangeText={setSurname}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Адрес"
              value={adress}
              onChangeText={setAdress}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Номер телефона"
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />

            <Text style={{ marginTop: 10, marginBottom: 5 }}>
              Способ оплаты:
            </Text>
            <RadioButton.Group onValueChange={setPayment} value={payment}>
              <RadioButton.Item label="Наличные" value="cash" />
              <RadioButton.Item label="Карта" value="card" />
            </RadioButton.Group>

            <Button
              mode="contained"
              loading={ordered}
              disabled={ordered}
              onPress={() => {
                setOrdered(true);
                sendOrder().finally(() => setOrdered(false));
              }}
              style={{ marginTop: 20 }}
            >
              {ordered ? "Отправляем..." : "Заказать"}
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default CartScreen;
