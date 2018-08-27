window.onload=function () {
    var installNode = document.createElement('div');
    console.log("webExtensionWallet is defined:for tron");
    installNode.id = 'oTronWallet';
    installNode.style.display = 'none';
    installNode.innerText="open_wallet";
    document.body.appendChild(installNode);


    var installResultNode = document.createElement('input');
    installResultNode.setAttribute('type','hidden');
    installResultNode.id='transaction_wallet_result';
    document.body.appendChild(installResultNode);

    installNode.addEventListener('open_wallet', function(evt) {
        var data = evt.target.innerText;
        chrome.runtime.sendMessage({message: 'open_wallet',data:data}, function() { });
    });

    installNode.addEventListener('deploy_contract', function(evt) {
        console.log(evt.target.innerText);
        chrome.runtime.sendMessage({message: 'deploy_contract'}, function() { });
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action=='sendResult') {
            var oResultHiden= document.getElementById('transaction_wallet_result');
            oResultHiden.value = JSON.stringify(request.data);
            sendResponse('success!');
        }
    }
);
var writeScriptSync = function(code) {
    var s = document.createElement('script');
    s.textContent = code;
    var doc = document.head || document.documentElement;
    return doc.appendChild(s);
};

chrome.runtime.sendMessage({action:'getTronWeb'}, function(response) {
    writeScriptSync('window.tronExtWallet='+JSON.stringify(response.tronWeb))
});
