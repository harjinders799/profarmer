
// import React, { useEffect, useState } from 'react'
// import admob, { BannerAd, BannerAdSize, MaxAdContentRating } from '@react-native-firebase/admob';
// import { ActivityIndicator, Keyboard, View } from 'react-native';

// export default function AdBanner() {
//     const adUnitId = 'ca-app-pub-6881731369317458/7784347718';
//     const [visible, setVisible] = useState(false);
//     const [render, setRender] = useState(false);
//     const [isKeyboardVisible, setKeyboardVisible] = useState(false);

//     useEffect(() => {
//         setRender(true)
//         setTimeout(async () => {
//             await admob().setRequestConfiguration({
//                 maxAdContentRating: MaxAdContentRating.PG,
//                 tagForChildDirectedTreatment: true,
//                 tagForUnderAgeOfConsent: false,
//             }).then(() => setRender(false))
//                 .catch(err => console.error(err, '>>>erroor'))
//         }, 2000);
//     }, []);

//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener(
//             'keyboardDidShow',
//             () => {
//                 setKeyboardVisible(true); // or some other action
//             }
//         );
//         const keyboardDidHideListener = Keyboard.addListener(
//             'keyboardDidHide',
//             () => {
//                 setKeyboardVisible(false); // or some other action
//             }
//         );

//         return () => {
//             keyboardDidHideListener.remove();
//             keyboardDidShowListener.remove();
//         };
//     }, []);
//     return (
//         render || isKeyboardVisible ?
//             null :
//             <View style={{ display: 'flex' }}>
//                 {!visible ? <ActivityIndicator style={{ position: 'absolute', alignSelf: 'center', top: '30%' }} /> : null}
//                 <BannerAd
//                     unitId={adUnitId}
//                     size={BannerAdSize.SMART_BANNER}
//                     requestOptions={{
//                         requestNonPersonalizedAdsOnly: true,
//                     }}
//                     onAdLoaded={() => {
//                         setVisible(true)
//                     }}
//                     onAdFailedToLoad={(error) => {
//                         console.error('Advert failed to load: ', error);
//                         setVisible(false);
//                     }}
//                 />
//             </View>
//     )
// }