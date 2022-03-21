import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';

import { PIZZA_TYPES } from '@utils/pizzaTypes';

import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';
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
import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function Order() {
  const [size, setSize] = useState('');

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack
            onPress={() => { }}
            style={{ marginBottom: 108 }}
          />
        </Header>
        <Photo source={{ uri: 'http://github.com/johnnyfagundes.png' }} />

        <Form>
          <Title>Pizza name</Title>
          <Label>Select a size</Label>
          <Sizes>
            {
              PIZZA_TYPES.map(item => (
                <RadioButton
                  key={item.id}
                  title={item.name}
                  onPress={() => setSize(item.id)}
                  selected={size === item.id}
                />
              ))
            }
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Table number</Label>
              <Input keyboardType='numeric' />
            </InputGroup>

            <InputGroup>
              <Label>Quantity</Label>
              <Input keyboardType='numeric' />
            </InputGroup>

          </FormRow>

          <Price>$0.00</Price>


          <Button
            title='Confirm order'
          />
        </Form>
      </ContentScroll>
    </Container>
  )
}