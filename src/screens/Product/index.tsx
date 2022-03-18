import { ButtonBack } from "@components/ButtonBack";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import {
  Container, Header, Title, DeleteLabel
} from "./styles";

export function Product() {

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header>
        <ButtonBack />
        <Title>Create</Title>
        <TouchableOpacity>
          <DeleteLabel>Delete</DeleteLabel>
        </TouchableOpacity>
      </Header>

    </Container>
  );
}

export default Product;
