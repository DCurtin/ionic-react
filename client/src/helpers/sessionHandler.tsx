import { Plugins } from '@capacitor/core';
const {Storage} = Plugins;
function callOutFetch(url : string, options : any){
    var body : any = {};
    if(options.body !== undefined){
        body = JSON.parse(options.body);
    }

    return Storage.get({key: 'token'}).then(function(result){
        console.log('getting key')
        console.log(result)
        body['userSession'] = result.value;
        options.body = JSON.stringify(body);
        return fetch(url, options);

    }).catch(function(err){
        console.log('error: ' + err);
        return null;
    })
}

function saveSession(token : string, userName : string, sfid : string){
    console.log('saving token: ' + token);
    Storage.set({key: 'token', value: token });
    Storage.set({key: 'name', value: userName });
}

export default {callOutFetch, saveSession}