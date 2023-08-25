import { StyleSheet } from 'react-native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'f0f0f5',
  },
  signOut: {
    alignItems: 'flex-end',
  },
  infoUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  iconButton: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  viewTextButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 20,
    color: '#FFF',
  },
  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 70,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginTop: 5,
    flexDirection: 'row',
  },
  detailsItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reload: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  iconReload: {
    alignItems: 'center',
    padding: 5,
  },
  textReload: {
    color: 'grey',
  },
});

export default styled;
