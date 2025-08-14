import { Pressable, StyleSheet, Text, View, Dimensions, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'

import Estilos from '../Estilos'
import Imagen from '../assets/svg/combobox/image.svg'
import Photo from '../assets/svg/combobox/photo.svg'
import Documento from '../assets/svg/combobox/document.svg'
import AddPlus from '../assets/svg/comun/AddPlus.svg'
import Globals from '../Globals'

const BotonArchivo = ({ onTomarImagen, maxKb = 0 }) => {
  const [imagen, setImagen] = useState(false)
  const [documento, setDocumento] = useState(false);
  
  const [muestraSelectorDocumento, setMuestraSelectorDocumento] = useState(false)

  useEffect(() => {})

  const styles = StyleSheet.create({
    contenedorGeneral: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      paddingHorizontal: 15,
      // padding: 20,
      // paddingBottom: 10,
    },
    containerComboClaro: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    containerSelectorArchivo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      width: '95%',
    },
    contenedorDatePicker: {
      alignItems: 'center',
    },
    contenedorTexto: {
      height: 45,
      alignItems: 'center',
    },
    texto: {
      fontSize: 16,
    },
    contenedorSeparador: {
      alignItems: 'center',
    },
    separador: {
      width: '100%',
      height: 1,
      backgroundColor: '#CCCCCC',
    },
    contenedorImagen: {
      padding: 10,
      alignItems: 'center',
    },
    imagen: {
      height: 200,
      width: 200,
    },
        contenedorSeparador: {
      alignItems: 'center',
    },
    separador: {
      width: '100%',
      height: 1,
      backgroundColor: Globals.COLOR.GRIS_3,
    },
  })

  const seleccionarImagen = () => {
    const opciones = {
      title: 'Sellecciona una imagen',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    launchImageLibrary(opciones, (response) => {
      if (response.errorCode) {
        console.log(response.errorMessage)
      } else if (response.didCancel) {
        console.log('Se canceló la la imagen')
      } else {
        if (maxKb > 0 && maxKb * 1000 <= response.assets[0].fileSize) {
          Alert.alert('El tamaño máximo del archivo es de 5Mb', 'Por favor selecciona otro archivo')
        } else {
          setImagen({...response.assets[0], name: response.assets[0].fileName})
          onTomarImagen({...response.assets[0], name: response.assets[0].fileName})
        }
      }
    })
  }

  const seleccionarDocumento = () => {
    try {
      DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.images,
        ],
      }).then((doc) => {
        if (maxKb > 0 && maxKb * 1000 <= doc[0].fileSize) {
          Alert.alert('El tamaño máximo del archivo es de 5Mb', 'Por favor selecciona otro archivo')
        } else {
          if (doc[0].type == 'image/jpeg') {
            setImagen(doc[0])
          } else {
            // console.log('No es imagen, no se muestra')
            setDocumento(doc[0])
          }
          onTomarImagen(doc[0])
        }
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) console.log('Usuario canceló selección de documento')
      else console.log(err)
    }
  }

  const tomarFoto = () => {
    const opciones = {
      title: 'Tomar una foto',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true,
    }
    launchCamera(opciones, (response) => {
      if (response.errorCode) {
        console.log(response.errorMessage)
      } else if (response.didCancel) {
        console.log('Se canceló la foto')
      } else {
        if (maxKb > 0 && maxKb * 1000 <= response.assets[0].fileSize) {
          Alert.alert('El tamaño máximo del archivo es de 5Mb', 'Por favor selecciona otro archivo')
        } else {
          setImagen({ ...response.assets[0], name: response.assets[0].fileName })
          onTomarImagen({ ...response.assets[0], name: response.assets[0].fileName })
        }
      }
    })
  }

  const cancelar = () => {
    setImagen(false)
    setDocumento(false)
    onTomarImagen(false)
    setMuestraSelectorDocumento(false)
  }

  return (
    <View style={styles.contenedorGeneral}>
      <Pressable
        onPress={() => {
          if (imagen || documento) {
            cancelar()
          } else {
            setMuestraSelectorDocumento(!muestraSelectorDocumento)
          }
        }}
      >
        <View style={[styles.containerComboClaro, styles.contenedorTexto]}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[Estilos.textoGeneral, { color: Globals.COLOR.GRIS_4, width: '90%' }]}
          >
            {imagen ? imagen.name : documento ? documento.name : 'Selecciona un archivo'}
          </Text>
          {!imagen && (
            <AddPlus
              width={20}
              height={20}
              fill={Globals.COLOR.GRIS_3}
              style={{ transform: [{ rotate: muestraSelectorDocumento ? '45deg' : '0deg' }] }}
            />
          )}
          {imagen && (
            <AddPlus
              width={15}
              height={15}
              fill={Globals.COLOR.GRIS_3}
              style={{ transform: [{ rotate: muestraSelectorDocumento ? '45deg' : '0deg' }] }}
            />
          )}
        </View>
      </Pressable>
      {muestraSelectorDocumento && !imagen.uri && (
        <View style={{ alignItems: 'center' }}>
            <View style={[styles.separador]} />
          <View style={[styles.containerSelectorArchivo, styles.contenedorTexto, { marginTop: 20, marginBottom: 15 }]}>
            <Pressable onPress={() => tomarFoto()}>
              <View style={{ alignItems: 'center' }}>
                <Photo width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                <Text style={[Estilos.textoGeneral, { color: Globals.COLOR.GRIS_4, marginTop: 8 }]}>Cámara</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => seleccionarImagen()}>
              <View style={{ alignItems: 'center' }}>
                <Imagen width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                <Text style={[Estilos.textoGeneral, { color: Globals.COLOR.GRIS_4, marginTop: 8 }]}>Foto</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => seleccionarDocumento()}>
              <View style={{ alignItems: 'center' }}>
                <Documento width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                <Text style={[Estilos.textoGeneral, { color: Globals.COLOR.GRIS_4, marginTop: 8 }]}>Documento</Text>
              </View>
            </Pressable>
            {/* <Pressable onPress={() => cancelar()}>
            <XmarkSolid width={20} height={20} />
          </Pressable> */}
          </View>
        </View>
      )}
      {imagen.uri && (
        <View>
          <View>
            <View style={styles.contenedorSeparador}>
              <View style={styles.separador} />
            </View>
          </View>
          {imagen.uri && (
            <View style={styles.contenedorImagen}>
              <Image source={{ uri: imagen.uri }} style={styles.imagen} />
            </View>
          )}
          {/* <View style={{flexDirection: 'row', borderColor: Globals.COLOR.GRIS_SEPARADOR, borderTopWidth:1}}>
            <View style={{flex: 1, alignItems: 'center', padding: WIDTH*0.04}}>
              <Pressable onPress={() => console.log('Aceptar imagen')}>
                <Text style={[Estilos.tipografiaMedium, {fontSize: 16, color: '#0798EA'}]}>Aceptar</Text>
              </Pressable>
            </View>
            <View style={{flex: 1, alignItems: 'center', borderColor: Globals.COLOR.GRIS_SEPARADOR, borderLeftWidth: 1, padding: WIDTH*0.04}}>
              <Pressable onPress={() => {console.log('Cancelar imagen')}}>
                <Text style={[Estilos.tipografiaMedium, {fontSize: 16}]}>Cancelar</Text>
              </Pressable>
            </View>
          </View> */}
        </View>
      )}
    </View>
  )
}

export default BotonArchivo
