import React, { useEffect, useState } from "react";
import CharacterListItem from "./CharacterListItem";
import { ActivityIndicator, FlatList } from "react-native";

const MyList = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const initialPageUrl = "https://rickandmortyapi.com/api/character";
  const [pageURL, setPageURL] = useState(initialPageUrl);

  const fetchItems = async (url: string) => {
    if (loading) {
      // * Throttling to avoid multiple API call at same time
      return;
    }
    console.log("Fetch Items::", url);
    setLoading(true);
    const response = await fetch(url);
    const responseJson = await response.json();
    setItems((existingItems) => [...existingItems, ...responseJson.results]);
    setPageURL(responseJson.info.next);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(initialPageUrl);
  }, []);

  const onEndReached = () => {
    fetchItems(pageURL);
  };

  const onRefresh = () => {
    fetchItems(initialPageUrl);
  };

  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => <CharacterListItem character={item} />}
      contentContainerStyle={{ gap: 50 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={3}
      ListFooterComponent={() => loading && <ActivityIndicator />}
      onRefresh={onRefresh}
    />
  );
};

export default MyList;

/*
# Observation-1
 * fetchItems was being called 2 times initially
(one call by useEffect and one call by onEndReached)

# Observation-2
 ! if there's nothing in the footer & data provided is empty then "onEndReached" won't be called
 * so it's important to have initial load using useEffect for fetching data

 # Observation-3
 * basically FlatList calls onEndReached when last item is fully visible
 ! user will scroll faster he will be able to see loading indicator for a while
 * as an improvement we can set onEndReachedThreshold for customizing FlatList when to call onEndReached 

# Observation-4
 * we won't be able to find onEndReached in React Native documentation since these are the properties of base class VirtualizedList
 */
