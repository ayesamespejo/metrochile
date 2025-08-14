import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Dimensions,
  SectionList,
  StyleSheet,
  Text,
  RefreshControl,
  Pressable,
  Animated,
} from 'react-native'

import Estilos from '../Estilos'
// import AppReview from "react-native-app-review";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Globals from '../Globals'
import TextInputBorrar from '../components/TextInputBorrar'

import EstacionOperativa from '../assets/svg/estado_red/EstacionOperativa.svg'
import EstacionCierreTemporal from '../assets/svg/estado_red/EstacionCierreTemporal.svg'
import CombinacionCerrada from '../assets/svg/estado_red/CombinacionCerrada.svg'
import AccesosCerrados from '../assets/svg/estado_red/AccesosCerrados.svg'
import Linea1 from '../assets/svg/lineas/Linea1.svg'
import Linea2 from '../assets/svg/lineas/Linea2.svg'
import Linea3 from '../assets/svg/lineas/Linea3.svg'
import Linea4 from '../assets/svg/lineas/Linea4.svg'
import Linea4A from '../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../assets/svg/lineas/Linea5.svg'
import Linea6 from '../assets/svg/lineas/Linea6.svg'
import ExclamasionTriangulo from '../assets/svg/comun/ExclamasionTriangulo.svg'
import ExclamasionCirculo from '../assets/svg/comun/ExclamasionCirculo.svg'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const getParam = async (label) => {
  try {
    const value = await AsyncStorage.getItem(label)
    return value != null ? JSON.parse(value) : null
  } catch (e) {
    //console.log(e);
  }
}

const storeParam = async (label, value) => {
  try {
    await AsyncStorage.setItem(label, JSON.stringify(value))
  } catch (e) {
  } finally {
    return true
  }
}

var param = 1
getParam('_count1_').then((v) => {
  // console.log(v);
  if (v) {
    param = Number(v) + 1
    // console.log('param', param, v);
  }
  storeParam('_count1_', param).then((val) => {
    // console.log('store', val, param);
  })
  if (param == 5 || param == 15) {
    // console.log('show');
    //AppReview.launch();
  }
})
//let COLOR = {L1:'#E32731', L2:'#F7941D', L3 :'#994807', L4: '#3F51B5', L4A:'#05ADF4',L5:'#0C9445', L6:'#9C27B0'}
var LINEAS_VISIBLES = []

const CirculoEstacion = ({ color, estado, ultimo = false, item }) => {

  // Estados ----------------------------
  // 1 : Estación operatva
  // 2 : Estación cerrada
  // 3 : 
  // 4 : Accesos cerrados
  // 5 : Combinación cerrada

 // Entregado por Andrea: 
//  "estado": "1", "Estación Operativa" (no se muestra en la app)
//  "estado": "2", "Cierre Temporal" / "Cerrada Temporalmente"
//  "estado": "3", "No habilitada"
//  "estado": "4", "Accesos Cerrados"
//  "estado": "5", "Combinación Cerrada"

  let altoLinea = 49
  if (item.extremo ) altoLinea = 29
  return (
  <View>
    <View
      style={{
        position: 'absolute',
        left: 30,
        top: -20,
        width: 20,
        height: altoLinea,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        backgroundColor: color,
      }}
    />
    {!item.extremo && estado == 1 && <EstacionOperativa width={18} height={18} style={{marginLeft: 31, marginTop: 1}}/>}
    {!item.extremo && estado == 2 && <EstacionCierreTemporal width={18} height={18} style={{marginLeft: 31, marginTop: 1}}/>}
    {!item.extremo && estado == 4 && <AccesosCerrados width={18} height={18} style={{marginLeft: 31, marginTop: 1}}/>}
    {!item.extremo && estado == 5 && <CombinacionCerrada width={18} height={18} style={{marginLeft: 31, marginTop: 1}}/>}
    {item.extremo && (
      <View
        style={{
          position: 'absolute',
          left: 10,
          top: -2,
          width: 60,
          height: 20,
          backgroundColor: color,
          borderRadius: 10
        }}
      />
    )}
  </View>
  )
    }

const CeldaLinea = ({ title, status, estado, instance, state, index }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    blink()
  },[])

  const blink = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      },
    ).start()
  }
  return (
    <Pressable
      onPress={(e) => {
        var lineas_index = LINEAS_VISIBLES.indexOf(title)
        if (lineas_index == -1) {
          LINEAS_VISIBLES.push(title)
        } else {
          LINEAS_VISIBLES.splice(lineas_index)
        }
        instance({ ...state, data: Linea.data })
      }}
    >
      <View style={[styles.fondoHeader]}>
        <View style={[styles.linea, styles[title.toUpperCase()]]}>
          <View style={{ flexDirection: 'row', paddingTop: 2 }}>
            {Number(estado) > 1 && (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  marginTop: -2,
                  marginLeft: 7, 
                }}
              >
                <ExclamasionTriangulo width={24} height={24} fill='#FFFFFF' />
              </Animated.View>
            )}
            <Text style={[{ color: 'white', marginTop: -2, marginLeft: 7 }, Estilos.botonTextSinTipografia]}>
              {title.toString().substring(1).toUpperCase()} · {index}
            </Text>
            <Text
              style={[
                { color: 'white', marginTop: -2, marginLeft: 3, fontSize: 16 },
                Number(estado) > 1 ? Estilos.botonTextSinTipografia : Estilos.botonTextLight,
                Estilos.tipografiaMedium,
              ]}
            >
              {status.toString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const Item = ({ item, ultimo = false }) => {
  return (
    <Pressable
      style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 20, marginTop: item.indice === 0 ? 10 : 0 }}
      onPress={(e) => {
        Linea.nav.push('Estacion', { data: item })
      }}
    >
      {item.combinacion != '' && !item.extremo && (
        <View style={{ position: 'absolute',}}
        >
          {item.combinacion.toUpperCase() == 'L1' && <Linea1 width={20} height={20}/>}
          {item.combinacion.toUpperCase() == 'L2' && <Linea2 width={20} height={20}/>}
          {item.combinacion.toUpperCase() == 'L3' && <Linea3 width={20} height={20}/>}
          {item.combinacion.toUpperCase() == 'L4' && <Linea4 width={20} height={20}/>}
          {item.combinacion.toUpperCase() == 'L4A' && <Linea4A width={20} height={20}/>}
          {item.combinacion.toUpperCase() == 'L5' && <Linea5 width={20} height={20}/>}
          {item.combinacion.toUpperCase() == 'L6' && <Linea6 width={20} height={20}/>}
        </View>
      )}
      <CirculoEstacion
        estado={item.estado}
        color={Globals.COLOR[item.linea.toUpperCase()]}
        ultimo={ultimo}
        item={item}
      />
      <View style={{ flexDirection: 'row', width: 300 }}>
        <Text style={[{ marginLeft: 5 }, Estilos.texto, Estilos.tipografiaLight]}>
          {item.extremo ? '' : item.title}
        </Text>
        {!item.extremo && (
          <Text
            style={[
              { marginLeft: 5, fontStyle: 'italic' },
              Estilos.texto,
              Estilos.tipografiaLight,
              // {width: 10}, descomentar para mostrar error
            ]}
          >
            {item.estado == 1 ? '' : '- ' + item.status}
          </Text>
        )}
        {/* <Text
        style={[
          {fontStyle: 'italic'},
          Estilos.texto,
          Estilos.tipografiaLight,
          {flex: 1},
        ]}>
        {item.estado == 1 ? '' : item.status}
      </Text> */}
      </View>
    </Pressable>
  )
}

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const Linea = ({ navigation, linea = 'l2' }) => {
  // var data = [];
  // var dataTodo=[];
  const nav = null
  // const [textoFiltro, setTextoFiltro] = useState(textoBusqueda);
  const [dataTodo, setDataTodo] = useState([])
  const [data, setData] = useState([])
  const [dataTodoEstacion, setDataTodoEstacion] = useState([])
  const [textoFiltro, setTextoFiltro] = useState('')
  const sectionListRef = useRef(null)
  const [state, setState] = useState({
    data: [],
    refreshing: false,
    //Se genera una propiedad nueva para vincularla al Texto del Buscador.
    // searchText: textofiltro,
  })

  const filterData = (text) => {
    var text = removeAccents(text)
    // if (text.length == 0) {
    //   LINEAS_VISIBLES = [];
    //   setState({...state, refreshing: false});
    //   return;
    // }
    if (text.length < 3) {
      setData(dataTodoEstacion)
      return
    }
    var d0 = []
    let r = JSON.parse(JSON.stringify(dataTodo))
    r.forEach((element) => {
      var d1 = []
      let indice = 0
      element.data.forEach((a) => {
        if (removeAccents(a.title.toLowerCase()).indexOf(text.toLowerCase()) != -1) {
          d1.push({ ...a, indice: indice })
          indice++
        }
      })
      if (d1.length > 0) {
        element.data = d1
        d0.push(element)
        if (LINEAS_VISIBLES.indexOf(element.title) == -1) {
          LINEAS_VISIBLES.push(element.title)
        }
      }
    })
    setState({ ...state, refreshing: false })
    setData(d0)
  }

  const updateData = () => {
    setTextoFiltro('')
    setState({ ...state, refreshing: true })
    let url = Globals.MAIN_URL
    // (`${url}/api/estadoRedDetalle.php`)
    fetch(`${url}/api/estadoRedDetalle.php`)
      .then((response) => response.json())
      .then((json) => {
        var d = []
        var dTodo = []
        var sectionIndex = 0
        for (var i in json) {
          var item = new Object()
          item.title = i
          item.styleName = i
          item.estado = json[i].estado
          item.status = json[i].mensaje_app
          const cantidad = json[i].estaciones.length
          const listaEstaciones = json[i].estaciones.map((e, index) => {
            var obj = new Object()
            obj.title = e.nombre
            obj.status = e.descripcion_app
            obj.linea = i
            obj.combinacion = e.combinacion
            obj.visible = false
            obj.sectionIndex = sectionIndex
            obj.estado = e.estado
            obj.codigo = e.codigo
            obj.indice = index
            obj.ultima = index == cantidad - 1
            obj.extremo = false
            return obj
          })
          listaEstaciones.push({ ...listaEstaciones[listaEstaciones.length - 1], extremo: true })
          item.data = listaEstaciones
          if (i === linea) {
            d.push(item)
          }
          dTodo.push(item)
          sectionIndex++
        }
        setData([...d])
        setDataTodoEstacion([...d])
        setDataTodo([...dTodo])
        //dataTodo = [...dTodo];
        //Este es el ultimo "setState" una vez que se haya regresado de otra vista, esto me permite colocarle el searchText en '' o vacio, y de esa manera se reinicia el buscador.
        setState({ ...state, refreshing: false, searchText: '' })
        if (sectionListRef.current) {
           sectionListRef.current.scrollToLocation({ sectionIndex: 0, itemIndex: 0 })
      }

      })
      .catch((error) => console.error(error))
      .finally(() => {
        // this.setState({ isLoading: false });
      })
  }

  useEffect(() => {
    updateData()
    if (textoFiltro.length >= 2) {
      filterData(textoFiltro)
    }
    // setTextoFiltro(textoBusqueda);
    Linea.nav = navigation
    const _unsubscribe = navigation.addListener('focus', () => {
      // setTextoFiltro('');
      // updateData();
    })
    return _unsubscribe
  }, [linea])

  useEffect(() => {
    filterData(textoFiltro)
  }, [textoFiltro])

  const renderItemIFVisible = ({ item }) => {
    return <Item item={item} />
  }

  const onChangeText = (text) => {
    setState({ ...state, searchText: text })
    setTextoFiltro(text)
    filterData(text)
  }

  return (
    <View style={{ height: HEIGHT - 250 }}>
      {/* <ScrollView> */}

      <View style={{ marginLeft: '5%' }}>
        <TextInputBorrar
          borderColor={Globals.COLOR[linea.toUpperCase()]}
          width="95%"
          placeholderTextColor="#666"
          placeholder="Busca por el nombre de la estación"
          value={textoFiltro}
          onChangeText={(text) => onChangeText(text)}
          marginTop={0}
        />
      </View>
      {data.length == 0 ? (
        <View
          style={[
            Estilos.mensajeError,
            {
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              // marginTop: 20,
            },
          ]}
        >
          <ExclamasionCirculo width={20} height={20} style={{marginRight: 10}}/>
          <Text style={[Estilos.boxText, Estilos.tipografiaLight, { top: 2 }]}>Sin resultados para esta búsqueda</Text>
        </View>
      ) : (
        <></>
      )}
      {textoFiltro.length < 3 && data[0]?.data && (
        <SectionList
          ref={sectionListRef}
          style={{ marginTop: 20, height: HEIGHT - 250 }}
          refreshControl={<RefreshControl onRefresh={updateData.bind(this)} refreshing={state.refreshing} />}
          sections={data}
          keyExtractor={(item, index) => 'k' + index}
          renderSectionHeader={({ section: item }) => (
            <CeldaLinea
              title={item.title}
              status={item.status}
              estado={item.estado}
              instance={setState}
              state={state}
            />
          )}
          renderItem={renderItemIFVisible}
        />
      )}
      {/* Se duplica el SectionList debido a una falla en su funcionamiento, lo que hace que el
      filtro no funciona correctamente, al duplicarse se entieneden como objetos distintos que
      no interfieren entre si */}
      {textoFiltro.length >= 3 && (
        <SectionList
          style={{ marginTop: 10, height: HEIGHT - 250 }}
          refreshControl={<RefreshControl onRefresh={updateData.bind(this)} refreshing={state.refreshing} />}
          sections={data}
          keyExtractor={(item, index) => 'k' + index}
          renderSectionHeader={({ section: item }) => (
            <CeldaLinea
              title={item.title}
              status={item.status}
              estado={item.estado}
              instance={setState}
              state={state}
            />
          )}
          renderItem={renderItemIFVisible}
        />
      )}
      {/* </ScrollView> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  L1: {
    backgroundColor: Globals.COLOR.L1,
  },

  L2: {
    backgroundColor: Globals.COLOR.L2,
  },

  L3: {
    backgroundColor: Globals.COLOR.L3,
  },

  L4: {
    backgroundColor: Globals.COLOR.L4,
  },

  L4A: {
    backgroundColor: Globals.COLOR.L4A,
  },

  L5: {
    backgroundColor: Globals.COLOR.L5,
  },

  L6: {
    backgroundColor: Globals.COLOR.L6,
  },

  buscador: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    margin: 30,
    padding: 10,
    height: 40,
  },

  linea: {
    height: 45,
    marginTop: 0,
    // marginHorizontal: 10,
    padding: 10,
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 30,
    borderWidth: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fondoHeader: {
    backgroundColor: '#F1F1F1',
    marginHorizontal: 10,
    borderBottomLeftRadius: 39,
    borderBottomRightRadius: 30,
  },
})

export default Linea
