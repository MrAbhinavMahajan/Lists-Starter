import React, { memo } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Character } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CharacterListItem = {
  character: Character;
};

export const CHARACTER_LIST_ITEM_HEIGHT = SCREEN_WIDTH;
export const CHARACTER_LIST_ITEM_WIDTH = SCREEN_WIDTH;

const CharacterListItem = ({ character }: CharacterListItem) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{character.name}</Text>
      <Image source={{ uri: character.image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: CHARACTER_LIST_ITEM_HEIGHT,
    width: CHARACTER_LIST_ITEM_WIDTH,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkslategrey",
    alignSelf: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default memo(
  CharacterListItem,
  (prevProps, nextProps) => prevProps.character.id == nextProps.character.id
);
