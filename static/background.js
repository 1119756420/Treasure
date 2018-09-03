//
var isCreated=false;
var _window=null;
var lastMsg = '';
var tabId='';
var tronWeb = {}
window.backgroundData = {}
chrome.windows.onRemoved.addListener(function(winID){
    /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box",w:win,ww:_window}, function(response) {});
    });*/
    //console.log('remove',tabId) ;
    backgroundData = {}
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "sendResult",data:lastMsg}, function(response) {
            console.log('response',response);
        });
    });
    if(_window.id==winID){
        _window=null;
        isCreated=false;
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(!isCreated && (request.message == 'open_wallet')){
        //var _type=request.message;
        var data = request.data;
        /*setTimeout(function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "pass_message", type:_type}, function(response) {});
            });

        },1000);*/
        var url = 'popup.html/#send';
        var oData ={}
        if(data){
            oData = JSON.parse(data);
            //url+='?to='+oData.to+'&amount='+oData.amount+'&data='+JSON.stringify(oData.data);
        }
        chrome.windows.create({
            url: chrome.runtime.getURL(url),
            width:384,
            height:600,
            left:100,
            top:100,
            type: "popup",
            setSelfAsOpener:true
        },function(win){
            //alert(win)
            backgroundData = oData;



            _window=win;
        });
        isCreated=true;

    }
})

/*chrome.runtime.sendMessage({action:'sendTransaction'},function (response) {
    console.log(response);
})*/

window.sendMsg=function(msg){

    lastMsg = msg;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        tabId = tabs[0].id;
        chrome.windows.remove(_window.id);
    });

}

sendTronWeb = function (obj) {
    tronWeb = obj;
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getTronWeb")
            sendResponse({tronWeb: tronWeb});
    }
);



