import { Pressable, Text } from "react-native";

const ModalTrigger = ({
  onPress,
  children,
}: {
  onPress: any;
  children: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 rounded-xl bg-black items-center justify-center"
    >
      <Text className="text-white text-sm font-medium">{children}</Text>
    </Pressable>
  );
};

export default ModalTrigger;
