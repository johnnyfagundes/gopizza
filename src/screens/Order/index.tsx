import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { PIZZA_TYPES } from '@utils/pizzaTypes';
import { useAuth } from '@hooks/auth';

import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { OrderNavigationProps } from '@src/@types/navigation';

import {
  Container,
  ContentScroll,
  Header,
  Photo,
  Sizes,
  Form,
  Title,
  Label,
  InputGroup,
  FormRow,
  Price
} from './styles';
import { ProductProps } from '@components/ProductCard';

type PizzaResponse = ProductProps & {
  price_sizes: {
    [key: string]: number;
  }
}

export function Order() {
  const [size, setSize] = useState('');
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [sendindOrder, setSendingOrder] = useState(false);

  const navigation = useNavigation();

  const { user } = useAuth();
  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;

  const amount = size ? pizza.price_sizes[size] * quantity : '0,00';

  function handleGoBack() {
    navigation.goBack();
  }

  function handleOrder() {
    if (!size) {
      return Alert.alert('Order', `Select the size of the pizza`)
    }

    if (!tableNumber) {
      return Alert.alert('Order', `Enter the number of the table`)
    }

    if (!quantity) {
      return Alert.alert('Order', `Enter the number of the quantity`)
    }

    setSendingOrder(true);

    firestore()
      .collection('order')
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        table_number: tableNumber,
        status: 'Preparing',
        waiter_id: user?.id,
        image: pizza.photo_url
      })
      .then(() => navigation.navigate('home'))
      .catch(() => {
        Alert.alert('Order', 'Something wrong happended')
        setSendingOrder(false);
      })
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then(response => {
          console.log(response.data());
          setPizza(response.data() as PizzaResponse)
        })
        .catch(() => Alert.alert('Order', 'Something went wrong'));
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack
            onPress={handleGoBack}
            style={{ marginBottom: 108 }}
          />
        </Header>
        <Photo source={{ uri: pizza.photo_url }} />

        <Form>
          <Title>{pizza.name}</Title>
          <Label>Select a size</Label>
          <Sizes>
            {
              PIZZA_TYPES.map(item => (
                <RadioButton
                  key={item.id}
                  title={item.name}
                  onPress={() => {
                    setSize(item.id)
                    console.log(item.id)
                  }}
                  selected={size === item.id}
                />
              ))
            }
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Table number</Label>
              <Input keyboardType='numeric' onChangeText={setTableNumber} />
            </InputGroup>

            <InputGroup>
              <Label>Quantity</Label>
              <Input
                keyboardType='numeric'
                onChangeText={(value) => setQuantity(Number(value))} />
            </InputGroup>

          </FormRow>

          <Price>Price of ${amount}</Price>


          <Button
            title='Confirm order'
            onPress={handleOrder}
            isLoading={sendindOrder}
          />
        </Form>
      </ContentScroll>
    </Container>
  )
}