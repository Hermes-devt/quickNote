
window.browser = (function () { return window.msBrowser || window.browser || window.chrome; })();

let storageData = null;
const cssStyle = {
  draggable: 'display: inline-block; width: 40; color: black; background-color: white; font-size: 14;' +
  "border:1px solid black; padding: 3px; border-radius: 3px; cursor: pointer;",

  docTitel: 'display: inline-block; width: 40; color: black; background-color: white; font-size: 14;' +
  "border:1px solid black; padding: 1px 3px; border-radius: 3px; cursor: pointer;",

}

const generate = {
  container: ()=>{
    let container = document.createElement('div');
    container.setAttribute('css', '');
    container.style.position = 'fixed';
    container.style.zIndex = 999999999;
    container.style.height = '200px';
    container.ondragstart = 'return true';
    container.ondrop = 'return true';
    container.id = 'notetaking';
    container.draggable = true;
    container.style.top = data.element.pos.top + 'px';
    container.style.left = data.element.pos.left + 'px';
    container.style.display = 'none';
    return container;
  },

  textarea: ()=>{
    let area = document.createElement('textarea');
    area.setAttribute('css', '');
    area.style.cssText = 'padding: 5; font-size: 13px; resize: both; height: 300px; width: 400px';
    area.style.width = data.element.size.width;
    area.style.height = data.element.size.height;
    const {list, active} = data.documents;
    area.value = list[active].text;
  
    area.id = 'notetakingTextarea';
    area.addEventListener( 'input', (evt)=>{ 
      storageData.documents.list[ storageData.documents.active].text = evt.currentTarget.value;
      browser.storage.local.set({ extensionNotes: JSON.stringify(storageData) });
    });
    return area;
  },

  topbar: {
    init(){
      let topbar = document.createElement('div');
      let draggable = this.draggable();

      let documentList = this.documentList.init();
      let createDocumentButton = this.createDocumentButton();
      let deleteDocumentButton = this.createDocumentButton2();
      topbar.appendChild(draggable);
      topbar.appendChild(documentList);
      topbar.appendChild( createDocumentButton);
      topbar.appendChild( deleteDocumentButton );
      return topbar;
    },

    draggable: ()=>{
      let draggable = document.createElement('div');
      draggable.style.cssText = cssStyle.draggable + "; draggable: true";
      draggable.innerText = 'Notes';
      draggable.id='notetakingheader';
      return draggable;
    },

    documentList: {
      init(){
        let documentList = document.createElement('span');
        documentList.id = 'notesDocumentList';

        data.documents.list.forEach( (item, index)=>{
          let doc = this.documentItem(item, index, this);
          documentList.appendChild( doc );
        })
        return documentList;
      },

      documentItem: (item, index, that=this)=>{
        let doc = document.createElement('div');
        doc.className = 'noteDocumentTitel';
        doc.style.cssText = cssStyle.docTitel
        doc.innerText = 'Note' + (index + 1);
        doc.addEventListener( 'click', ()=>{ 
          that.setActive(index); 
        });
        return doc;

      },

      setActive: (activeDocument)=>{
        let docTitel = document.getElementsByClassName('noteDocumentTitel');
        for( let III=0; III < docTitel.length; III++){
          docTitel[III].setAttribute('css', '');
          docTitel[III].style.cssText = cssStyle.docTitel + 'background-color: white; color: black';
        }

        docTitel[activeDocument].style.cssText = cssStyle.docTitel + 'background-color: black; color: white';
        storageData.documents.active = activeDocument;
        const {list, active} = storageData.documents;
        document.getElementById('notetakingTextarea').value = list[active].text;
      },
    },

    createDocumentButton: ()=>{
      let createDoc = document.createElement('div');
      createDoc.style.cssText = cssStyle.docTitel + 'width: 20px; text-align: center; draggable: true';
      createDoc.innerText = '+';

      createDoc.addEventListener( 'click', ()=>{
        //set storage
        storageData.documents.list.push( { name: 'Note' + storageData.documents.list.length, text: '', });
        storageData.documents.active = storageData.documents.list.length - 1;
        //Save the new list.
        browser.storage.local.set({ extensionNotes: JSON.stringify(storageData)});

        let documentList = document.getElementById('notesDocumentList')
          let doc = document.createElement('div');
          doc.className = 'noteDocumentTitel';
          doc.style.cssText = cssStyle.docTitel
          const indexValue = storageData.documents.list.length -1;
          doc.innerText = 'Note' + (parseInt(indexValue) + 1);
          doc.addEventListener( 'click', ()=>{ generate.topbar.documentList.setActive ( indexValue ); });
        documentList.appendChild( doc );
        setTimeout( ()=>{ generate.topbar.documentList.setActive( storageData.documents.list.length - 1 ); }, 100);

        // setTimeout( ()=>{ browser.storage.local.set({ extensionNotes: JSON.stringify(storageData) }); }, 100);
      });


      return createDoc;
    },

    createDocumentButton2: ()=>{
      let createDoc = document.createElement('div');
      createDoc.style.cssText = cssStyle.docTitel + 'width: 20px; text-align: center; draggable: true';
      createDoc.innerText = '-';
      createDoc.addEventListener( 'click', ()=>{

        if( storageData.documents.list.length === 1){
          storageData.documents.list[0].text = '';
          let textarea = document.getElementById('notetakingTextarea')
          textarea.value = '';
          textarea.focus();
          return;
        }

        let {active} = storageData.documents;
        //remove the document
        storageData.documents.list.splice(active, 1);

        //Clear out the documentlist
        let documentList = document.getElementById('notesDocumentList')
        documentList.innerHTML = "";

        //Set active document
        if( active > storageData.documents.list.length - 1) active--;
        if( active < 0) active = 0;
        storageData.documents.active = active;

        //Set the textarea
        let textarea = document.getElementById('notetakingTextarea')
        textarea.value = storageData.documents.list[ active ].text;
        textarea.focus();

        //generate new list. 
        storageData.documents.list.forEach( (item, index)=>{
          let doc = document.createElement('div');
          doc.className = 'noteDocumentTitel';
          doc.style.cssText = cssStyle.docTitel

          //set the style of the active element
          if( active === index ){ doc.style.backgroundColor = 'black'; doc.style.color = 'white'; }

          // Set the titel and action
          doc.innerText = 'Note' + (index + 1);
          doc.addEventListener( 'click', ()=>{ generate.topbar.documentList.setActive(index); });
          documentList.appendChild( doc );
        })

        //save the list.
        browser.storage.local.set({ extensionNotes: JSON.stringify(storageData)});
      });

      //Save the new list.
      // setTimeout( ()=>{ browser.storage.local.set({ extensionNotes: JSON.stringify(storageData) }); }, 100);
      return createDoc;
    },
  },
}

function setNotes(data){
  let container = generate.container();
  let topbar = generate.topbar.init();
  let area = generate.textarea();

  container.appendChild(topbar);
  container.appendChild(area);
  document.body.appendChild( container );
  setTimeout( ()=>{ generate.topbar.documentList.setActive( storageData.documents.active ); }, 50);
  dragElement( document.getElementById('notetaking'));
}



let pastActiveElement = document.body;
document.addEventListener( 'keyup', function setKeyupFunctionality(e){
  if( !(e.key === '#' || e.key === 'Escape')) return;

  let element = document.getElementById('notetaking');
  if( e.key === '#'){

    if( element.style.display === 'none'){
      pastActiveElement = document.activeElement;
      element.style.display = 'block';
      document.getElementById('notetakingTextarea').focus();
      return; }

    element.style.display = 'block';
    pastActiveElement.focus();
    return;
  }

  if( e.key === 'Escape'){
    element.style.display = 'none';
    pastActiveElement.focus();
  }
});


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2);
    elmnt.style.left = (elmnt.offsetLeft - pos1);
  }


  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    // it can still be outside bounds when it come to the bottom and right part. 
    // need to insert a function for this part to!.
    let container = document.getElementById('notetaking')
    let rect = container.getBoundingClientRect();
    storageData.element.pos = { 
      top: rect.top < 0 ? 0 : rect.top, 
      left: rect.left < 0 ? 0 : rect.left,
    };
    browser.storage.local.set({extensionNotes: JSON.stringify(storageData)});
  }
}


(function getStorageData(){
  browser.storage.local.get('extensionNotes', function(res){ 
    data = JSON.parse(res.extensionNotes)
    storageData = {...data};
    setNotes(data)
  });
})();

function storageChange(){ 
  browser.storage.local.get('extensionNotes', function(res){ 
      data = JSON.parse( res.extensionNotes) 
      const {active, list} = data.documents;
      console.log('active', active);
      document.getElementById('notetakingTextarea').value = list[active].text;
    }
  );
}
browser.storage.onChanged.addListener( storageChange );

let observer = new MutationObserver(function(mutations) {
  let target = document.getElementById('notetakingTextarea');
  storageData.element.size = {
    width : target.clientWidth,
    height: target.clientHeight, };
  browser.storage.local.set({extensionNotes: JSON.stringify(storageData)});
});

setTimeout( ()=>{
  let target = document.getElementById('notetakingTextarea');
  observer.observe(target, {
    attributes: true
  });
}, 1500);

browser.runtime.connect().onDisconnect.addListener((setKeyupFunctionality)=> {
  document.removeEventListener("keyup", setKeyupFunctionality);
})