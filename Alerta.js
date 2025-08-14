import React, { useState, useEffect } from 'react'
import {
  Pressable,
  RefreshControl,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  Text,
  Platform,
  SafeAreaView, 
  ActivityIndicator,
} from 'react-native'
import Estilos from './Estilos'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import Globals from './Globals'

const WIDTH = Dimensions.get('window').height
import ConfigNotificaciones from './assets/svg/notificaciones/configNotificaciones.svg'

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
  menu: {
    margin: 10,
    width: 25,
    height: 30,
    resizeMode: 'contain',
  },
})

const Item = ({ date, text, lineas }) => {
  let arregloTexto = text.split('<br>')

  return (
    <View key={date}>
      <View style={{ flexDirection: 'row', left: 20 }}>
        <View style={{justifyContent: 'center'}}>
          {lineas.map((e, i) => (
            <TituloCirculoEstacion key={`linea-${e}-${i}`} texto={''} linea={e.substring(1).toUpperCase()} tamanoIcono={32}/>
          ))}
        </View>
        <View
          style={{
            width: Dimensions.get('window').width - 120,
            marginBottom: 20,
            marginLeft: 10,
          }}
        >
          <Text style={[styles.date, Estilos.tipografiaMedium]}>{date}</Text>
          {arregloTexto.map((texto, index) => (
            <Text key={index} style={[styles.text, Estilos.tipografiaLight]}>
              {texto}
            </Text>
          ))}
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          marginHorizontal: 10,
          borderBottomColor: Globals.COLOR.GRIS_3,
        }}
      ></View>
    </View>
  )
}

const Alerta = (props) => {
  // var index = 0
  // var lineas = ['l1', 'l2', 'l3', 'l4', 'l4a', 'l5', 'l6']
  // alertas = []
  // var fechas = []

  const [state, setState] = useState({
    url: 'https://tk9ktk356f.execute-api.us-east-1.amazonaws.com/UAT/data',
    data: [],
    modalVisible: false,
    refreshing: true,
  })

  useEffect(() => {
    var nav = props.navigation

    props.navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <Pressable
          style={{ width: 50, marginRight: -20 }}
          onPress={() => {
            // nav.push('Configuración')
          }}
        >
          <ConfigNotificaciones width={24} height={24} fill={Globals.COLOR.GRIS_3}/>
        </Pressable>
      ),
    })

    const _unsubscribe = props.navigation.addListener('focus', () => {
      getDatos()
    })
    return () => {
      _unsubscribe()
    }
  }, [])

  const renderItem = ({ item }) => {
    return <Item style={{ marginBottom: 0 }} date={item.date} text={item.text} lineas={item.lineas} />
  }

  const updateData = () => {
    index = 0
    getDatos()
  }

  /**
   * Funcion que retorna la fecha con la hora en chileno.
   * @param {string} date
   * @param {string} tzString
   * @returns Date
   */
  const convertChileanTZ = (date, tzString) => {
    return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('es-CL', { timeZone: tzString }))
  }

  const getLineasHash = (txt) => {
    let resultado = []
    let s = txt
    if (s.toUpperCase().indexOf('L4A') != -1) {
      resultado.push('L4A')
      s = txt.replace('L4A', '')
    }
    if (s.toLowerCase().indexOf('#metroapp') != -1) {
      resultado.push('TR')
    }
    var exp = /(L[0-6])/gi
    var l = s.match(exp)
    if (l) {
      l.forEach((i) => {
        if (resultado.indexOf(i) == -1) {
          resultado.push(i)
        }
      })
    }
    /**
     * Si despues de todas las busquedas, aun el resultado es vacio,
     * quiere decir que en ninguna parte del mensaje se coloco a que linea pertenecia el mensaje.
     * Por ende colocamos el logo de metro por defecto que esta sujeto a colocar el valor de 'TR'
     */
    if (resultado.length == 0) resultado.push('TR')
    resultado.sort(function (a, b) {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
    })
    return resultado
  }

  /**
   * Funcion que retorna el texto final que se colocara en la alerta.
   * @param {string} txt
   * @returns string
   */
  const getTextoFinal = (txt) => {
    /**
     * Remplazamos todas las Urls de los Tweets
     */
    let texto = removeURLS(txt.replace(/<[^>]*>?/gm, ''))
    /**
     * No se muy bien que es el "indexRevisa"
     */
    let indexRevisa = texto.toLowerCase().indexOf('revisa')
    let textoFinal = texto
    if (indexRevisa != -1) {
      textoFinal = texto.substring(0, indexRevisa)
    }
    /**
     * Aca sacamos los saltos de linea.
     */
    return textoFinal.replace(/(\r\n|\r|\n|\\n)/g, '<br>')
  }

  const removeURLS = (txt) => {
    var comps = txt.split(' ')
    comps.forEach((w) => {
      if (w.indexOf('http://' != -1) || w.indexOf('https://') != -1) w = ''
    })
    return comps.join(' ')
  }

  const getDatos = () => {
    const { url } = state
    setState({ ...state, refreshing: true })
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        /**
         * Creamos el contenedor de las alertas
         */
        let alertas = []
        /**
         * Separamos los elementos que vienen de la api, dentro de Items, que es donde estan los Tweets.
         */
        let elements = json.Items
        /**
         * Recorremos los Elementos,
         * Primero filtramos todos aquellos elementos que su timestamp no exista, ya que no los podemos
         * organizar.
         */
        elements
          .filter((element) => element.timestamp != undefined)
          .forEach((element) => {
            /**
             * Aca obtenemos la fecha en formato chileno para la organizacion de los tweets.
             */
            let date = convertChileanTZ(element.timestamp, 'America/Santiago')
            /**
             * Guardamos la fecha del titulo de la notificacion
             */
            let formatDate = element.fecha
            /**
             * Aca obtemos las Lineas que son parte del texto.
             */
            let lineasAfectadas = []
            try {
              lineasAfectadas = element.cod.split(',')
            } catch {
              // Esto se debe a que pueden existir registros con el compo cod con un formato no válido
              lineasAfectadas = element.cod
            }
            /**
             * Aca obtenemos el texto final, que aparecera en el comentario.
             */
            let textoFinal = getTextoFinal(element.text)
            /**
             * Metemos el objeto de la notificacion con los datos obtenidos anteriormente dentro de
             * nuestro arreglo de alertas.
             */
            alertas.push({
              date: formatDate,
              text: textoFinal,
              linea: element.cod,
              dateOrganizativaAndroid: date,
              lineas: lineasAfectadas,
              //Este sera el metodo de organizacion para IOS
              dateOrganizativaIOS: new Date(element.timestamp),
            })
          })
        /**
         * Tenemos que cambiar la manera de organizar de Ios , y la de Android , porque Ios tiene un
         * comportamiento raro con los Dates.
         */
        alertas =
          Platform.OS === 'ios'
            ? alertas.sort((a, b) => b.dateOrganizativaIOS - a.dateOrganizativaIOS)
            : alertas.sort((a, b) => b.dateOrganizativaAndroid - a.dateOrganizativaAndroid)

        setState({ ...state, data: alertas, refreshing: false })
      })
      .catch((error) => {
        Alert.alert('DEBUG', error, [{ text: 'Aceptar' }], { cancelable: false })
      })
  }

  const { data } = state
  if (state.refreshing) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: WIDTH / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  } 
  return (
    <View>
      <View style={{ height: Dimensions.get('window').height - 65, paddingHorizontal: WIDTH * 0.02, paddingBottom: WIDTH * 0.1}}>
        <FlatList
          refreshControl={
            <RefreshControl onRefresh={updateData.bind(this)} refreshing={state.refreshing}></RefreshControl>
          }
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index + Math.round(Math.random() * 1000).toString()}
        />
      </View>
    </View>
  )
}

export default Alerta
