import React, { useState } from 'react';
import { Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { OrderCard } from '@components/OrderCard';
import { ItemSeparator } from '@components/ItemSeparator';
import {
  Container,
  Header,
  Title
} from './styles';

export function Orders() {

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <Title>Orders done</Title>
      </Header>


      <FlatList
        data={['1', '2', '3']}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <OrderCard index={index} />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />

    </Container>
  )
}