import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Home, Bot, History, MoreHorizontal } from "lucide-react-native";

type Active = "home" | "guard" | "history" | "more";

const items: { key: Active; label: string; href: string; Icon: typeof Home }[] = [
  { key: "home", label: "Home", href: "/dashboard", Icon: Home },
  { key: "guard", label: "Guard", href: "/assistant", Icon: Bot },
  { key: "history", label: "History", href: "/history", Icon: History },
  { key: "more", label: "More", href: "/more", Icon: MoreHorizontal },
];

export function BottomNav({ active }: { active: Active }) {
  return (
    <View style={styles.nav}>
      <View style={styles.container}>
        {items.map(({ key, label, href, Icon }) => {
          const isActive = key === active;
          const color = isActive ? "#1e3a5f" : "#737373";

          return (
            <TouchableOpacity
              key={key}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => console.log(`Navigate to ${href}`)}
            >
              <Icon size={20} color={color} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
});