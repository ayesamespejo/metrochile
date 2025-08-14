import React, { useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Estilos from './Estilos';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import Globals from './Globals';

import Tarjetabip from './assets/svg/tarjetas/TarjetaBip.svg';
import ChevronDown from './assets/svg/flechas/ChevronDown.svg';
import Basurero from './assets/svg/comun/Basurero.svg';

const CeldaFavoritosBip = (props) => {
  const [state, setState] = useState({
    posx: 0,
    inix: 40,
    friction: 2,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, posx: 0 }));
  }, []);

  const restoreState = () => {
    setState((prev) => ({ ...prev, posx: state.inix, friction: 2 }));
    props.ondelete(props.title, props.indice);
  };

  const styles = StyleSheet.create({
    delete: {
      backgroundColor: Globals.COLOR.ROJO_METRO,
      width: 70,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Globals.COLOR.GRIS_1,
      paddingVertical: props.icon ? 0 : 15,
    },
    value: {
      color: '#009688',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: -10,
    },
  });

  const renderRightActions = () => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Animated.View>
          <RectButton style={styles.delete} onPress={restoreState}>
            <Basurero width={20} height={20} fill="#FFFFFF" />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      key={`swipeable-${props.title}-${props.indice}`}
      renderRightActions={renderRightActions}
      friction={state.friction}
      rightThreshold={40}
    >
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {props.icon && (
            <View style={{ marginRight: Dimensions.get('window').width * 0.03 }}>
              <Tarjetabip width={40} height={30} />
            </View>
          )}

          <Pressable
            onPress={() => {
              if (!props.isloading) {
                props.ontitle(props.title, props.indice);
              }
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                Estilos.textoGeneral,
                Estilos.tarjetaYRutasGuardada,
                { width: Dimensions.get('window').width - 160 },
              ]}
            >
              {props.title}
            </Text>
          </Pressable>
        </View>

        {!props.value && (
          <Pressable
            style={{ marginLeft: -12 }}
            onPress={() => {
              if (!props.isloading) {
                props.ontitle(props.title, props.indice);
              }
            }}
          >
            {props.isloading ? (
              <ActivityIndicator style={{ width: 9, height: 16, marginLeft: -15 }} />
            ) : (
              <ChevronDown
                width={20}
                height={20}
                fill={Globals.COLOR.GRIS_3}
                style={{ transform: [{ rotate: '-90deg' }] }}
              />
            )}
          </Pressable>
        )}
      </View>
    </Swipeable>
  );
};

export default CeldaFavoritosBip;
