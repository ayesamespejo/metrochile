import React from 'react'
import { Share, Pressable } from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialIcons';
import CompartirAndroidAgendaCultural from '../../assets/svg/cultura_comunidad/CompartirAndroidAgendaCultural.svg'
import CompartirIOSAgendaCultural from '../../assets/svg/cultura_comunidad/CompartirIOSAgendaCultural.svg'
const ShareIcon = ({message, style, color}) => {
  const onShare = async () => {
    try {
      const result = await Share.share({ message: message })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Accion cuando se comparte
        } else {
          //  Accion cuando se comparte y te sales de la aplicación
        }
      } else if (result.action === Share.dismissedAction) {
        // Accion cuando retrocedes y no escoges ninguna accion.
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * Constante del PlatForm para escoger el icono del FontAwesome
   */
  // const shareIcon =  Platform.select({
  //   ios: 'ios-share',
  //   default: 'share'
  // })

  return  (
    <Pressable onPress={onShare}>
      {Platform.OS == 'ios' && <CompartirIOSAgendaCultural width={40}  height={40} fill={color} style={style}/>}
      {Platform.OS != 'ios' && <CompartirAndroidAgendaCultural idAgendaCultural width={40}  height={40} style={style}/>}
       {/* <Icon style={style} name={shareIcon}/>  */}
    </Pressable>
  )
}

export default ShareIcon