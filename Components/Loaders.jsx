import {Dimensions, Text, View} from "react-native";
import React from "react";
import Carousel from "react-native-reanimated-carousel";
import {MotiView} from "moti";
import {Skeleton} from "moti/skeleton";

const width = Dimensions.get('window').width;

export const CarouselSkeleton = () => {


    const colorMode = 'light';

    return (

        <Carousel
            loop

            mode={"parallax"}
            width={width}
            autoPlay={false}
            overscrollEnabled={true}
            pagingEnabled={true}
            data={Array.from({ length: 3 })}
            snapEnabled
            renderItem={({item, index}) => (

                <View style={{

                    borderRadius: 20,
                    flex:1,

                    marginHorizontal: 6

                }}>

                    <MotiView
                        transition={{
                            type: 'timing',
                        }}
                        style={{
                            padding: 20,
                            flex:1,
                            borderRadius: 10,
                            gap: 5,

                            elevation: 3
                        }}
                        animate={{backgroundColor: '#ffffff'}}
                    >
                        <MotiView style={{paddingBottom:10,flexDirection: "row",gap:20,alignItems:"center"}}>

                            <Skeleton height={90} colorMode={colorMode} width={90}/>
                            <MotiView style={{flexDirection:"column",gap:3,flex:1}}>

                                <Skeleton height={15}  colorMode={colorMode} width={'100%'}/>

                                <Skeleton height={15} colorMode={colorMode } width={'85%'}/>

                                <Skeleton height={15} colorMode={colorMode} width={'80%'}/>
                            </MotiView>
                        </MotiView>
                     <MotiView  style={{flexDirection:"column",gap:3,flex:1}}>

                         <Skeleton height={15} colorMode={colorMode} width={'100%'}/>
                         <Skeleton height={15} colorMode={colorMode} width={'85%'}/>
                         <Skeleton height={15} colorMode={colorMode} width={'70%'}/>
                         <Skeleton height={15} colorMode={colorMode} width={'70%'}/>
                     </MotiView>
                    </MotiView>
                </View>


            )}
        />
    )


}