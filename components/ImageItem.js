import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions , Image} from 'react-native';

const ImageItem =(props)=> {

        return (
            <View
            style={{
              backgroundColor: '#4D243D',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              margin: 1,
              height: props.height, // approximate a square
            }}
          >
            <Image
              source={{ uri: props.src }}
              style={{
                width: props.w,
                height:props.h
            }}></Image>
          </View>
        );
};

export default ImageItem;