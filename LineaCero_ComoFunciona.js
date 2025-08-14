import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Dimensions, Image, View, StyleSheet, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Estilos from './Estilos'
import Video from 'react-native-video'

const SLIDER_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9)
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 0.95)

const styles = StyleSheet.create({
  boxVideo: {
    position: 'relative',
    height: ITEM_HEIGHT,
    marginTop: SLIDER_WIDTH * 0.05,
    width: SLIDER_WIDTH * 0.9,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container1: {
    flex: 1,
    margin: 1,
    width: SLIDER_WIDTH,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  contenedorTexto: { 
    flex: 1, 
    justifyContent: 'center',
    padding: SLIDER_WIDTH * 0.05, 
  },
  texto: [
    Estilos.textoGeneral,
    {
      marginRight: SLIDER_WIDTH * 0.1,
      marginLeft: SLIDER_WIDTH * 0.05,
    },
  ],
  textoIzq: [
    Estilos.textoGeneral,
    {
      marginLeft: SLIDER_WIDTH * 0.15,
    },
  ],
  textoDer: [
    Estilos.textoGeneral,
    {
      marginLeft: SLIDER_WIDTH * 0,
    },
  ],
  container: {
    width: SLIDER_WIDTH,
    height: ITEM_WIDTH * '0.45',
    backgroundcolor: 'white',
  },
  contenedorDerecho: {
    backgroundcolor: 'white',
    //marginRight: '1%',
    width: SLIDER_WIDTH,
  },
  contenedorIzquierdo: {
    backgroundcolor: 'white',
    width: SLIDER_WIDTH,
  },
  circulo: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
})

const LineaCero_ComoFunciona = (props) => {
  const codigoEstacion = props.route.params.codigo
  const [loading, setLoading] = useState(false)
  const urlIntermodalidad = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/intermodalidad?estacion=${codigoEstacion}&intermodal=Linea_Cero&tipo=`
  const [texto1, setTexto1] = useState('')
  const [texto2, setTexto2] = useState('')
  const [texto3, setTexto3] = useState('')
  const [texto4, setTexto4] = useState('')
  const [texto5, setTexto5] = useState('')
  const [texto6, setTexto6] = useState('')

  useEffect(() => {
    props.navigation.setOptions({ title: 'Línea Cero' })
    getRegistro()
  }, [])

  const getRegistro = () => {
    setLoading(true)
    fetch(urlIntermodalidad)
      .then((res) => res.json())
      .then((res) => {
        setTexto1(res.estacion[0][7])
        setTexto2(res.estacion[0][8])
        setTexto3(res.estacion[0][9])
        setTexto4(res.estacion[0][10])
        setTexto5(res.estacion[0][11])
        setTexto6(res.estacion[0][12])
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SLIDER_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container1, { flex: 1 }]}>
      <ScrollView>
        <Text
          style={[
            Estilos.textoTitulo,
            {
              marginLeft: SLIDER_WIDTH * 0.3,
              marginTop: SLIDER_WIDTH * 0.08,
            },
          ]}
        >
          ¿Cómo Funciona?
        </Text>
        {/*Contenedor numero 1 Izquierdo*/}
        <View style={[styles.container]}>
          <View style={[styles.contenedorIzquierdo, { flex: 1, flexDirection: 'row' }]}>
            <Image source={require('./assets/imagenes/intermodalidad/cf1.png')} style={[styles.circulo, { marginLeft: -30 }]} />
            <View style={styles.contenedorTexto}>
              <Text style={styles.textoDer}>{texto1}</Text>
            </View>
          </View>
        </View>
        {/*Contenedor numero 2 Derecho*/}
        <View style={[styles.container]}>
          <View style={[styles.contenedorDerecho, { flex: 1, flexDirection: 'row' }]}>
          <View style={styles.contenedorTexto}>
              <Text style={styles.textoIzq}>{texto2}</Text>
            </View>
            <Image source={require('./assets/imagenes/intermodalidad/cf2.png')} style={[styles.circulo, { marginRight: -25 }]} />
          </View>
        </View>
        {/*Contenedor numero 3 Izquierdo*/}
        <View style={[styles.container]}>
          <View style={[styles.contenedorIzquierdo, { flex: 1, flexDirection: 'row' }]}>
            <Image source={require('./assets/imagenes/intermodalidad/cf3.png')} style={[styles.circulo, { marginLeft: -30 }]} />
            <View style={styles.contenedorTexto}>
              <Text style={styles.textoDer}>{texto3}</Text>
            </View>
          </View>
        </View>
        {/*Contenedor numero 4 Derecho*/}
        <View style={[styles.container]}>
          <View style={[styles.contenedorDerecho, { flex: 1, flexDirection: 'row' }]}>
          <View style={styles.contenedorTexto}>
              <Text style={styles.textoIzq}>{texto4}</Text>
            </View>
            <Image source={require('./assets/imagenes/intermodalidad/cf4.png')} style={[styles.circulo, { marginRight: -25 }]} />
          </View>
        </View>

        {/*Contenedor numero 5 Izquierdo*/}
        <View style={[styles.container]}>
          <View style={[styles.contenedorIzquierdo, { flex: 1, flexDirection: 'row' }]}>
            <Image source={require('./assets/imagenes/intermodalidad/cf5.png')} style={[styles.circulo, { marginLeft: -30 }]} />
            <View style={styles.contenedorTexto}>
              <Text style={styles.textoDer}>{texto5}</Text>
            </View>
          </View>
        </View>
        {/*Contenedor numero 6 Derecho*/}
        <View style={[styles.container]}>
          <View style={[styles.contenedorDerecho, { flex: 1, flexDirection: 'row' }]}>
            <View style={styles.contenedorTexto}>
              <Text style={styles.textoIzq}>{texto6}</Text>
            </View>
            <Image source={require('./assets/imagenes/intermodalidad/cf6.png')} style={[styles.circulo, { marginRight: -25 }]} />
          </View>
        </View>
        <View style={[styles.boxVideo]}>
          <Text style={[Estilos.textoTitulo]}>¿Cómo Funciona?</Text>
          <Video
            source={{
              uri: 'https://d1whlxcko3fuwv.cloudfront.net/L%C3%ADneaCeroMetro.mp4',
            }} // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref
            }}
            onLoad={() => {
              this.player.seek(0.5)
            }}
            resizeMode="contain"
            controls={true}
            paused={true}
            style={{
              width: '100%',
              height: '90%',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
        </View>
        {/**"https://d1whlxcko3fuwv.cloudfront.net/KitreparaciónLíneaCero.mp4" */}
        {/**"https://d1whlxcko3fuwv.cloudfront.net/LíneaCeroMetro.mp4" */}
        <View style={[styles.boxVideo, { marginTop: SLIDER_WIDTH * 0.05 }]}>
          <Text style={[Estilos.textoTitulo]}>Kit de Reparación</Text>
          <Video
            source={{
              uri: 'https://d1whlxcko3fuwv.cloudfront.net/Kitreparaci%C3%B3nL%C3%ADneaCero%20.mp4',
            }} // Can be a URL or a local file.
            ref={(ref) => {
              this.player2 = ref
            }}
            onLoad={() => {
              this.player2.seek(0.5)
            }}
            resizeMode="contain"
            controls={true}
            paused={true}
            style={{
              width: '100%',
              height: '90%',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default LineaCero_ComoFunciona
