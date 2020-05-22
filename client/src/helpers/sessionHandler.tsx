import { Plugins } from '@capacitor/core';
const {Storage} = Plugins;
function callOutFetch(url : string, options : any){
    var body : any = {};
    if(options.body !== undefined){
        body = JSON.parse(options.body);
    }

    Storage.get({key: 'token'}).then(function(result){
        body['userSession'] = result.value;
        options.body = JSON.stringify(body);

    }).catch(function(err){
        console.log('error: ' + err);
        return null;
    })
    return fetch(url, options);
}

function saveSession(token : string, userName : string, sfid : string){
    Storage.set({key: 'token', value: token });
    Storage.set({key: 'name', value: userName });
}

export default {callOutFetch, saveSession}