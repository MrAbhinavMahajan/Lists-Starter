import React from "react";
import character from "../data/character.json";
import CharacterListItem from "./CharacterListItem";
import { FlatList } from "react-native";

const MyList = () => {
  return (
    <FlatList
      data={character.results}
      renderItem={({ item, index }) => <CharacterListItem character={item} />}
      contentContainerStyle={{ gap: 50 }}
    />
  );
};

export default MyList;
