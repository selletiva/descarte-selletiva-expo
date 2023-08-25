import { ActivityIndicator } from 'react-native';

export function Spiner({ showSpiner }: any) {
  return (
    <>
      {showSpiner === true ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <></>
      )}
    </>
  );
}
