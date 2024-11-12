import React, {useContext, useState} from 'react';
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Button,
    ActivityIndicator
} from "react-native";
import jeep from "../../assets/sabadojeep.jpg"
import Ionicons from '@expo/vector-icons/Ionicons';
import addImage from "../../assets/add-image.png"
import DefaultImage from "../../assets/defaultuser.png"
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {CurrentUserContext} from "../../Context/CurrentUserProvider";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../../api/firebase-config";
import RadioGroup, {RadioButton} from "react-native-radio-buttons-group";

function RequestDriverTrckingBottomSheet({RequestBottomSheet}) {
    const {CurrentUser} = useContext(CurrentUserContext)
    const [isLoading, setisLoading] = useState(false)
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        address: Yup.string().required('Address is required'),
        phoneNumber: Yup.string()
            .matches(/^09\d{9}$/, 'Invalid phone number')
            .required('Phone number is required'),
        jeepName: Yup.string().required('Jeep Name is required'),
        image: Yup.mixed().required('Profile Picture is required'),
        forhire: Yup.mixed().required('Forhire is required'),
        JeepImages: Yup.mixed().required('At least one image is required'),
    });

    const GetProfilePicture = async (setFieldValue) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setFieldValue('image', result);
        }
    };


    console.log("render request")


    const [selectedId, setSelectedId] = useState("");
    const radioButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'yes',
            value: true,
            disabled:isLoading,
            labelStyle: {
                marginLeft:4,
                color: selectedId === "1" ? "#3083FF" : "rgba(96,95,95,0.64)",
                fontFamily: 'PlusJakartaSans-Medium',
            },
            color: selectedId === "1" ? "#3083FF" : "rgba(96,95,95,0.64)"
        },
        {
            id: '2',
            label: 'no',
            value: false,
            disabled:isLoading,
            labelStyle: {
                marginLeft:4,
                color: selectedId === "2" ? "#3083FF" : "rgba(96,95,95,0.64)",
                fontFamily: 'PlusJakartaSans-Medium',
            },
            color: selectedId === "2" ? "#3083FF" : "rgba(96,95,95,0.64)"
        }
    ];
    const GetMultipleImage = async (setFieldValue) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        });
        console.log(result.assets);
        if (!result.canceled) {

            setFieldValue('JeepImages', result);

        }
    }


    async function GetImageDownloadURL(result) {
        const storage = getStorage();
        const uploadPromises = result.assets.map(async (image) => {
            const response = await fetch(image.uri);
            console.log(image)
            const blob = await response.blob();
            const imageRef = ref(storage, `images/${image.fileName}`);
            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);
            console.log('Image uploaded and available at:', downloadURL);
            return downloadURL;
        });


        const downloadURLs = await Promise.all(uploadPromises);
        console.log('All images uploaded:', downloadURLs);
        return downloadURLs;

    }


    const SendRequest = async (values) => {
        setisLoading(true)
        const ProfilePictureUrl = await GetImageDownloadURL(values.image)
        const JeepImages = await GetImageDownloadURL(values.JeepImages)
        try {
            const req = collection(db, "Request");
            const RequestData = {
                id: CurrentUser?.id,
                profilePictureUrl: ProfilePictureUrl,
                firstName: values?.firstName,
                lastName: values?.lastName,
                address: values?.address,
                phoneNumber: values?.phoneNumber,
                JeepName: values?.jeepName,
                jeepImages: JeepImages,
                forHire: values?.forhire,
                status: "pending",
                date: serverTimestamp(),
            }
            await addDoc(req, RequestData);
            console.log("Added Request ");
            setisLoading(false)
        } catch (e) {
            setisLoading(false)
        }
    }

    const ImagePickerCarousel = ({setFieldValue, error, JeepImages}) => {
        return (


            <BottomSheetScrollView showsHorizontalScrollIndicator={false} horizontal={true}
                                   style={{padding: 0, display: "flex"}}>
                <View style={{flexDirection: "row", paddingVertical: 10, paddingLeft: 10}}>


                    <TouchableOpacity onPress={() => GetMultipleImage(setFieldValue)} style={{
                        height: 70,
                        padding: 10,
                        width: 70,
                        backgroundColor: "white",
                        elevation: 2,
                        borderRadius: 15,
                        marginRight: 10
                    }}>
                        <Image source={addImage} style={{
                            width: "100%",
                            opacity: 0.9,
                            top: 3,
                            left: 2,
                            paddingTop: 10,
                            height: "100%",
                            borderRadius: 10
                        }}/>
                    </TouchableOpacity>
                    {JeepImages &&
                        JeepImages?.assets?.map((img, index) => {
                            return (


                                <TouchableOpacity key={index}
                                                  style={{
                                                      height: 70,
                                                      width: 70,
                                                      borderRadius: 15,
                                                      overflow: "hidden",
                                                      marginRight: 10,
                                                  }}>
                                    <Image source={{uri: img.uri}} style={{width: "100%", height: "100%"}}/>
                                </TouchableOpacity>
                            )

                        })


                    }
                    <Text style={RequestStyles.error}>{error}</Text>
                </View>


            </BottomSheetScrollView>


        )


    }

    const Avatar = ({image, setFieldValue, error}) => {
        return (
            <>
                <View style={{
                    width: 120,
                    height: 120,
                    borderWidth: 5,
                    borderColor: "#3083FF",
                    position: "relative",
                    borderRadius: 100,
                }}>
                    {image ? (
                        <Image source={{uri: image?.assets[0]?.uri}} style={{
                            height: "100%",
                            borderRadius: 100, width: "100%",
                        }}/>
                    ) : (
                        <Image source={DefaultImage} style={{
                            height: "100%",
                            borderRadius: 100, width: "100%",
                        }}/>
                    )}

                    <TouchableOpacity onPress={() => GetProfilePicture(setFieldValue)} activeOpacity={1} style={{
                        bottom: -5, borderRadius: 100, padding: 5,
                        borderColor: "#3083FF",
                        borderWidth: 4,
                        backgroundColor: "#fff", right: 0, position: "absolute"
                    }}>
                        <Ionicons name="camera" size={18} color="#605f5f"/>
                    </TouchableOpacity>
                </View>

                {error && <Text style={RequestStyles.error}>{error}</Text>}
            </>
        );
    };




    const  RadioButton =({setFieldValue})=>{

        return (
            <RadioGroup

                radioButtons={radioButtons}
                onPress={(selectedId)=>{
                setSelectedId(selectedId)
                    const button = radioButtons.find(button => button.id === selectedId);
                    setFieldValue('forhire', button?.value);
            }}
                selectedId={selectedId}
                layout={"row"}
                labelStyle={{
                    marginLeft: 4,
                    alignItems: "center",

                    fontFamily: 'PlusJakartaSans-Medium',
                }}

            />
        )
    }

    return (

        <BottomSheet
            ref={RequestBottomSheet}
            snapPoints={['95%']}
            enableOverDrag={true}
            index={-1}
            enablePanDownToClose={true}
            enableContentPanningGesture={true}
            handleIndicatorStyle={{backgroundColor: "#3083FF"}}
            backgroundStyle={{borderRadius: 30, elevation: 10}}>
            <BottomSheetScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
                <View style={RequestStyles.container}>
                    <Text style={RequestStyles.headertxt}>Request Driver Tracking</Text>
                    <Formik
                        initialValues={{
                            firstName: CurrentUser?.name,
                            lastName: '',
                            address: '',
                            phoneNumber: '',
                            jeepName: '',
                            image: null,
                            JeepImages: null,
                            forhire:null,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            await SendRequest(values);
                        }}
                    >
                        {({
                              handleChange,
                              setFieldValue,
                              handleBlur,
                              handleSubmit,
                              values,
                              resetForm,
                              errors,
                              touched
                          }) => (
                            <View style={{paddingHorizontal: 25, gap: 2.5}}>
                                <View  style={{alignItems: "center"}}>
                                    <Avatar
                                        image={values.image}
                                        setFieldValue={setFieldValue}
                                        error={touched.image && errors.image}
                                    />

                                </View>
                                {/* First Name Field */}
                                <Text   style={RequestStyles.label}>First name</Text>
                                <TextInput
                                    editable={!isLoading}
                                    value={values.firstName}
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    placeholderTextColor={"rgba(96,95,95,0.64)"}
                                    style={[
                                        RequestStyles.input,
                                        {
                                            borderColor: touched.firstName && errors.firstName ? 'rgba(245,106,106,0.95)' : '#ccc',
                                            borderWidth: 1
                                        }
                                    ]}
                                    placeholder={"e.g., John "}
                                />
                                {touched.firstName && errors.firstName && (
                                    <Text style={RequestStyles.error}>{errors.firstName}</Text>
                                )}

                                {/* Last Name Field */}
                                <Text  style={RequestStyles.label}>Last name</Text>
                                <TextInput
                                    editable={!isLoading}
                                    value={values.lastName}
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    placeholderTextColor={"rgba(96,95,95,0.64)"}
                                    style={[
                                        RequestStyles.input,
                                        {
                                            borderColor: touched.lastName && errors.lastName ? 'rgba(245,106,106,0.95)' : '#ccc',
                                            borderWidth: 1
                                        }
                                    ]}
                                    placeholder={"e.g., Doe"}
                                />
                                {touched.lastName && errors.lastName && (
                                    <Text  style={RequestStyles.error}>{errors.lastName}</Text>
                                )}

                                {/* Address Field */}
                                <Text style={RequestStyles.label}>Address</Text>
                                <TextInput
                                    editable={!isLoading}
                                    value={values.address}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    placeholderTextColor={"rgba(96,95,95,0.64)"}
                                    style={[
                                        RequestStyles.input,
                                        {
                                            borderColor: touched.address && errors.address ? 'rgba(245,106,106,0.95)' : '#ccc',
                                            borderWidth: 1
                                        }
                                    ]}
                                    placeholder={"e.g., Alilem Ilocos Sur"}
                                />
                                {touched.address && errors.address && (
                                    <Text style={RequestStyles.error}>{errors.address}</Text>
                                )}

                                {/* Phone Number Field */}
                                <Text style={RequestStyles.label}>Phone number</Text>
                                <TextInput
                                    editable={!isLoading}
                                    maxLength={11}
                                    value={values.phoneNumber}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                    placeholderTextColor={"rgba(96,95,95,0.64)"}
                                    style={[
                                        RequestStyles.input,
                                        {
                                            borderColor: touched.phoneNumber && errors.phoneNumber ? 'rgba(245,106,106,0.95)' : '#ccc',
                                            borderWidth: 1
                                        }
                                    ]}
                                    placeholder={"e.g., 0923456798"}
                                    keyboardType="phone-pad"
                                />
                                {touched.phoneNumber && errors.phoneNumber && (
                                    <Text style={RequestStyles.error}>{errors.phoneNumber}</Text>
                                )}

                                {/* Jeep Name Field */}
                                <Text style={RequestStyles.label}>Jeep name</Text>
                                <TextInput
                                    editable={!isLoading}
                                    value={values.jeepName}
                                    onChangeText={handleChange('jeepName')}
                                    onBlur={handleBlur('jeepName')}
                                    placeholderTextColor={"rgba(96,95,95,0.64)"}
                                    style={[
                                        RequestStyles.input,
                                        {
                                            borderColor: touched.jeepName && errors.jeepName ? 'rgba(245,106,106,0.95)' : '#ccc',
                                            borderWidth: 1
                                        }
                                    ]}
                                    placeholder={"e.g., Gemini"}
                                />
                                {touched.jeepName && errors.jeepName && (
                                    <Text style={RequestStyles.error}>{errors.jeepName}</Text>
                                )}


                                <ImagePickerCarousel

                                    JeepImages={values.JeepImages}
                                    setFieldValue={setFieldValue}
                                    error={touched.JeepImages && errors.JeepImages}

                                />
                                <Text style={RequestStyles.label}>is your Jeep is for hire?</Text>
                                <View style={{flexDirection: "column", paddingBottom: 8}}>

                                    <RadioButton   setFieldValue={setFieldValue} />

                                    {touched.forhire && errors.forhire && (
                                        <Text style={RequestStyles.error}>{errors.forhire}</Text>
                                    )}

                                </View>

                                <View style={RequestStyles.btncon}>
                                    <TouchableOpacity disabled={isLoading} onPress={handleSubmit} activeOpacity={0.8}
                                                      style={RequestStyles.btn}>

                                        {isLoading ? <ActivityIndicator size="small" color="#fff"/> :
                                            <Text style={RequestStyles.btntxt}>Send Request</Text>}
                                    </TouchableOpacity>


                                </View>
                            </View>

                        )}


                    </Formik>


                </View>


            </BottomSheetScrollView>

        </BottomSheet>


    );
}

export default RequestDriverTrckingBottomSheet;


const RequestStyles = StyleSheet.create({
    container: {
        flex: 1,

        // paddingHorizontal: 30,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        color: '#605f5f',
        fontFamily: 'PlusJakartaSans-Medium',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingRight: 25,
        backgroundColor: '#ffffff',
    }, headertxt: {
        padding: 25,

        fontSize: 15,
        color: '#605f5f',
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: 10,
        paddingVertical: 5,
    }, label: {
        fontSize: 12.5,
        color: '#3083FF',
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans-Medium',
    }, btncon: {
        height: 45,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        gap: 5,
        borderRadius: 10,
    }, btn: {
        backgroundColor: '#3083FF',
        padding: 7,
        elevation: 3,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',

        height: "100%",
        width: "100%",
        paddingHorizontal: 20,
        gap: 0,
        flexDirection: 'row',
    }, btntxt: {

        color: '#fff',
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Medium",
    }, error: {
        color: '#f56a6a',
        fontSize: 10,
        fontFamily: "PlusJakartaSans-Medium",
    }

})