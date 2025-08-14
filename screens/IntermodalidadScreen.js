import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Seguimos usando el Picker pero dentro de un modal
import Estilos from '../Estilos'; // Importamos los estilos desde Estilos.js
import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'
import Globals from '../Globals'
import { ScrollView } from 'react-native-gesture-handler';

class IntermodalidadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      selectedValue: 'intermodalidad',  // Valor seleccionado en el combobox
      selectedTitle: 'Intermodalidad',
      showPicker: false,  // Controla si se muestra o no el modal
      routes: [
        { key: 'intermodalidad', title: 'Intermodalidad', texto:'Metro cuenta con 8 estaciones de intercambio modal que facilitan y conectan con otros buses de la Región Metropolitana. Te invito a conocerlos' },
        { key: 'lineacero', title: 'Línea Cero', texto: 'Línea Cero es un servicio que permite estacionar bicicletas de manera gratuita y segura, usando tu candado U-Lock, para que puedas conectarte fácilmente a la red de metro.' },
        { key: 'bicimetro', title: 'Bicimetro', texto:'Es un espacio seguro destinado al cuidado de bicicletas, que cuenta con lockers individuales permitiendo continuar tu viaje en metro. \n\nEl usuario cancela $300 por el día o puede optar al sistema “Boleto BiciMetro” que permite comprar 5 cupones o pases diarios a un valor preferencial de $1.000.' },
        { key: 'uinvertida', title: 'U Invertida', texto:'Son estacionamientos convencionales para anclar la bicicleta en las cercanías de estaciones de Metro.' },
      ],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({ title: 'Intermodalidad' });
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const response = await fetch('https://metroqa.agenciacatedral.com/api/intermodalidad.php');
      const data = await response.json();

      console.log(data);

      this.setState({ data });
    } catch (error) {
      console.error(error);
    }
  };

  // Subtabla para mostrar los recorridos asociados a cada estación
  renderSubTable = (recorridos) => (
    <View style={Estilos.subTableContainer}>

      <View style={Estilos.subRow}>
            <Text style={Estilos.subCellTitle}>Tipo</Text>
            <Text style={Estilos.subCellTitle}>Recorrido</Text>
            <Text style={Estilos.subCellTitle}>Destino</Text>
         </View>


      <FlatList
        data={recorridos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={Estilos.subRow}>
            <Text style={Estilos.subCell}>{item.tipo}</Text>
            <Text style={Estilos.subCell}>{item.recorrido}</Text>
            <Text style={Estilos.subCell}>{item.destino}</Text>
          </View>
        )}
      />
    </View>
  );

  // Tabla principal que incluye la subtabla
  renderTable = (data, title, text) => (
    <View style={Estilos.tableContainer}>
      <Text style={[Estilos.tipografiaBold, Estilos.titulo,{marginLeft:5}]}>{title}</Text>
      <Text style={[ Estilos.textoGeneral, {padding:10, marginBottom:10}]}>{text}</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{margin:5}}>
            <Text style={[Estilos.textoSubtitulo, {marginVertical:5}]}>{item.estacion}</Text>
            {/* Renderizamos la subtabla con los recorridos */}
            {item.recorridos && this.renderSubTable(item.recorridos)}
          </View>
        )}
      />
    </View>
  );

  handleValueChange = (itemValue) => {
    console.log(itemValue);
    this.setState({ selectedValue: itemValue, showPicker: false });
  };

  render() {
    const { data, selectedValue, routes, showPicker } = this.state;

    if (!data) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Determinamos qué tabla mostrar en función del valor seleccionado en el Picker
    let selectedData;
    let selectedTitle;
    let selectedText;
    switch (selectedValue) {
      case 'intermodalidad':
        selectedData = data.eim;
        selectedTitle = 'Estaciones de Intercambio Modal';
        selectedText = routes[0].texto;
        break;
      case 'lineacero':
        selectedData = data.lineacero;
        selectedTitle = 'Línea Cero';
        selectedText = routes[1].texto;
        break;
      case 'bicimetro':
        selectedData = data.bicimetro;
        selectedTitle = 'Bicimetro';
        selectedText = routes[2].texto;
        break;
      case 'uinvertida':
        selectedData = data.uinvertida;
        selectedTitle = 'U Invertida';
        selectedText = routes[3].texto
        break;
      default:
        selectedData = data.eim;
        selectedTitle = 'Intermodalidad';
        selectedText = routes[0].texto;
        break;
    }

    return (
      <ScrollView style={{height:Dimensions.get("window").height-190}}>
        <Text style={[Estilos.textoGeneral, {padding:10}]}>Como protagonista del transporte público integrado promovemos la interacción con distintos modos de transportes, contribuyendo a tener una mejor ciudad.</Text>
        {/* Botón para abrir el picker */}
        <Pressable
          style={Estilos.botonEstacion}
          onPress={() => this.setState({ showPicker: true })}
        >
          <Text style={Estilos.pickerButtonText}>{selectedTitle}</Text>
          <ChevronDown
                  width={20}
                  height={20}
                  fill={'#FFF'}
                  style={{ transform: [{ rotate: '0deg' }] }}
                />
        </Pressable>

        {/* Modal con el Picker */}
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => this.setState({ showPicker: false })}
        >
          <View style={Estilos.modalContainer}>
            <View style={Estilos.pickerContainer}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={this.handleValueChange}
              >
                {routes.map(route => (
                  <Picker.Item key={route.key} label={route.title} value={route.key} />
                ))}
              </Picker>

              {/* Botón para cerrar el modal */}
              <TouchableOpacity
                style={Estilos.closeButton}
                onPress={() => this.setState({ showPicker: false })}
              >
                <Text style={Estilos.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Mostrar la tabla correspondiente según la selección */}
        {this.renderTable(selectedData, selectedTitle, selectedText)}
      </ScrollView>
    );
  }
}

export default IntermodalidadScreen;
