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
  formatChileDate,
  getStoredFcmPushes,
  mergeAlertasWithFcmPushes,
} from './src/notifications/fcmPushStore';
import NotificacionesIcon from './assets/svg/header/Notificaciones.svg';
import { HtmlText } from './src/notifications/HtmlText';
 
const WIDTH = Dimensions.get('window').height;
function toLineaIconCode(raw) {
  const value = String(raw || '')
    .trim()
    .toUpperCase();

  if (!value || value === 'TR') {
    return null;
  }

  if (value === 'L4A' || value === '4A') {
    return '4A';
  }

  const match = value.match(/^L?([1-9])$/);
  return match ? match[1] : null;
}
 
const styles = StyleSheet.create({
  listContent: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 4,
  },
  item: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconColumn: {
    width: 40,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconSlot: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Globals.COLOR.GRIS_3 || '#AFB2BA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    flex: 1,
    paddingRight: 4,
  },
  title: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  subtitle: {
    color: Globals.COLOR.GRIS_4 || '#43464E',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  body: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  date: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 22,
  },
  metaDate: {
    color: Globals.COLOR.GRIS_4 || '#43464E',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  separator: {
    borderBottomWidth: 1,
    marginHorizontal: 16,
    borderBottomColor: Globals.COLOR.GRIS_3,
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
  const lineasSafe = Array.isArray(lineas) ? lineas : [];
  const iconCodes = lineasSafe.map(toLineaIconCode).filter(Boolean);
  const hasLineIcons = iconCodes.length > 0;
  const arregloTexto = String(text || '')
    .split('<br>')
    .filter(Boolean);

  return (
    <View>
      <View style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.iconColumn}>
            {hasLineIcons ? (
              iconCodes.map((code, i) => (
                <View key={`linea-${code}-${i}`} style={styles.iconSlot}>
                  <TituloCirculoEstacion
                    texto={''}
                    linea={code}
                    tamanoIcono={36}
                  />
                </View>
              ))
            ) : (
              <View style={styles.bellWrap}>
                <NotificacionesIcon
                  width={20}
                  height={20}
                  fill={Globals.COLOR.ROJO_METRO}
                />
              </View>
            )}
          </View>

          <View style={styles.contentColumn}>
            {isFcm ? (
              <>
                <HtmlText
                  html={title || 'Notificación'}
                  style={[styles.title, Estilos.tipografiaMedium]}
                />
                {!!subtitle && (
                  <HtmlText
                    html={subtitle}
                    style={[styles.subtitle, Estilos.tipografiaMedium]}
                  />
                )}
                {!!body && (
                  <HtmlText
                    html={body}
                    style={[styles.body, Estilos.tipografiaLight]}
                  />
                )}
                {!body &&
                  arregloTexto
                    .filter(line => line !== title && line !== subtitle)
                    .map((texto, index) => (
                      <HtmlText
                        key={index}
                        html={texto}
                        style={[styles.body, Estilos.tipografiaLight]}
                      />
                    ))}
                {!!date && (
                  <Text style={[styles.metaDate, Estilos.tipografiaMedium]}>
                    {formatChileDate(date)}
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text style={[styles.date, Estilos.tipografiaMedium]}>
                  {date}
                </Text>
                {arregloTexto.map((texto, index) => (
                  <Text
                    key={index}
                    style={[styles.text, Estilos.tipografiaLight]}>
                    {texto}
                  </Text>
                ))}
              </>
            )}
          </View>
        </View>
      </View>
      <View style={styles.separator} />
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
  setState(prev => ({
    ...prev,
    refreshing: true,
  }));

  try {
    const response = await fetch(state.url);

    const json = await response.json();

    let apiAlertas = [];

    if (response.ok) {
      apiAlertas = mapApiElementsToAlertas(json.Items);
    } else {
      console.log("API Error:", response.status);
    }

    const fcmPushes = await getStoredFcmPushes();

    const merged = mergeAlertasWithFcmPushes(
      apiAlertas,
      fcmPushes,
    );

    setState(prev => ({
      ...prev,
      data: merged,
      refreshing: false,
    }));

  } catch (error) {

    console.log(error);

    try {

      const fcmPushes = await getStoredFcmPushes();

      const merged = mergeAlertasWithFcmPushes(
        [],
        fcmPushes,
      );

      setState(prev => ({
        ...prev,
        data: merged,
        refreshing: false,
      }));

    } catch {

      setState(prev => ({
        ...prev,
        refreshing: false,
      }));

    }

  }

}, [state.url]);
 
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
          <View style={{ marginTop: Dimensions.get('window').height / 2.5 }}>
        </View>
      </SafeAreaView>
    );
  }
 
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
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
  );
};
 
export default Alerta;