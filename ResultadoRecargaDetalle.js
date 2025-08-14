import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  FlatList,
  Image,
} from 'react-native';
import Estilos from './Estilos';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Globals from './Globals';
import TarjetaBip from './assets/svg/tarjetas/TarjetaBip.svg'

// const bip_icon = require('./assets/bip_icon.png');

const ResultadoRecargaDetalle = props => {
  // static bips = [];

  var codigobip = props.route.params.data;

  const [state, setState] = useState({
    numeroBip2: '',
    registro: [],
    loading: false,
    numeroBip: '',
    bips: [],
    vermas: false,
    // urlVoucher: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/voucher/cantidad?numero=${codigobip}&cantidad=10`,
    urlVoucher: `https://s7ibm5ar0f.execute-api.us-east-1.amazonaws.com/UAT/voucherglue/cantidad?numero=${codigobip}&cantidad=10`,
  });

  const getRegistro = () => {
    setState({...state, loading: true});
    fetch(state.urlVoucher)
      .then(res => res.json())
      .then(res => {
        setState({
          ...state,
          data2: res,
          data: res,
          registro: res.registro,
          loading: false,
        });
      });
  };

  const contador = (item, item2) => {
    var valor = item;
    var valor2 = item2;
    setState({...state, numeroBip2: valor2});
    console.log(state.numeroBip2, valor);
    if (valor == 10) {
      return (
        <Pressable
          style={{
            margin: '5%',
            alignContent: 'center',
            alignItems: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            props.navigation.push('ResultadoRecargaDetalle', {
              data: state.numeroBip2,
            })
          }>
          <Text
            style={[
              Estilos.tipografiaMedium,
              {color: '#43464E', fontSize: 10},
            ]}>
            {' '}
            ver más {'>>'}{' '}
          </Text>
        </Pressable>
      );
    }
  };

  const error = () => {
    if (state.registro == undefined) {
      return (
        <>
          <Text
            style={[
              Estilos.tipografiaLight,
              Estilos.subtitulos,
              {color: '#43464E', flex: 1, textAlign: 'center', zIndex: 2},
            ]}>
            Sin registros para esta tarjeta.
          </Text>
        </>
      );
    }
  };

  useEffect(() => {
    getRegistro();
  });

  const displayResultado = codigobipPaso => {
    var codigobipPaso = props.route.params.data;

    return (
      <View>
        <View
          style={{backgroundColor: Globals.COLOR.GRIS_1, margin: '5%', borderRadius: 16}}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: '20%',
              height: 50,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{flex: 0.2, alignSelf: 'center', alignContent: 'center'}}>
                <TarjetaBip width={40} height={30} />
              {/* <Image
                source={bip_icon}
                style={{
                  alignSelf: 'flex-end',
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}
              /> */}
            </View>
            <View
              style={{
                flex: 0.4,
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  Estilos.tipografiaLight,
                  Estilos.subtitulos,
                  {color: '#43464E', textAlign: 'center', marginLeft: '5%'},
                ]}>
                Tarjeta #
              </Text>
            </View>
            <View style={{flex: 0.5, alignSelf: 'center'}}>
              <Text
                style={[
                  Estilos.tipografiaMedium,
                  Estilos.bajada,
                  {color: '#000000', textAlign: 'left', marginLeft: '5%'},
                ]}>
                {codigobipPaso}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Globals.COLOR.GRIS_1,
            margin: '5%',
            marginTop: '-1%',
            borderRadius: 16,
          }}>
          <Pressable style={{zIndex: 2}}>
            <View
              style={{
                backgroundColor: Globals.COLOR.GRIS_1,
                flex: 1,
                flexDirection: 'row',
                marginTop: '1%',
                marginHorizontal: '5%',
                zIndex: 2,
              }}>
              {error(codigobipPaso)}
            </View>

            <FlatList
              data={state.registro}
              renderItem={({item}) => (
                <>
                  <>
                    <View
                      style={{
                        backgroundColor: Globals.COLOR.GRIS_1,
                        flex: 1,
                        flexDirection: 'row',
                        marginTop: '3%',
                      }}>
                      <Text
                        style={[
                          Estilos.tipografiaLight,
                          {
                            color: '#43464E',
                            fontSize: 14,
                            flex: 0.5,
                            lineHeight: 20,
                            textAlign: 'left',
                            marginLeft: '3%',
                          },
                        ]}>
                        {item[3]}
                      </Text>
                      <Text
                        style={[
                          Estilos.tipografiaLight,
                          {
                            color: '#43464E',
                            fontSize: 14,
                            flex: 0.5,
                            lineHeight: 20,
                            textAlign: 'right',
                            marginRight: '13%',
                          },
                        ]}>
                        {item[4]}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: Globals.COLOR.GRIS_1,
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: '-7%',
                      }}>
                      <Text
                        style={[
                          Estilos.tipografiaMedium,
                          Estilos.bajada,
                          {
                            color: '#43464E',
                            flex: 0.7,
                            fontSize: 16,
                            lineHeight: 20,
                            textAlign: 'left',
                            marginLeft: '10%',
                            margin: '3%',
                          },
                        ]}>
                        {item[2]}
                      </Text>
                      <Text
                        style={[
                          Estilos.tipografiaMedium,
                          Estilos.bajada,
                          {
                            color: '#43464E',
                            flex: 0.3,
                            fontSize: 16,
                            lineHeight: 20,
                            textAlign: 'right',
                            marginRight: '1%',
                            margin: '3%',
                          },
                        ]}>
                        $ {item[6]}
                      </Text>
                      <FontAwesome5
                        style={{
                          flex: 0.15,
                          color: '#151f6d',
                          fontSize: 17,
                          textAlign: 'center',
                        }}
                        name={'plus-circle'}
                        onPress={() =>
                          props.navigation.push('VoucherDigital', {
                            data: item[0],
                            data2: item[10],
                          })
                        }
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: Globals.COLOR.GRIS_3,
                        width: 400,
                        height: 1,
                        marginTop: 1,
                        marginBottom: 10,
                      }}
                    />
                    {contador(item[19], codigobipPaso)}
                  </>
                </>
              )}
            />
          </Pressable>
          {state.loading == false && (
            <View
              style={{
                backgroundColor: Globals.COLOR.GRIS_1,
                width: '100%',
                height: 8,
                marginTop: -14,
                marginBottom: 10,
                borderRadius: 16,
                zIndex: 1,
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={{margin: 2}}>
        {displayResultado()}
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator
            style={{
              marginTop: 10,
              display: state.loading ? 'flex' : 'none',
            }}
            size="large"
            color="#43464E"
          />
        </View>
        <View style={{height: 10}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultadoRecargaDetalle;
