import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

import { useAuth } from '@hooks/auth';

import { OrderCard, OrderProps } from '@components/OrderCard';
import { ItemSeparator } from '@components/ItemSeparator';
import {
  Container,
  Header,
  Title
} from './styles';

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderProps[]>([]);

  function handlePizzaDelivered(id: string) {
    Alert.alert('Order', 'Do you confirm the pizza was delivered?',[
      {
        text: 'No',
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: () => {
          firestore().collection('order').doc(id).update({
            status: 'Delivered'
          });
        }
      }
    ]);
  }

  useEffect(() => {
    const subscribe = firestore()
      .collection('order')
      .where('waiter_id', '==', user?.id)
      .onSnapshot(querySnapShot => {
        const data = querySnapShot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as OrderProps[];

        setOrders(data);
      })

    return () => subscribe();
  }, [])

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <Title>Orders done</Title>
      </Header>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <OrderCard
            index={index}
            data={item}
            disabled={item.status === 'Delivered'}
            onPress={() => handlePizzaDelivered(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />

    </Container>
  )
}