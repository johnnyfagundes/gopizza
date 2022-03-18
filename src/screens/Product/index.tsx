import { Photo } from "@components/Photo";
import React, { useState } from "react";
import { Platform, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import firestore from "@react-native-firebase/firestore";

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  PickImageButton,
  Upload,
  Label,
  InputGroup,
  InputGroupHeader,
  Form,
  MaxCharacters
} from "./styles";
import { ButtonBack } from "@components/ButtonBack";
import { InputPrice } from "@components/InputPrice";
import { Input } from "@components/Input";
import { Button } from "@components/Button";


export function Product() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4]
      });

      if (!result.cancelled) {
        setImage(result.uri)
      }
    }
  }


  async function handleAdd() {
    if (!name.trim()) {
      return Alert.alert('Register', `Enter the name of the pizza`)
    }

    if (!description.trim()) {
      return Alert.alert('Register', `Enter the description of the pizza`)
    }

    if (!image) {
      return Alert.alert('Register', `Select the image of the pizza`)
    }

    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert('Register', `Enter all prices for all pizza sizes`)
    }
  }

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <ButtonBack />
          <Title>Create</Title>
          <TouchableOpacity>
            <DeleteLabel>Delete</DeleteLabel>
          </TouchableOpacity>
        </Header>

        <Upload>
          <Photo uri={image} />
          <PickImageButton
            title={'Charge'}
            type="secondary"
            onPress={handlePickerImage}
          />
        </Upload>

        <Form>

          <InputGroup>
            <Label>Name</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Description</Label>
              <MaxCharacters>0 of 60 caracters</MaxCharacters>
            </InputGroupHeader>
            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Size and Prices</Label>
            <InputPrice
              size="P"
              onChangeText={setPriceSizeP}
              value={priceSizeP}
            />
            <InputPrice
              size="M"
              onChangeText={setPriceSizeM}
              value={priceSizeM}
            />
            <InputPrice
              size="G" onChangeText={setPriceSizeG}
              value={priceSizeG}
            />
          </InputGroup>

          <Button
            title="Save pizza"
            isLoading={isLoading}
            onPress={handleAdd}
          />

        </Form>
      </ScrollView>
    </Container>
  );
}

export default Product;
