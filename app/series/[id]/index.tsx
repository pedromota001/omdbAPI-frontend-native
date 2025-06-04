import CardExpandido from "@/components/CardExpandido";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from "react-native";

const url = 'https://parseapi.back4app.com/classes/Series/';

const headers = {
    'X-Parse-Application-Id': 'GwnUACA5KJuULzj5Pf30JZhwXU0lkeu43Z1wnDoN',
    'X-Parse-REST-API-Key': '8wYzUlStyJkZFCgAh1aHHy035JPU1e8wNhgRtBqp',
    'Content-Type': 'application/json',
};

async function fetchSerie(id: string) {
    try {
        const res = await axios.get(url + id, { headers });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export default function SerieScreen() {
    const { id } = useLocalSearchParams();

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['serie', id],
        queryFn: async ({ queryKey }) => {
            const [, serieId] = queryKey;
            return await fetchSerie(serieId as string);
        },
    });

    const onClickLike = (id: string) => {
        console.log('temp' + id);
    };

    if (isLoading || !data) {
        return <Text>Carregando série...</Text>;
    }

    return (
        <View>
            <CardExpandido object={data} onClick={() => onClickLike(id as string)} />
        </View>
    );
}