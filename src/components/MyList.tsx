import React, { useEffect, useState } from "react";
import character from "../data/character.json";
import CharacterListItem from "./CharacterListItem";
import { ActivityIndicator, FlatList } from "react-native";

const MyList = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const makeAPICall = async () => {
      setLoading(true);
      const response = await fetch(`https://rickandmortyapi.com/api/character`);
      const responseJson = await response.json();
      setItems(responseJson.results);
      setLoading(false);
    };

    makeAPICall();
    return () => {};
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => <CharacterListItem character={item} />}
      contentContainerStyle={{ gap: 50 }}
    />
  );
};

export default MyList;
