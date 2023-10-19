
import { Alert, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect, useCallback } from 'react';
import styled from './styled';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function Linguages({ ChangeLanguage }) {
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [OpenLinguages, setOpenLinguages] = useState(false)
    const [languages, setLanguages] = useState([])

    async function getDicionary() {
        try {
            const { data } = await axios.get('https://7980-168-181-202-45.ngrok.io/languages')
            setLanguages(data)
            await AsyncStorage.setItem('languages', JSON.stringify(data))
        }
        catch (error) {
            Alert.alert('Erro', "Erro ao recuperar as linguages", [
                { text: 'ok' }
            ])
        }
    }

    async function chanceLanguage() {
        if (!selectedLanguage) return
        try {
            const { data } = await axios.get(`https://7980-168-181-202-45.ngrok.io/${selectedLanguage}`)
            await AsyncStorage.setItem('languageSelected', JSON.stringify(data[0]))
            ChangeLanguage()
        }
        catch (error) {
            Alert.alert('Erro', "Erro ao recuperar as traduções", [
                { text: 'ok' }
            ])
        }
    }

    useFocusEffect(
        useCallback(() => {
            getDicionary()
            chanceLanguage()
        }, [])
    );

    useEffect(() => {
    }, [selectedLanguage])


    return (
        <View style={styled.linguage}>

            { }
            <TouchableOpacity onPress={() => setOpenLinguages(!OpenLinguages)}>
                <Icon name="globe" size={30} color="black" />
            </TouchableOpacity>

            {OpenLinguages && languages.length != 0 ? (
                <Picker
                    style={styled.selectLinguage}
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                >
                    {languages && languages.map((item) => {
                        const key = Object.keys(item)
                        return (
                            <Picker.Item label={key.toString()} value={key.toString()} />
                        )
                    })}
                </Picker>

            ) : null}
        </View>
    )
}