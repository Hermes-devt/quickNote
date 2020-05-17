
window.browser = (function () { return window.msBrowser || window.browser || window.chrome; })();



const data = {
  textarea: [''],
  element: {
    pos:{ top: 0, left: 0, },
    size:{ width: 500, height: 300, }
  }
}

function onInstall( details ){
  browser.storage.local.set({ extensionNotes: JSON.stringify(data) }); 
  try{
    browser.storage.sync.get('extensionNotes', function(data){
      if(!data && !data['extensionNotes'])
        browser.storage.local.set({ extensionNotes: JSON.stringify(data) }); 
    });
  }catch(ex){}
}

browser.runtime.onInstalled.addListener( onInstall );