import React, { Component } from 'react'
import { Image, Dimensions, StyleSheet, View, Text, Pressable, Linking, Button } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import Estilos from './Estilos'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Privacy settings configured below are only provided
// to allow a quick start with capturing monitoring data.
// This has to be requested from the user
// (e.g. in a privacy settings screen) and the user decision
// has to be applied similar to this example.



let pronto_icon = require('./assets/icons/menu/pronto.png')

let saveData = async (obj) => {

    try {
      await AsyncStorage.setItem(obj.key, obj.value);
    } catch (e) {
      console.log(e);
  
    }
  }




/**
 * Este sera el contenido del Menu
 */
const contentMenu = [
    {
        id: 'menuOpcion1',
        title: 'Información de Estaciones',
        visible: 0,
        actionAvailable: 0,
        imgUrl: require('./assets/icons/menu/menu_informacion.png'),
        routeName: 'Información Estaciones_',
        subSections: [
            {
                title: 'Buscar por Servicio',
            },
            {
                title: 'Buscar por Estacion',
            },
        ],
    },
    {
        id: 'menuOpcion2',
        title: 'Mi Viaje',
        visible: 0,
        actionAvailable: 1,
        imgUrl: require('./assets/icons/menu/menu_viaje.png'),
        routeName: '',
        hasNewOption: false,
        subSections: [
            {
                id: 'menuOpcion2.1',
                title: 'Planificador de Viajes',
                routeName: 'Planificador de Viajes_',
                isNewOption: false
            },

            {
                id: 'menuOpcion2.2',
                title: 'Ruta Expresa',
                routeName: 'Ruta Expresa_',
                isNewOption: false
            },

            {
                id: 'menuOpcion2.3',
                title: 'Plano de la Red',
                routeName: 'Plano de Red_',
                isNewOption: false
            },

            {
                id: 'menuOpcion2.4',

                title: 'Consulta y Carga bip!',
                routeName: 'Consulta bip!_',
                isNewOption: false

            },
            {
                id: 'menuOpcion2.5',
                title: 'Tarifas',
                routeName: 'Tarifas_',
                isNewOption: false
            }
        ],
    },
    {
        id: 'menuOpcion3',
        title: 'Cultura y comunidad',
        visible: 0,
        actionAvailable: 1,
        imgUrl: require('./assets/icons/menu/menu_cultura.png'),
        routeName: '',
        hasNewOption: false,
        subSections: [
            {
                id: 'menuOpcion2.1',
                title: 'Agenda Cultural',
                routeName: 'Agenda Cultural_',
                isNewOption: false
            },
            {
                id: 'menuOpcion2,2',
                title: 'Nuevos Proyectos',
                routeName: 'Nuevos Proyectos_',
                isNewOption: false,
            },
            //  {
            //      id: 'menuOpcion2,3',
            //      title: 'Tienda Metro',
            //      routeName: 'Tienda Metro',
            //      isNewOption: false
            //  }

            // Se comenta MetroPodcast ya que no se subirán audios
            //  {
            //      id: 'menuOpcion2,3',
            //      title: 'MetroPodcast',
            //      routeName: 'Audio Digital_',
            //      isNewOption: false
            //  },
            //MetroInforma comentado hasta su fecha de lanzamiento
            //  {
            //     id: 'menuOpcion2,4',
            //     title: 'MetroInforma',
            //     routeName: 'MetroInforma_',
            //     isNewOption: false
            // }
            // Opción ara probar nuevos screens
             {
                id: 'menuOpcion2,5',
                title: 'Home',
                routeName: 'Home_',
                isNewOption: false
            }
        ]
    },
    {
        id: 'menuOpcion4',
        title: 'Mis Favoritos',
        visible: 0,
        actionAvailable: 0,
        imgUrl: require('./assets/icons/menu/menu_favoritos.png'),
        routeName: 'Mis Favoritos_'
    },
    {
        id: 'menuOpcion5',
        title: 'Contáctanos',
        visible: 0,
        actionAvailable: 1,
        imgUrl: require('./assets/icons/menu/menu_contactanos.png'),
        routeName: '',
        subSections: [
            {
                id: 'menuOpcion5.1',
                title: 'Emergencias - 1411',
                isLinking: 1411,
                isNewOption: false
            },
            {
                id: 'menuOpcion5.2',
                title: 'Acoso - 1488',
                isLinking: 1488,
                isNewOption: false
            },
            {
                id: 'menuOpcion5.3',
                title: 'Consultas - 600 600 9292',
                isLinking: '600 600 9292',
                isNewOption: false
            },
            {
                id: 'menuOpcion5.4',
                title: 'Asistencia - 800 540 800',
                isLinking: '800 540 800',
                isNewOption: false
            },
            {
                id: 'menuOpcion5.5',
                title: 'Sugerencias y Reclamos',
                routeName: 'Sugerencias y Reclamos_',
                isNewOption: false
            }
        ],
    },
    {
        id: 'menuOpcion7',
        title: 'Compra Online',
        visible: 0,
        hasNewOption:true,
        actionAvailable: 0,
        imgUrl: require('./assets/icons/menu/menu_compra_online.png'),
        routeName: 'Tienda Metro'
    },
    {
        id: 'menuOpcion6',
        title: '1488',
        visible: 0,
        actionAvailable: 0,
        isLinking: 1488,
        imgUrl: require('./assets/icons/menu/menu_llamada.png'),
        routeName: ''
    },
]

// Imagenes
const arrow = require('./assets/fwd_arrow.png')
const icono_nuevo = require('./assets/icons/menu/etiquetaNuevo.png')
const logo_metro_colores = require('./assets/logo_metro_colores.png')

// Altura 
const MENU_WIDTH = Dimensions.get('window').width * 0.70
const MENU_ITEM_WIDTH = Math.round(MENU_WIDTH * 0.90)
const MENU_ITEM_HEIGHT = Math.round(MENU_ITEM_WIDTH * 0.90)

// Estilos
const styles = StyleSheet.create({
    cardContainerEstadoDeRedNotificaciones: {
        borderRadius: 20,
        width: MENU_WIDTH * 0.50,
        height: MENU_ITEM_HEIGHT * 0.30,
        maxHeight: MENU_ITEM_HEIGHT * 0.30,
        backgroundColor: 'white'
    },
    cardContainerInformacionEstacion: {
        marginBottom: 10,
        width: MENU_WIDTH * 1.03,
        borderRadius: 20,
        backgroundColor: 'white'
    },
    cardContainerLinking: {
        marginBottom: 10,
        width: MENU_WIDTH * 1.03,
        borderRadius: 20,
        backgroundColor: '#E32731'
    },
    imagenCardInformacionEstacion: {
        width: 2,
        height: 2,
        padding: 13,
        resizeMode: 'contain'
    },
    tinyLogo: {
        position: 'absolute',
        resizeMode: 'contain',
        left: '20%',
        right: '20%',
        top: -35,
        width: 180,
        height: 180,
        marginTop: 15
    },
    PressableHeader: {
        flexDirection: 'row',
        padding: 2,
        margin: 10,
        marginTop: 8,
        alignContent: 'center'
    }
})

//Variable para determinar cual es la posicion actual de la navegacion.
let actualViewInNavigation = 'Estado de la Red_'

export default class AppMenu extends Component {

    constructor(props) {
        super(props)

        /**
         * Nos aseguramos que la capacidad de navegar entre los archivos tambien la tenga el padre.
         */
        props.navigationParent(props.navigation)

        this.state = {
            contentMenu: contentMenu,
            navigation: props.navigation,
            tiendaURL: "",
            tiendaTextoBoton:"",
            tiendaIMGBoton:"",
            tiendaBotonVisible:false,
            tiendaNuevoVisible: false
 
    }
}

    componentDidMount() {


        this.updateData();
        
    }

    updateData() {


        let url = "https://com-agenciacatedral.s3-us-west-1.amazonaws.com/metro/tienda_metro_config.json";
     
        
        fetch(`${url}`)
          .then((response) => response.json())
          .then((json) => {
            
            console.log(json);

            var menu = this.state.contentMenu;

            console.log(menu[5]);
            if ( json.icon == "pronto") {

                    menu[5].prontoIcon = pronto_icon;

            }
            if (json.icon == "no") {

                menu[5].hasNewOption = false;
            }
    
            this.setState( { contentMenu:menu, tiendaBotonVisible:  Boolean( json.visible ), tiendaTextoBoton:json.texto, tiendaIMGBoton:json.icon, tiendaURL: json.url, tiendaNuevoVisible: Boolean( json.nuevo ), tiendaMetroColor:json.color } );

            

        





          });
        
    }


    render() {
        const { contentMenu } = this.state

        return (
            //Menu
            <DrawerContentScrollView scrollEnabled={true} >

                <Image source={logo_metro_colores} accessibilityLabel="Logo de Metro" style={styles.tinyLogo}></Image>
lllllllllllllllllllllllllll
                {/** Separacion de Logo con la Seccion del menu */}
                <View style={{ height: 90 }}></View>

                {/** Seccion de Estado de la Red y Notificaciones */}

                <View style={{ display: 'flex', marginTop: '5%', width: '100%' }}>
                    <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                        <Pressable  accessibilityHint="Toca 2 veces para activar" onPress={() => this.navigationThroughMenu('Estado de la Red_')}>
                            <View style={styles.cardContainerEstadoDeRedNotificaciones}>
                                <Image source={require('./assets/icons/menu/menu_tren.png')} style={{ width: 30, height: 30, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                                <Text style={[Estilos.subtitulos, (actualViewInNavigation == 'Estado de la Red_' ? {}  : [Estilos.tipografiaLight, {color:'#43464E'}] ), { marginLeft: 'auto', marginRight: 'auto', bottom: 10 }]}>
                                    Estado de la Red
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable accessibilityHint="Toca 2 veces para activar" style={{ marginLeft: 8, }} onPress={() => this.navigationThroughMenu('Notificaciones_')}>
                            <View style={styles.cardContainerEstadoDeRedNotificaciones}>
                                <Image source={require('./assets/icons/menu/menu_notificaciones.png')} style={{ width: 30, height: 30, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                                <Text style={[Estilos.subtitulos, (actualViewInNavigation == 'Notificaciones_' ? {}  : [Estilos.tipografiaLight, {color:'#43464E'}] ), { marginLeft: 'auto', marginRight: 'auto', bottom: 10 }]}>
                                    Notificaciones
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/** Seccion del menu para las demas opciones que no tienen la forma de Estado de la Red y Notificaciones */}
                <View style={{ flexDirection: 'column', padding: 2, marginLeft: '5%', marginTop: 8, alignContent: 'center', width:'100%'}}>
                    {contentMenu.map((item, index) => (
                        <View style={item.isLinking ? styles.cardContainerLinking : styles.cardContainerInformacionEstacion} key={`ms__${item.id}__${index}`}>
                            <Pressable accessibilityHint="Toca 2 veces para activar" style={styles.PressableHeader} onPress={() => {
                               
                               if (item.prontoIcon) return;
                               
                               if (item.isLinking) return Linking.openURL(`tel:${item.isLinking}`)

                                if (!item.routeName) {
                                    contentMenu[index].visible = !contentMenu[index].visible
                                    this.setState(contentMenu)
                                } else {
                                    this.navigationThroughMenu(item.routeName)
                                }
                            }}>
                                <Image source={item.imgUrl} style={[styles.imagenCardInformacionEstacion, item.isLinking ? { left: 80, marginBottom: 'auto', marginTop: 'auto' } : {}]} />
                                <Text style={[Estilos.subtitulos, (actualViewInNavigation == item.routeName ? {}  : [Estilos.tipografiaLight, {color:'#43464E'}] ), item.isLinking ? [Estilos.tipografiaBold, { color: 'white', marginLeft: 'auto', marginRight: 'auto', top: 5, fontSize: 24 }] : { marginLeft: '2%', top: 2 }]}> {item.title} </Text>

                                {(Boolean(item.visible) == false) && item.hasNewOption && <Image source={   item.prontoIcon ? item.prontoIcon :  icono_nuevo } style={ item.prontoIcon ? { width:45, height:45, marginLeft:30, position:"absolute", right:5, top: -7} :   { width:55, height:25, marginLeft:30}  }/>}

                                {(Boolean(item.actionAvailable) == false) ? <></> : <Image source={arrow} style={{ position: 'absolute', top: 6, right: 8, transform: [{ rotate: item.visible ? '-90deg' : '90deg' }] }} />}
                            </Pressable>

                            {/**
                             * Esta es la linea de abajo.
                             */}
                            {!item.visible ? <></> : <View style={{ borderBottomWidth: 1, marginHorizontal: 10, borderBottomColor: '#CCC' }}/>}

   
                            {!item.subSections || !item.visible ? <></> : item.subSections.map((itemSubSection, indexSubSection) => (
                                <View style={styles.cardContainerInformacionEstacion} key={`mss__${itemSubSection.id}__${indexSubSection}`}>

                                    <Pressable accessibilityHint="Toca 2 veces para activar" style={styles.PressableHeader} onPress={() => {
                                        if (itemSubSection.isLinking) return Linking.openURL(`tel:${itemSubSection.isLinking}`)

                                        if (itemSubSection.routeName) return this.navigationThroughMenu(itemSubSection.routeName)

                                    }}>
                                        <Text style={[Estilos.subtitulos, (actualViewInNavigation == itemSubSection.routeName ? {}  : [Estilos.tipografiaLight, {color:'#43464E'}] ), { marginLeft: '14%', top: 8 }]}>{itemSubSection.title}</Text>

                                        {itemSubSection.isNewOption && <Image source={icono_nuevo} style={{width:55, height:25, position:'absolute', right:70, top:10}}/>}

                                    </Pressable>
                                </View>
                            ))}
                        </View>

                    )
                    )}

                   

                    
                    

                    {/* TIENDA */}

                    {/* { this.state.tiendaURL != "" ?  <View style={[styles.cardContainerInformacionEstacion, {backgroundColor:this.state.tiendaMetroColor} ]} key={`mss__hjj`}>

                        <Pressable accessibilityHint="Toca 2 veces para activar" style={[styles.PressableHeader, {alignContent:"center", justifyContent:"center"}]} onPress={() => {
                            
                            this.navigationThroughMenu("Tienda Metro");

                        }}>
                            <Text style={[Estilos.botonText,  {color:'#FFF', fontWeight:"bold", textAlign:"center"} ]}>{this.state.tiendaTextoBoton}</Text>

                            {this.state.tiendaNuevoVisible && <Image source={icono_nuevo} style={{width:55, height:25, marginLeft:10}}/>}

                            </Pressable>

                    </View> : <></>} */}


                    {/* {
        id: 'menuOpcion6',
        title: '1488',
        visible: 0,
        actionAvailable: 0,
        isLinking: 1488,
        imgUrl: require('./assets/icons/menu/menu_llamada.png'),
        routeName: ''
    }, */}

{/* <View style={styles.cardContainerInformacionEstacion} key={`mss__menuOpcion6__0`}>

<Pressable accessibilityHint="Toca 2 veces para activar" style={styles.PressableHeader} onPress={() => {
   Linking.openURL(`tel:1488`);


}}>
    <Text style={[Estilos.subtitulos, Estilos.tipografiaLight, {color:'#43464E'}, { marginLeft: '14%', top: 8 }]}>1488</Text>

    {/* {itemSubSection.isNewOption && <Image source={icono_nuevo} style={{width:55, height:25, position:'absolute', right:70, top:10}}/>} */}

{/* </Pressable>
</View> */} 




                </View> 

            </DrawerContentScrollView>

        )
    }


    //Accion para moverse entre las rutas.  
    navigationThroughMenu = (title) => {
        const { navigation } = this.state


        console.log("tiendaURL", this.state.tiendaURL);

        if (title == "Tienda Metro") {

            saveData({key:"tiendaURL", value: this.state.tiendaURL}).then(()=> {

                saveData({key:"tiendaTitle", value: this.state.tiendaTextoBoton});


            });
        
        }
        
        navigation.navigate(title, { screen: title.replace('_', '') } )
        
        actualViewInNavigation = title
    }
}