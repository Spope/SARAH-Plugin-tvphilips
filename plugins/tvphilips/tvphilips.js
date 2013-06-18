exports.action = function(data, callback, cfg, SARAH){

function sendCommande(command, cfg, reponse){
  
  var config = cfg.modules.tvphilips;
  if (!config.tvip){
    console.log("Plugin Philips TV: Missing config");
    reponse(false);
  }  
  
  var request = require('request');
  
  request({ 
      'uri'     : 'http://'+config.tvip+":1925/1/input/key",
      'method'  : 'post',
      'body'    : JSON.stringify({'key': command})
    }, function (err, response, body){
      if (typeof err=='null' || (typeof response == 'undefined')) {
        console.log('Plugin Philips TV: No Communication!');
        reponse(false);
      }else if  (response.statusCode != 200) {
        console.log('Plugin Philips TV: answer status :'+response.status+' answer error : '+body);
        reponse(false);
      }else if  (response.statusCode == 200) {
        setTimeout(function() { reponse(true); }, 100);    
      }
    });
}

function wait1s(reponse) {
  setTimeout(function() { reponse(true); }, 1000);
} 

function series(item) {
  if(item) {
    if(item == 'WAIT') {
      wait1s( function(reponse) {
        if(reponse == true){return series(items.shift());}
      });    
    }else{
      sendCommande(item, cfg, function(reponse) {
        if (reponse == true) {
          return series(items.shift());
        } else {
          callback({'tts': 'je n\'ai pas réussis!'});
        }
      });
    }
  }else{
    //it was the last command
    //say something to finish
    var config = cfg.modules.tvphilips;
    if (config.reponse=="true") {
      //multi réponse
      Txt = new Array; 
      Txt[0] = "oui tout de suite!";
      Txt[1] = "c'est fait!";
      Txt[2] = "à vos ordre !";
      Txt[3] = "ce sera tout?";
      Choix = Math.floor(Math.random() * Txt.length); 
      callback({'tts': Txt[Choix]});
    }else{
      callback();
    }
  }
} 

var items = data.commande.split(',');
series(items.shift());

}
