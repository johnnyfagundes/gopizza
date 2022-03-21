import React from 'react'
import { TouchableOpacityProps } from 'react-native';

import {
    Container,
    Image,
    Name,
    Description,
    StatusContainer,
    StatusLabel,
    StatusTypeProps
} from './styles';

type Props = TouchableOpacityProps & {
    index: number;
}

export function OrderCard({index, ...rest} : Props) {

    return (
        <Container index={index} {...rest}>
            <Image source={{ uri: 'http://github.com/johnnyfagundes.png' }} />
            <Name>Four cheese</Name>
            <Description>
                Table 5 ⚬ Qnt: 1
            </Description>

            <StatusContainer status='Done'>
                <StatusLabel status='Done'>Preparing</StatusLabel>
            </StatusContainer>
        </Container>
    )

}