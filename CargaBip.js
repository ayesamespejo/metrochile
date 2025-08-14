import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CargaBip = (props) => {
  const [url, setUrl] = useState(null);

  const urlcarga = 'https://movired.cl/metro/app'


   useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      AsyncStorage.getItem("@urlCargaBip").then((url) => {
        console.log(url);
        setUrl(url);
      });
    });

    return unsubscribe; 
  }, []);

    return (
      url &&
        <View style={{flex: 1}}>
        <WebView
          source={{
            uri: props.route?.params?.url ? props.route.params.url : urlcarga,
          }}
        />
      </View>
    );
}

export default CargaBip;
