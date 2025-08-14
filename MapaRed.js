import {SafeAreaView, Dimensions, ActivityIndicator, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';

const SLIDER_HEIGHT = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

const MapaRed = () => {
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    // loading: false,
    registro: [],
    urlPlanoRed:
      'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/planored',
  });

  useEffect(() => {
    // getRegistro();
  },[]);

//   const getRegistro = () => {
//     setLoading(true);
//     fetch(state.urlPlanoRed)
//       .then(res => res.json())
//       .then(res => {
//         setState({
//           ...state,
//           plano: res.plano,
//         });
//         setLoading(false);
//       });
//   };

  // var url = state.plano;
  var url= 'https://d37nosr7rj2kog.cloudfront.net/planoDeRedV2.pdf'
  console.log(`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`);
  if (url == undefined) {
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
            uri: `https://docs.google.com/viewer?embedded=true&url=${url}`,
          }}
        />
      </View>
    );
  }
};

export default MapaRed;
