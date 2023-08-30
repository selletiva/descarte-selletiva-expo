import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AWS from 'aws-sdk';
import base64 from 'base64-js';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  Button,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// import MapWithRoute from '../../components/mapa';
import { useAuth } from '../../hooks/useAuth';
import { StackAuthenticatedParamList } from '../../routes';
import Api from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spiner } from '../../components/Spiner';
import Spinner from 'react-native-loading-spinner-overlay';
import Map from '../../components/maps';

type returnDatas = {
  id: Number;
  name: string;
};

export function Register() {
  const [chargeExist, setChargeExist] = useState(null)
  const [dischargeExist, setDIschargeExist] = useState(null)
  const [documentExist, setDocumentExist] = useState(null)
  const { user } = useAuth();
  const [documento, setDocumento] = useState('Selecionar');
  const [unidade, setUnidade] = useState('Selecionar');
  const [N_Documento, setN_Documento] = useState('0');
  const [peso, setPeso] = useState('0');
  const [nameSave, setNameSave] = useState('Salvar')
  const [see, setSee] = useState(false);
  const [arrayTipoDocumento, setArrayTipoDocumento] = useState<returnDatas[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const allLocations = { carga: null, descarga: null, documento: null }
  const [documentoExist, setDocumentoExist] = useState(null)

  const route = useRoute();

  const navigation = useNavigation<NativeStackNavigationProp<StackAuthenticatedParamList>>();

  async function handleLocationToCam(type) {
    const { id }: any = route.params;
    navigation.navigate('Cam', { id, type });
  }
  function setActive() {
    setSee(false);
  }
  async function getDatas() {
    try {
      const id: any = route.params;
      await AsyncStorage.setItem('idHistorico', JSON.stringify(id.id));

      const tipoDocumento = await Api.get('/getTiposDocs', {
        headers: {
          Authorization: user.auth_key,
        },
      });

      setArrayTipoDocumento(tipoDocumento.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao recuperar solicitação', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }

  }

  async function handleSaveDoc() {
    const { id }: any = route.params;
    if (
      unidade === 'Selecionar' ||
      N_Documento === '0' ||
      documento === 'Selecionar' || documento === 'Já registrado' ||
      peso === '0'
    ) {
      setSee(true);
      return;
    }
    const document = {

      document: {
        documentTypeId: documento,
        unit: unidade,
        number: N_Documento,
        weight: peso,

      }
    };
    const nameMemory = JSON.stringify(id)
    try {
      await AsyncStorage.mergeItem(nameMemory, JSON.stringify(document))
      Alert.alert('Sucess', 'Salvo com sucesso', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } catch {
      await AsyncStorage.setItem(nameMemory, JSON.stringify(document))
    }

  }

  async function getPictures() {

    const { id }: any = route.params;
    const nameMemory = JSON.stringify(id)
    const dado = await AsyncStorage.getItem(nameMemory)
    const local = JSON.parse(dado)

    if (local.document) {
      setDocumentoExist(true)
      setNameSave("Reenviar")
      setDocumento('Já registrado'),
        setUnidade(local.document.unit)
      setPeso(local.document.weight)
      setN_Documento(local.document.number)
    }
    if (local.carga) {
      setChargeExist({ uri: local.carga.uri, lat: local.carga.lat, lng: local.carga.lng, name: 'Carga' })
    }
    if (local.descarga) {
      setDIschargeExist({ uri: local.descarga.uri, lat: local.descarga.lat, lng: local.descarga.lng, name: 'Descarga' })
    }
    if (local.documento) {
      setDocumentExist({ uri: local.documento.uri, lat: local.documento.lat, lng: local.documento.lng, name: 'Documento' })
    }
  }


  async function sandToS3(name, buffer) {
    const decodedBuffer = base64.toByteArray(buffer);;
    const s3 = new AWS.S3({
      accessKeyId: 'AKIATRERF4CVSURP3COX',
      secretAccessKey: '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',
      region: 'us-east-2',
    });
    const datas = {
      Bucket: 'sistema-selletiva/evidence_new',
      Key: name + Date.now() + '.jpeg',
      Body: decodedBuffer,
    };
    try {
      const { Location } = await s3.upload(datas).promise();
      allLocations[name] = Location
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar evidências no s3', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  }
  async function sendBackend() {
    if(!documentoExist || !chargeExist || !dischargeExist || !documentExist ){
      Alert.alert('Conflito', 'Cadastrar as demais informações', [
        { text: 'OK'},
      ]);
      return
    }
    setIsLoading(true)
    const { id }: any = route.params;
    const folderName = id.toString();
    const folderInfo = await MediaLibrary.getAlbumAsync(folderName);
    const async = await AsyncStorage.getItem(folderName)
    const coords = JSON.parse(async)
    const { assets } = await MediaLibrary.getAssetsAsync({
      album: folderInfo,
      mediaType: [MediaLibrary.MediaType.photo],
    });

    const locations = ['carga', 'descarga', 'documento']
    locations.map(async (item, indice) => {
      const pictureUri = coords[item]
      const evidence64 = await FileSystem.readAsStringAsync(pictureUri.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await sandToS3(item, evidence64)
      handleFinalized()
    })
  }


  async function handleFinalized() {
    const { id }: any = route.params;
    const document = await AsyncStorage.getItem(id.toString());
    const async = JSON.parse(document);
    const objctSend = {
      chargeEvidence: {
        date: new Date(),
        name: allLocations.carga,
        location: { lat: async['carga'].lat, lng: async['carga'].lng },
      },
      dischargeEvidence: {
        date: new Date(),
        name: allLocations.descarga,
        location: { lat: async['descarga'].lat, lng: async['descarga'].lng },
      },
      documentEvidence: {
        date: new Date(),
        name: allLocations.documento,
        location: { lat: async['documento'].lat, lng: async['documento'].lng },
      },
      document: async.document,
      historicoEstoqueId: id,
      s3: true,
    };

    await uploadDatas(objctSend)
  }

  async function uploadDatas(objctSend: any) {
    const { id }: any = route.params;
    const nameMemory = JSON.stringify(id)
    const folderName = id.toString();
    try {
      await Api.post('/', objctSend, {
        headers: {
          Authorization: user.auth_key,
        },
      });
      AsyncStorage.removeItem(nameMemory)
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${folderName}`, { idempotent: true });
      setIsLoading(false)

      Alert.alert('Sucesso', 'Evidências gravadas com sucesso', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      setIsLoading(false)

      Alert.alert('Erro', 'Erro ao salvar evidências', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }

  }

  async function handleDeleteEvidence(param: string) {
    const { id }: any = route.params;
    const nameMemory = JSON.stringify(id)
    Alert.alert('Deletar evidência', `Deseja deletar a evidência de ${param}`, [
      { text: 'Cancelar' },
      { text: 'Deletar', onPress: () => AceptExcluir(param, id, nameMemory) }
    ]);
  }

  async function AceptExcluir(param, id, nameMemory) {
    const folderInfo = await MediaLibrary.getAlbumAsync(id.toString());

    const { assets } = await MediaLibrary.getAssetsAsync({
      album: folderInfo,
      mediaType: [MediaLibrary.MediaType.photo],
    });
    const deleteItem = assets.filter((item) => item.filename == `${param}.jpg`)
    const deleteEvidence = await AsyncStorage.getItem(nameMemory);


    const asyncJson = JSON.parse(deleteEvidence);

    try {
      await MediaLibrary.deleteAssetsAsync(deleteItem[0]);
      delete asyncJson[param];
      await AsyncStorage.setItem(nameMemory, JSON.stringify(asyncJson));
      if (param == 'carga') {
        setChargeExist(null)
      }
      if (param == 'descarga') {
        setDIschargeExist(null)
      }
      if (param == 'documento') {
        setDocumentExist(null)
      }
    } catch {
      Alert.alert('Erro', 'Erro ao excluir evidência', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  }
  useFocusEffect(
    useCallback(() => {
      getPictures();
      getDatas();
    }, [])
  );
  return (
    <SafeAreaView style={styles.main}>
      <Spinner
        visible={isLoading}
        textContent={'Enviando evidências...'}
        textStyle={{ color: '#FFF' }}
      />
      {/* {showMap ?? <MapWithRoute onClose={handleMapa} />} */}
      {see === true ? (
        <View style={styles.centeredView}>
          <Modal animationType="slide" transparent={true} visible={see}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Por favor, preencha os campos vazios!
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setActive()}>
                  <Text style={styles.textStyle}>Ok!</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.selectOption}>
        <Text style={styles.text}>Tipo de Documento: </Text>
        <Picker
          style={styles.padron}
          onValueChange={itemValue => setDocumento(itemValue)}
          selectedValue={documento}>
          <Picker.Item label={documento} value={documento} />
          {arrayTipoDocumento.map(options => {
            return (
              <Picker.Item
                key={options.id.toString()}
                label={options.name}
                value={options.id}
              />
            );
          })}
        </Picker>
        <View style={styles.flexView}>
          <View>
            <Text style={styles.text}>Peso: </Text>
            <TextInput
              keyboardType="numeric"
              value={peso}
              style={styles.input}
              onChangeText={pesoDoc => setPeso(pesoDoc)}
            />
          </View>
          <View style={styles.teste}>
            <Text style={styles.text}>Unidade: </Text>
            <Picker
              onValueChange={itemValue => setUnidade(itemValue)}
              selectedValue={unidade}>
              <Picker.Item label={'Selecionar'} value={'Selecionar'} />
              <Picker.Item label={'UN'} value={'UN'} />
              <Picker.Item label={'L'} value={'L'} />
              <Picker.Item label={'Kg'} value={'KG'} />
            </Picker>
          </View>
        </View>
      </View>

      <Text style={styles.text}>Nº documento: </Text>
      <TextInput
        value={N_Documento}
        keyboardType="numeric"
        style={styles.input}
        onChangeText={numeroDoc => setN_Documento(numeroDoc)}
      />
      <TouchableOpacity onPress={handleSaveDoc} style={styles.saveDoc}>
        <Text style={{ color: 'white' }}>{nameSave}</Text>
      </TouchableOpacity>

      <View style={styles.toCam}>
        {chargeExist ? (
          <TouchableOpacity style={styles.viewEvidences} onPress={() => handleDeleteEvidence('carga')}>
            <Text>{chargeExist.name}</Text>
            <Text style={{ color: 'grey' }}>Click para excluir</Text>
            <Image source={{ uri: chargeExist.uri }} style={styles.evidence}></Image>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.buttonCam}
            onPress={() => handleLocationToCam('carga')}>
            <Text style={styles.text}>Carga</Text>
            <Icon name="camera" size={30} color="#370acd" />
          </TouchableOpacity>
        )}
        {dischargeExist ? (
          <TouchableOpacity onPress={() => handleDeleteEvidence('descarga')} style={styles.viewEvidences} >
            <Text>{dischargeExist.name}</Text>
            <Text style={{ color: 'grey' }}>Click para excluir</Text>
            <Image source={{ uri: dischargeExist.uri }} style={styles.evidence}></Image>

          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.buttonCam}
            onPress={() => handleLocationToCam('descarga')}>
            <Text style={styles.text}>Descarga</Text>
            <Icon name="camera" size={30} color="#370acd" />
          </TouchableOpacity>
        )}
        {documentExist ? (
          <TouchableOpacity style={styles.viewEvidences} onPress={() => handleDeleteEvidence('documento')}>
            <Text>{documentExist.name}</Text>
            <Text style={{ color: 'grey' }}>Click para excluir</Text>
            <ImageBackground source={{ uri: documentExist.uri }} style={styles.evidence}></ImageBackground>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.buttonCam}
            onPress={() => handleLocationToCam('documento')}>
            <Text style={styles.text}>Documento</Text>
            <Icon name="camera" size={30} color="#370acd" />
          </TouchableOpacity>

        )}
      </View>
        <TouchableOpacity onPress={sendBackend} style={styles.sendEvidencesView}>
          <Text style={{ color: 'white' }}>Enviar</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
   
}

const styles = StyleSheet.create({
  padron: {
    width: 'auto',
    color: 'black',
  },
  main: {
    margin: 20,
    marginTop: 30,
  },
  selectOption: {
    flexDirection: 'column',
  },

  text: {
    color: 'black',
    fontSize: 15,
  },
  toCam: {
    width: '100%',
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'row'
  },
  buttonCam: {
    backgroundColor: '#bcbcbc',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    padding: 10,
    borderRadius: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    marginTop: '50%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  teste: {
    flexDirection: 'column',
    width: '50%',
  },

  saveDoc: {
    alignSelf: 'center',
    backgroundColor: 'blue',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    borderRadius: 5,
    paddingTop: 5,
  },
  evidence: {
    height: 200,
    width: 100,
    borderRadius: 5,
    margin: 2,

  },
  sendEvidencesView: {
    backgroundColor: '#008000',
    height: 30,
    justifyContent: 'center',
    borderRadius: 5,
    bottom: -10,
    alignItems: 'center',

  },

  viewEvidences: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});
