import { NativeModules } from 'react-native'
import XMLParser from 'react-xml-parser'
//import DeviceInfo from 'react-native-device-info'

const apiUrl = 'https://86fsa65x2f.execute-api.us-east-1.amazonaws.com/dev_anticipa_js_gnat'

const inputData = {
    codOperador: 185,
    codApp: 9,
    password: '1234',
    uuid: '1234567890',
    email: 'micorreo@gmail.com',
    rut: '33333336-8',
    nombres: 'Juan Roberto',
    apellidos: 'Perez Zapata',
    cell: '+56966762554',
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml', // Indica que estás enviando XML en el cuerpo
    },
    body: '', // El XML que va a enviar
  }

export const obtenerURLClaveUnica = () => {
      // Obtener datos desde la Libreria C2D de movired
      const moviredLibData = NativeModules.MoviredC2D.crearEnrolamiento(inputData)
      try {
        const jsonObjectData = JSON.parse(moviredLibData)
        console.log('======================NativeModules.MoviredC2D.crearEnrolamiento========================')
        console.log(JSON.stringify(jsonObjectData))
        console.log('==============================================')
        // TODO: Crear los casos de borde para errores
        // Datos a pegar en el XML
        const data = JSON.stringify(jsonObjectData.data)
        console.log('=========DATOS ENROLAMIENTO========')
        console.log(data)
        // Actualizar timestamp
        // const currentDateTime = moment().format('YYYY-MM-DDTHH:mm:ss');
        const fechaActual = new Date()
        const fechaTexto = fechaActual.toISOString().slice(0, -5)
        console.log('FECHA ===================== ', fechaTexto.slice(0, -5))
  
        const xmlData = `<?xml version="1.0" encoding="ISO-8859-1"?>
                         <FID_TM_ROOT 
                          NumeroComercio="237216" 
                          TipoMensaje="0200" 
                          CodigoProceso="468801">
                              <TM0200468801 
                                  NroAuditoriaTerminal="000004" 
                                  FechaHoraTerminal="${fechaTexto}" 
                                  IdentTerminal="0020100931"
                                  Vapp="07.04.07"/>
                          </FID_TM_ROOT>`
        console.log('Datos formateados para enviar a AWS: ', xmlData)
        // Enviar los datos al AWS endpoint
        requestOptions.body = xmlData
        fetch(apiUrl, requestOptions)
          .then((response) => response.text())
          .then((responseData) => {
            // Esto mostrará la respuesta de tu función Lambda del endpoint
            // corresponde a la respuesta desde movired
            // console.log('Respuesta desde AWS endpoint: ', responseData)
            // setTexto(texto)
            const responseJSON = JSON.parse(responseData)
            console.log(responseJSON.message)
            console.log('----------XML-------------')
            const CUUrl = new XMLParser()
              .parseFromString(responseJSON.message)
              .children[0].attributes.CUUrl.replace(/&amp;/g, '&')
            const CUTokenPaso = new XMLParser().parseFromString(responseJSON.message).children[0].attributes.CUToken
            // setCUToken(CUTokenPaso)
            const CodigoRespuesta = new XMLParser().parseFromString(responseJSON.message).children[0].attributes
              .CodigoRespuesta
            console.log(CUUrl.replace(/&amp;/g, '&'))
            console.log('=============================================')
            console.log(CUTokenPaso)
            console.log('=============================================')
            return({
                CUURL: CUUrl.replace(/&amp;/g, '&'),
                CUToken: CUTokenPaso,
            })
            // console.log(JSON.parse(responseData).message)
            props.navigation.push('WebViewClaveUnica', { url: CUUrl })
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      } catch (error) {
        console.error('Error al analizar JSON:', error)
      }
  }
