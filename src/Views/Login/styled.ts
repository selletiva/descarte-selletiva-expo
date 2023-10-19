import { StyleSheet } from 'react-native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'f0f0f5',
    justifyContent: 'center',
  },
  linguage: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center'
  },
  selectLinguage: {
    width: '80%',
    height: '30%',
  },
  optionLanguage: {
    height: '40%',
  },

  viewIcon: {
    backgroundColor: 'transparent',
  },

  viewTextSign: {
    backgroundColor: 'transparent',
    marginRight: 130,
  },

  button: {
    backgroundColor: '#005B8F',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    justifyContent: 'center'

  },
  iconButton: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTextButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 20,
    color: '#FFF',
    marginRight: 45,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#005B8F',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styled;
