import React, { useState, useEffect, useRef } from 'react'
import {
  Pressable,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Animated,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import Estilos from '../../Estilos'
import Globals from '../../Globals'
import TextInputBorrar from '../../components/TextInputBorrar'
import ChevronDown from '../../assets/svg/flechas/ChevronDown.svg'
import TituloCirculoEstacion from './TituloCirculoEstacion'
import CirculoLinea from './CirculoLinea'
import ExclamasionTriangulo from '../../assets/svg/comun/ExclamasionTriangulo.svg'
import CerrarCirculo from '../../assets/svg/comun/CerrarCirculo.svg'
import { ScrollView } from 'react-native-gesture-handler'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').width

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const styles = StyleSheet.create({
  contenedorItem: {
    padding: WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
    // marginTop: WIDTH * 0.05,
  },
  lineaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contenedorListaItem: { marginTop: WIDTH * 0.05, backgroundColor: Globals.COLOR.GRIS_3 },
  lineaLista: { marginTop: WIDTH * 0.05, flexDirection: 'row', paddingEnd: WIDTH * 0.05 },
  // contenedorGeneral: { paddingHorizontal: WIDTH * 0.05 },
  contenedorExpandir: { marginTop: WIDTH * 0.05, flexDirection: 'row',  },
  contenedorSinResultados: {
    marginTop: WIDTH * 0.05,
    padding: WIDTH * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
  },
  lineaLinea: { flexDirection: 'row', justifyContent: 'space-between' },
})

//  "estado": "1", "Estación Operativa" (no se muestra en la app)
//  "estado": "2", "Cierre Temporal" / "Cerrada Temporalmente"
//  "estado": "3", "No habilitada"
//  "estado": "4", "Accesos Cerrados"
//  "estado": "5", "Combinación Cerrada"

const SelectorEstacion = ({
  onSelect,
  onCerrar = () => {},
  todasEstaciones = true,
  informacionEstacion = false,
  onSelectInformacion = null,
  setMostrarToken = () => {},
  mostrarCerrar = true,
}) => {
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])
  const [dataTodo, setDataTodo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [expandir, setExpandir] = useState(true)

  const filterData = (text) => {
    var text = removeAccents(text)
    if (text.length == 0) {
      setData(dataTodo)
      return
    }
    if (text.length < 3) {
      setData(dataTodo)
      return
    }
    var d0 = []
    let r = JSON.parse(JSON.stringify(dataTodo))
    r.forEach((element) => {
      var d1 = []
      element.data.forEach((a) => {
        if (removeAccents(a.title.toLowerCase()).indexOf(text.toLowerCase()) != -1) {
          d1.push(a)
        }
      })
      if (d1.length > 0) {
        element.data = d1
        d0.push(element)
      }
    })
    if (dataTodo.length != d0.length) {
      setExpandir(true)
    } else {
      setExpandir(false)
    }
    setData(d0)
  }

  const getEstadoEstaciones = () => {
    setCargando(true)
    var dataPaso = []
    fetch('https://www.metro.cl/api/estadoRedDetalle.php')
      .then((response) => response.json())
      .then((json) => {
        for (var i in json) {
          var item = new Object()
          item.title = i
          item.styleName = i
          item.linea = i.toUpperCase()
          item.status = json[i].mensaje_app
          item.data = json[i].estaciones.map((e) => {
            var obj = new Object()
            obj.title = e.nombre
            obj.status = e.descripcion_app
            // obj.status = (!todasEstaciones && (e.codigo == 'PAC' || e.codigo == 'VMA' )) ? 'Combinación cerrada' : e.descripcion_app
            obj.linea = i
            obj.visible = false
            obj.estado = e.estado
            // obj.estado = (!todasEstaciones && (e.codigo == 'PAC' || e.codigo == 'VMA' )) ? 2 : e.estado
            obj.codigo = e.codigo
            obj.combinacion = e.combinacion
            return obj
          })
          dataPaso.push(item)
        }
        setData(dataPaso)
        setDataTodo(dataPaso)
        setCargando(false)
      })
      .catch((error) => {
        console.error(error)
        setCargando(false)
      })
      .finally(() => {
        setCargando(false)
      })
  }

  onChangeText = (text) => {
    if (text == 'Token') {
      setMostrarToken(true)
    } else {
      setMostrarToken(false)
    }
    filterData(text)
    setSearchText(text)
  }

  useEffect(() => {
    getEstadoEstaciones()
  }, [])

  const ItemLinea = ({ item, expandir = false, index }) => {
    const [mostrarLista, setmostrarLista] = useState(expandir)

    const fadeAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
      blink()
    }, [])

    const blink = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        {
          iterations: -1,
        },
      ).start()
    }

    return (
      <View style={[styles.contenedorItem, { marginTop: WIDTH * 0.05 }]}>
        <Pressable
          style={styles.lineaItem}
          onPress={() => {
            setmostrarLista(!mostrarLista)
          }}
        >
          <View style={{ marginLeft: WIDTH * 0.05 }}>
            <TituloCirculoEstacion
              texto={`Línea ${item.linea.replace('L', '')}`}
              linea={item.linea.replace('L', '')}
              tamanoIcono={24}
              estiloTexto="subtitulo"
              separacionIcono={WIDTH * 0.05}
            />
          </View>
          <ChevronDown
            width={20}
            height={20}
            fill={Globals.COLOR.GRIS_3}
            style={{ transform: [{ rotate: mostrarLista ? '180deg' : '0deg' }] }}
          />
        </Pressable>
        {mostrarLista && (
          <View>
            <View height={1} style={styles.contenedorListaItem} />
            {item.data.map((estacion) => (
              <Pressable
                key={estacion.codigo}
                style={styles.lineaLista}
                // disabled={(estacion.estado == 3 || estacion.estado == 2) && !todasEstaciones}
                onPress={(evt) => {
                  if (onSelectInformacion) {
                    onSelectInformacion({ codigo: estacion.codigo, linea: estacion.linea })
                  } else {
                    if (!todasEstaciones && estacion.estado != '1') {
                      return
                    } else {
                      onSelect(estacion)
                    }
                  }
                }}
              >
                {estacion.combinacion && estacion.estado == 1 && (
                  <CirculoLinea linea={estacion.combinacion.replace('L', '')} tamanoIcono={24} />
                )}
                {estacion.estado != 1 && (
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                    }}
                  >
                    <ExclamasionTriangulo width={24} height={24} fill={Globals.COLOR.L2} />
                  </Animated.View>
                )}
                <Text
                  style={[
                    Estilos.textoGeneral,
                    { marginLeft: estacion.combinacion || estacion.estado != 1 ? WIDTH * 0.05 : WIDTH * 0.05 + 24 },
                    { color: estacion.estado != 1 && !todasEstaciones ? Globals.COLOR.GRIS_4 : {}},
                  ]}
                >
                  {estacion.title}
                  {estacion.estado != 1 && <Text style={Estilos.textoServicio}> - {estacion.status}</Text>}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    )
  }

  if (cargando) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.contenedorGeneral}>
      <View style={{ height: Dimensions.get('window').height - 130 }}>
        <View style={{marginTop: WIDTH * 0.08}}>
          <View style={styles.lineaLinea}>
            <Text style={[Estilos.textoSubtitulo]}>Estación</Text>
            {mostrarCerrar && (
              <Pressable onPress={() => onCerrar(false)}>
                <CerrarCirculo width={24} height={24} fill={Globals.COLOR.GRIS_3} />
              </Pressable>
            )}
          </View>
          <View style={{ marginTop: WIDTH * 0.03 }}>
            <TextInputBorrar
              placeholderTextColor="#666"
              placeholder="Busca por el nombre de la estación"
              value={searchText}
              onChangeText={(text) => onChangeText(text)}
              width="100%"
            />
          </View>
          <View style={styles.contenedorExpandir}>
            <View style={{ justifyContent: 'center', width: 160, }}>
              <Text style={Estilos.textoSubtitulo}>{expandir ? 'Contraer las Líneas' : 'Expandir las Líneas'}</Text>
            </View>
            <Switch
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={expandir ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => {
                if (!expandir) {
                  setExpandir(true)
                } else {
                  setExpandir(false)
                }
                setExpandir(!expandir)
              }}
              value={expandir}
            />
          </View>
        </View>
        {data.length == 0 && (
          <View style={styles.contenedorSinResultados}>
            <Text style={[Estilos.textoGeneral]}>Sin resultados para esta búsqueda</Text>
          </View>
        )}
        <FlatList
          data={data}
          renderItem={(item) => <ItemLinea item={item.item} key={item.linea} expandir={expandir} index={0} />}
          keyExtractor={(item) => item.linea}
        />
      </View>
    </View>
  )
}

export default SelectorEstacion
