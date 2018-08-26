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
    console.log(evt.target.innerText);
    var data = evt.target.innerText;
    chrome.runtime.sendMessage({message: 'open_wallet',data:data}, function() { });
});

installNode.addEventListener('deploy_contract', function(evt) {
    console.log(evt.target.innerText);
    chrome.runtime.sendMessage({message: 'deploy_contract'}, function() { });
});

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action=='sendResult') {
            console.log('request.data::',request.data);
            var oResultHiden= document.getElementById('transaction_wallet_result');
            oResultHiden.value = JSON.stringify(request.data);
            sendResponse('success!');
        }
    }
);

