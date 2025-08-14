import {SafeAreaView, Dimensions, ActivityIndicator, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Privacy settings configured below are only provided
// to allow a quick start with capturing monitoring data.
// This has to be requested from the user
// (e.g. in a privacy settings screen) and the user decision
// has to be applied similar to this example.

const SLIDER_HEIGHT = Dimensions.get('window').height;
// const SLIDER_WIDTH = Dimensions.get('window').width;
// const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

let getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value != null ? value : null;
  } catch (e) {
    console.log(e);
  }
};

const TiendaMetro = props => {
  const [state, setState] = useState({
    loading: false,
    registro: [],
    url: '',
  });

  useEffect(() => {
    props.navigation.setOptions({title: 'Compra online'});

    getData('tiendaURL').then(value => {
      setState({...state, url: value});

      console.log(value);
    });

    const _unsubscribe = this.props.navigation.addListener('focus', () => {
      getData('tiendaURL').then(value => {
        setState({...state, url: value});

        console.log(value);
      });
    });
    return () => {
      _unsubscribe();
    };
  }, []);

  if (state.url === undefined) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{marginTop: SLIDER_HEIGHT / 2.5}}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <WebView
          source={{
            uri: state.url,
          }}
        />
      </View>
    );
  }
};
export default TiendaMetro;
