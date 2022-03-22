import React, { useState, useCallback } from 'react';
import { Alert, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from 'styled-components/native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import happyEmoji from '@assets/happy.png';

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Title,
  MenuHeader,
  MenuItemNumber,
  NewProductButton
}
  from './styles';

import { useAuth } from '@hooks/auth';
import { Search } from '@components/Search';
import { ProductCard, ProductProps } from '@components/ProductCard';

export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([])
  const [search, setSearch] = useState('');

  
  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const { user, singOut } = useAuth();

  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        }) as ProductProps[];

        setPizzas(data);
      })
      .catch(() => Alert.alert('Consulting', 'Something wrong happended'));
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas('');
    }, [])
  );

  function handleSearch() {
    fetchPizzas(search);
  }

  function handleSearchClear() {
    setSearch('');
    fetchPizzas('');
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? 'product': 'order';
    navigation.navigate(route, { id })
  }

  function handleAdd() {
    navigation.navigate('product', {});
  }

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Hi, Admin</GreetingText>
        </Greeting>
        <TouchableOpacity onPress={singOut}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Menu</Title>
        <MenuItemNumber>{pizzas.length} pizzas</MenuItemNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            data={item}
            onPress={() => handleOpen(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24
        }}
      />

      {user?.isAdmin && <NewProductButton
        title="New Pizza"
        type="secondary"
        onPress={handleAdd}
      />}
    </Container>
  )
}