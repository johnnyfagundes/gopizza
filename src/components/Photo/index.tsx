import React from 'react'

import { Image, Placeholder, PlaceholderTitle } from './styles';

type Props = {
    uri: string | null;
}

export function Photo({uri} : Props) {
    if (uri) {
        return <Image source={{ uri}} />
    }

    return (
        <Placeholder>
            <PlaceholderTitle>None image{'\n'}loaded</PlaceholderTitle>
        </Placeholder>
    )

}