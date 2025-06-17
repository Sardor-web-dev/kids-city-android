import { useNavigation } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";

const images = [
  { src: require("@/assets/boy.jpg"), alt: "Одежда для мальчиков" },
  { src: require("@/assets/girl.jpg"), alt: "Одежда для девочек" },
  {
    src: require("@/assets/boy&girl.jpg"),
    alt: "Одежда для мальчиков и девочек",
  },
  { src: require("@/assets/caps.jpg"), alt: "Фото кепок" },
  { src: require("@/assets/combo2jpg.jpg"), alt: "Комбо для девочек" },
  { src: require("@/assets/dress.jpg"), alt: "Платье для девочек" },
  { src: require("@/assets/whitejpg.jpg"), alt: "Одежда для девочек" },
  { src: require("@/assets/look.jpg"), alt: "Платье для девочек" },
  { src: require("@/assets/combo.jpg"), alt: "Комбо для девочек" },
];

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Блок с фоном */}
      <ImageBackground
        source={{
          uri: "https://avatars.mds.yandex.net/get-altay/15223195/2a00000194ab8c65ded07e225b5837097cdf/orig",
        }}
        style={{
          width: "100%",
          height: 600,
          borderRadius: 20,
          overflow: "hidden",
        }}
        resizeMode="cover"
      >
        <View
          style={{ flex: 1 }}
          className="p-4 items-center justify-center bg-black/50 gap-10"
        >
          <Text className="text-white font-bold text-2xl text-center">
            Kids City – ваш надежный магазин качественной детской одежды!
          </Text>
          <Text className="text-white font-bold text-lg text-center max-w-[90%]">
            👕 Мы предлагаем широкий ассортимент стильной и удобной одежды для
            детей всех возрастов.
          </Text>
        </View>
      </ImageBackground>

      {/* Заголовок и галерея */}
      <View className="items-center justify-center mt-10 px-4 space-y-6">
        <View className="flex flex-col items-center gap-4">
          <Text className="text-3xl font-bold text-center">Наши товары</Text>
          <Text className="text-xl text-center">
            Широкий ассортимент для всех возрастов
          </Text>
        </View>

        <ScrollView
        className="mt-10"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {images.map((img, index) => (
            <View key={index} className="mr-4">
              <Image
                source={img.src}
                style={{
                  width: screenWidth * 0.7,
                  height: 300,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          className="bg-black mt-10 rounded-2xl w-[170px] text-center h-[50px] flex items-center justify-center"
          // onPress={() => navigation.navigate("explore")}
        >
          <Text className="text-white font-bold text-lg">
            Перейти в каталог
          </Text>
        </TouchableOpacity>
      </View>

      {/* О нас */}
      <View className="mt-20 px-6 space-y-6 items-center">
        <Text className="text-2xl font-bold text-center">О нас</Text>
        <Text className="font-medium text-base text-justify mb-10 leading-relaxed">
          В 2020 году во время пандемии COVID-19, основательница нашего магазина
          запустила интернет-магазин детской одежды в Самарканде. Идея возникла
          после нескольких неудачных покупок — не тот размер, низкое качество, а
          магазины были закрыты. Она решила искать оптовых поставщиков: сначала
          в Узбекистане, затем в Турции и Китае. Так появилась цель — помочь
          другим мамам покупать качественную одежду по доступной цене. Первыми
          клиентами стали родственники и знакомые. В течение 3 лет магазин
          работал онлайн, но по многочисленным просьбам клиентов открылся и
          офлайн-магазин. С апреля 2023 года мы предлагаем качественную одежду
          для детей от 0 до 14 лет, работаем только с проверенными
          производителями из Китая, Турции и США.
        </Text>
        <Image
          source={{
            uri: "https://avatars.mds.yandex.net/get-altay/15223195/2a00000194ab8c65ded07e225b5837097cdf/orig",
          }}
          style={{
            width: screenWidth * 0.9,
            height: 450,
            borderRadius: 20,
          }}
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
}
