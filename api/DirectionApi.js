const URL = process.env.EXPO_PUBLIC_DIRECTION_API;
const accessToken = process.env.EXPO_PUBLIC_MAPBOX_API_KEY;

export const getRoute = async (origin, dest) => {
    const res = await fetch(
        `${URL}/driving/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?alternatives=true&annotations=distance,duration,speed&geometries=geojson&language=en&overview=full&steps=true&access_token=${accessToken}`
    );
    return await res.json();
};
