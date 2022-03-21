import { Photo } from "@components/Photo";
import React, { useState, useEffect } from "react";
import { Platform, TouchableOpacity, ScrollView, Alert, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import { useRoute, useNavigation } from "@react-navigation/native";
import { ProductNavigationProps } from "@src/@types/navigation";

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
import { ProductProps } from "@src/components/ProductCard";

type PizzaResponse = ProductProps & {
  photo_path: string;
  price_sizes: {
    p: string;
    m: string;
    g: string;
  }
}


export function Product() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoPath, setPhotoPath] = useState('');
  const navigation = useNavigation();

  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

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

    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore()
      .collection('pizzas')
      .add({
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        price_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath
      })
      .then(() => navigation.navigate('home'))
      .catch(() => Alert.alert('Register', 'Something wrong happended'))
      .finally(() => setIsLoading(false))
  }

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleDelete() {

    firestore()
      .collection('pizzas')
      .doc(id)
      .delete()
      .then(() => {
        storage()
        .ref(photoPath)
        .delete()
        .then(() => {
          navigation.navigate('home');
        })
      })
      .catch(() => Alert.alert('Register', 'Something wrong happended'))
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then(response => {
          const product = response.data() as PizzaResponse;

          setName(product.name);
          setImage(product.photo_url);
          setDescription(product.description);
          setPriceSizeP(product.price_sizes.p);
          setPriceSizeM(product.price_sizes.m);
          setPriceSizeG(product.price_sizes.g);
          setPhotoPath(product.photo_path);

        })
        .catch(() => Alert.alert('Consulting', 'Something wrong happended'));
    }
  }, [id])

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <ButtonBack onPress={handleGoBack} />
          <Title>Create</Title>
          {id ?
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Delete</DeleteLabel>
            </TouchableOpacity>
            : <View style={{ width: 20 }} />
          }
        </Header>

        <Upload>
          <Photo uri={image} />
          {
            !id &&
            <PickImageButton
              title={'Charge'}
              type="secondary"
              onPress={handlePickerImage}
            />
          }
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

          {
            !id &&
            <Button
              title="Save Pizza"
              isLoading={isLoading}
              onPress={handleAdd}
            />
          }

        </Form>
      </ScrollView>
    </Container>
  );
}

export default Product;
