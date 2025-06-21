import { useCart } from "@/contexts/CartContext";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { Button, Modal, Portal, TextInput, Provider } from "react-native-paper";

const CartScreen = () => {
  const { items, addItem, removeItem, removeFromCart, clearCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const sendOrder = () => {
    // Здесь отправка на Telegram или на сервер
    Alert.alert("Заказ отправлен", `На сумму: ${totalPrice} сум`);
    clearCart();
    setVisible(false);
  };

  return (
    <Provider>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              margin: 10,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Image
              source={{ uri: item.Image }}
              style={{ width: "100%", height: 200 }}
            />
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>Размер: {item.selectedSize} см</Text>
            <Text>Цена: {item.price} сум</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Button onPress={() => removeItem(item.id)}>-</Button>
              <Text>{item.quantity}</Text>
              <Button onPress={() => addItem({ ...item, quantity: 1 })}>
                +
              </Button>
              <Button onPress={() => removeFromCart(item.id)}>Удалить</Button>
            </View>
          </View>
        )}
      />

      <View style={{ padding: 20 }}>
        <Text>Итого: {totalPrice.toLocaleString()} сум</Text>
        <Button mode="contained" onPress={() => setVisible(true)}>
          Оформить заказ
        </Button>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
        >
          <Text style={{ marginBottom: 10 }}>Введите ваше имя:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            mode="outlined"
            placeholder="Имя"
          />
          <Button onPress={sendOrder} style={{ marginTop: 10 }}>
            Заказать
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default CartScreen;
