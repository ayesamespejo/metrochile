import { StyleSheet, Text, View, Dimensions, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Estilos from '../Estilos'

const TarjetaBip = ({numeroImagen, numeroBip, productoCliente, saldoTarjetaBip}) => {  

  const ancho = Dimensions.get('window').width
  const styles = StyleSheet.create({
    contenedorTarjeta: {
      borderRadius: 16,
      paddingTop: 20,
    },
    contenedorImage: {
      marginLeft: ancho * 0.01,
      width: ancho * 0.86,
      height: ancho * 0.56,
      borderTopStartRadius: 15,
      borderBottomStartRadius: 15,
      overflow: 'hidden',
    },
    imagen: {
      marginTop: ancho * -0.02,
      marginLeft: ancho * -0.01,
      width: ancho * 0.86,
      height: ancho * 0.6,
      resizeMode: 'contain',
    },
    contenedroNumeroTarjeta: {
      width: ancho * 0.558,
      padding: ancho * 0.01,
      backgroundColor: '#FFFFFF',
      transform: [{ rotate: '90deg' }],
      // marginTop: Platform.OS === 'ios' ? ancho * -0.187 : ancho * -0.187,
      marginTop: ancho * -0.187,
      marginLeft: ancho * 0.617,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
    },
    textoNumeroTarjeta: {
      textAlign: 'center',
      fontSize: 18,
    },
    contenedorSaldo: {
      marginLeft: ancho * 0.01,
      marginTop: ancho * -0.25,
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      width: ancho * 0.36,
      height: ancho * 0.12,
      borderTopEndRadius: 25,
      borderBottomEndRadius: 25,
    },
    textoSaldo: {
      fontSize: 36,
      marginTop: 'auto',
      marginBottom: 'auto',
      fontWeight: 'bold',
      color: 'white',
      color: '#000000',
      textAlign: 'center',
      fontSize: 30,
    },
  })

  const [saldoTarjeta, setSaldoTarjeta] = useState('$ 0');
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    // Si no se recibe el saldo, se obteine desde la API
    if (saldoTarjetaBip) {
      setLoading(false)
      setSaldoTarjeta(currencyFormat(saldoTarjetaBip))
    } else {
      getSaldoTarjeta(numeroBip, productoCliente)
    }
  }, [])

  function currencyFormat(num) {
    const numero=Number(num)
    return '$ ' + numero.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
 }

  const getSaldoTarjeta = (bipNumber, productoCliente) => {
    // Se obtienen los arámetros de consulta bip
    AsyncStorage.getItem('@consultaSaldoBip').then((datosTexto) => {
        console.log(datosTexto)
      const datos = JSON.parse(datosTexto)
      fetch(datos.url, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': datos.xApiKey,
          },
          body: JSON.stringify({
            numero: bipNumber,
            comercio: datos.comercio,
            producto_cliente: productoCliente
          })
      })        
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData.estado) {
            console.log('API respondio....')
            const saldoTarjetaTexto = currencyFormat(responseData.saldo_disponible)
            setSaldoTarjeta(saldoTarjetaTexto)
            setLoading(false);
        } else {
          setLoading(false);
          Alert.alert('Error al obtener el saldo consultado: ', responseData.estado)
        }
      }).catch((error) => {
        setLoading(false);
        Alert.alert(`Tu consulta no se pudo${'\n'}llevar a cabo`, 'Por favor, intenta nuevamente.', [{text: 'Aceptar'}])
      }
      )
    })
  }

  return (
    <>
        {loading && <View style={{marginTop: '10%' }}>
            <ActivityIndicator size='large' color='#43464E' />
        </View>}

        {!loading && <View style={{paddingLeft: ancho * 0.03 }}>
            <View style={styles.contenedorTarjeta}>
                <View style={styles.contenedorImage}>
                <Image
                    style={styles.imagen}
                    source={{ uri: `https://d37nosr7rj2kog.cloudfront.net/tarjetaBip${numeroImagen}.jpg` }}
                />
                </View>
                <View style={styles.contenedorSaldo}>
                <Text style={[styles.titulo, Estilos.tipografiaBold, styles.textoSaldo]}>
                    {saldoTarjeta}
                </Text>
                </View>
                <View style={styles.contenedroNumeroTarjeta}>
                <Text style={[Estilos.tipografiaBold, styles.textoNumeroTarjeta]}>{`Nro. ${numeroBip}`}</Text>
                </View>
            </View>
        </View>}
    </>
  )
}

export default TarjetaBip
