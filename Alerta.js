import React, { useState, useEffect, useCallback } from 'react';
import {
  Pressable,
  RefreshControl,
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  Text,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import Estilos from './Estilos';
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion';
import Globals from './Globals';
import ConfigNotificaciones from './assets/svg/notificaciones/configNotificaciones.svg';
import {
  FCM_PUSH_SAVED_EVENT,
  getStoredFcmPushes,
  mergeAlertasWithFcmPushes,
} from './src/notifications/fcmPushStore';

const WIDTH = Dimensions.get('window').height;

const styles = StyleSheet.create({
  date: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  subtitle: {
    color: Globals.COLOR.GRIS_4 || '#666666',
    fontSize: 14,
    marginBottom: 4,
  },
  metaDate: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  menu: {
    margin: 10,
    width: 25,
    height: 30,
    resizeMode: 'contain',
  },
});

const Item = ({ date, text, lineas, source, title, subtitle, body }) => {
  const isFcm = source === 'fcm';
  const lineasSafe = Array.isArray(lineas) && lineas.length > 0 ? lineas : ['TR'];
  const arregloTexto = String(text || '').split('<br>').filter(Boolean);
  const [state, setState] = useState({
    url: 'https://tk9ktk356f.execute-api.us-east-1.amazonaws.com/UAT/data',
    data: [],
    modalVisible: false,
    refreshing: true,
  })

  return (
    <View>
      <View style={{ flexDirection: 'row', left: 20 }}>
        <View style={{ justifyContent: 'center' }}>
          {lineasSafe.map((e, i) => (
            <TituloCirculoEstacion
              key={`linea-${e}-${i}`}
              texto={''}
              linea={String(e).substring(1).toUpperCase()}
              tamanoIcono={32}
            />
          ))}
        </View>
        <View
          style={{
            width: Dimensions.get('window').width - 120,
            marginBottom: 20,
            marginLeft: 10,
          }}
        >
          {isFcm ? (
            <>
              <Text style={[styles.date, Estilos.tipografiaMedium]}>
                {title || 'Notificación'}
              </Text>
              {!!subtitle && (
                <Text style={[styles.subtitle, Estilos.tipografiaMedium]}>
                  {subtitle}
                </Text>
              )}
              {!!body && (
                <Text style={[styles.text, Estilos.tipografiaLight]}>{body}</Text>
              )}
              {!body &&
                arregloTexto
                  .filter(line => line !== title && line !== subtitle)
                  .map((texto, index) => (
                    <Text
                      key={index}
                      style={[styles.text, Estilos.tipografiaLight]}>
                      {texto}
                    </Text>
                  ))}
              {!!date && (
                <Text style={[styles.metaDate, Estilos.tipografiaMedium]}>
                  {date}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={[styles.date, Estilos.tipografiaMedium]}>{date}</Text>
              {arregloTexto.map((texto, index) => (
                <Text key={index} style={[styles.text, Estilos.tipografiaLight]}>
                  {texto}
                </Text>
              ))}
            </>
          )}
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          marginHorizontal: 10,
          borderBottomColor: Globals.COLOR.GRIS_3,
        }}
      />
    </View>
  );
};

const Alerta = props => {
  const [state, setState] = useState({
    url: '',
    data: [],
    modalVisible: false,
    refreshing: true,
  });

  const convertChileanTZ = (date, tzString) => {
    return new Date(
      (typeof date === 'string' ? new Date(date) : date).toLocaleString(
        'es-CL',
        { timeZone: tzString },
      ),
    );
  };

  const getTextoFinal = txt => {
    let texto = removeURLS(txt.replace(/<[^>]*>?/gm, ''));
    let indexRevisa = texto.toLowerCase().indexOf('revisa');
    let textoFinal = texto;
    if (indexRevisa != -1) {
      textoFinal = texto.substring(0, indexRevisa);
    }
    return textoFinal.replace(/(\r\n|\r|\n|\\n)/g, '<br>');
  };

  const removeURLS = txt => {
    var comps = txt.split(' ');
    comps.forEach(w => {
      if (w.indexOf('http://' != -1) || w.indexOf('https://') != -1) w = '';
    });
    return comps.join(' ');
  };

  const mapApiElementsToAlertas = elements => {
    let alertas = [];

    elements
      .filter(element => element.timestamp != undefined)
      .forEach(element => {
        let date = convertChileanTZ(element.timestamp, 'America/Santiago');
        let formatDate = element.fecha;
        let lineasAfectadas = [];
        try {
          lineasAfectadas = element.cod.split(',');
        } catch {
          lineasAfectadas = element.cod;
        }
        let textoFinal = getTextoFinal(element.text);
        alertas.push({
          date: formatDate,
          text: textoFinal,
          linea: element.cod,
          dateOrganizativaAndroid: date,
          lineas: lineasAfectadas,
          dateOrganizativaIOS: new Date(element.timestamp),
          source: 'api',
        });
      });

    return alertas;
  };

  const getDatos = useCallback(async () => {
    setState(prev => ({ ...prev, refreshing: true }));

    try {
      const { url } = state
    setState({ ...state, refreshing: true })
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
         getStoredFcmPushes();

       let apiAlertas = []; 
       if(response.ok){
          const  elements = json.Items;
           apiAlertas = mapApiElementsToAlertas(elements);
       } else {
        console.log(`API error: ${response.status}`);
       }
      
       const merged = mergeAlertasWithFcmPushes(apiAlertas, fcmPushes);
       setState(prev => ({ ...prev, data: merged, refreshing: false }));      

      })
/*
      const [response, fcmPushes] = await Promise.all([
        
        signedFetch('GET', '/data'),

        getStoredFcmPushes(),
      ]);

      let apiAlertas = [];

      if (response.ok) {
        const json = await response.json();
        console.log('informacion: ', json);
        const elements = json.Items || [];
        apiAlertas = mapApiElementsToAlertas(elements);
      } else {
        console.log(`API error: ${response.status}`);
      }

      const merged = mergeAlertasWithFcmPushes(apiAlertas, fcmPushes);
      setState(prev => ({ ...prev, data: merged, refreshing: false }));*/
    } catch (error) {
      console.warn('[Alerta] Error cargando notificaciones:', error);
      try {
        const fcmPushes = await getStoredFcmPushes();
        const merged = mergeAlertasWithFcmPushes([], fcmPushes);
        setState(prev => ({ ...prev, data: merged, refreshing: false }));
      } catch {
        setState(prev => ({ ...prev, refreshing: false }));
      }
    }
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <Pressable
          style={{ width: 50, marginRight: -20 }}
          onPress={() => {
            // nav.push('Configuración')
          }}
        >
          <ConfigNotificaciones
            width={24}
            height={24}
            fill={Globals.COLOR.GRIS_3}
          />
        </Pressable>
      ),
    });

    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      getDatos();
    });

    const unsubscribePush = DeviceEventEmitter.addListener(
      FCM_PUSH_SAVED_EVENT,
      () => {
        getDatos();
      },
    );

    getDatos();

    return () => {
      unsubscribeFocus();
      unsubscribePush.remove();
    };
  }, [getDatos, props.navigation]);

  const renderItem = ({ item }) => {
    return (
      <Item
        date={item.date}
        text={item.text}
        lineas={item.lineas || ['TR']}
        source={item.source}
        title={item.title}
        subtitle={item.subtitle}
        body={item.body}
      />
    );
  };

  const updateData = () => {
    getDatos();
  };

  const { data } = state;
  if (state.refreshing && data.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: WIDTH / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View>
      <View
        style={{
          height: Dimensions.get('window').height - 65,
          paddingHorizontal: WIDTH * 0.02,
          paddingBottom: WIDTH * 0.1,
        }}
      >
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={updateData}
              refreshing={state.refreshing}
            />
          }
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id || `${item.source || 'item'}_${index}_${item.date}`
          }
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={[styles.text, Estilos.tipografiaLight]}>
                No hay notificaciones por ahora.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Alerta;
