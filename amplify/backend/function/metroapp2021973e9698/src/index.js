const { event } = require("react-native-reanimated");

exports.handler = async (event) => {
    console.log(event)
    const registroId = event.pathParameters.registroId;
    const metroApp = {'registroId': registroId, 'nombre': "nombre " + registroId};
    const response = {
        statusCode: 200,
        //Uncomment below to enable CORS request
        Headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(metroApp),
    };
    return response;
};