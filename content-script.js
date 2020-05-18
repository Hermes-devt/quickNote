
window.browser = (function () { return window.msBrowser || window.browser || window.chrome; })();

let storageData = null;
// browser.storage.local.set({ extensionNotes: JSON.stringify(data) });


const app = {
  init: ()=>{
    browser.storage.local.get('extensionNotes', function(res){ 
      data = JSON.parse(res.extensionNotes)
      storageData = {...data};
      console.log('storage', storageData );
      setNotes(data)
    });

    // browser.runtime.connect().onDisconnect.addListener(function() {
    //   element.removeEventListener("keyup", temp);
    // })

  },

  setEvents: ()=>{
    let pastActiveElement = document.body;
    document.addEventListener( 'keyup', function temp(e){
      if( e.key === '#'){
        let element = document.getElementById('notetaking');

        if( element.style.display === 'none'){
          pastActiveElement = document.activeElement;
          element.style.top = data.element.pos.top;
          element.style.display = 'block';
          document.getElementById('notetakingTextarea').focus();
          return;
        }else{
          element.style.display = 'block';
          pastActiveElement.focus();
        }

      }

      if( e.key === 'Escape'){
        let element = document.getElementById('notetaking');
        element.style.display = 'none';
        pastActiveElement.focus();
      }
    });
  },

  setNotes: (data)=>{
    // var elem = document.querySelector('#notetaking');
    // elem.parentNode.removeChild(elem);

    let container = document.createElement('div');

    container.setAttribute( 'style', '');
    container.style.position = 'fixed';
    container.style.zIndex = 999999999;
    container.id = 'notetaking';
    container.style.top = data.element.pos.top;
    container.style.left = data.element.pos.left;
    container.style.display = 'none';


    let draggable = document.createElement('div');
    draggable.style.cssText = 'width: 40; color: black; background-color: white; font-size: 14;' +
    "border:1px solid black; padding: 3px; border-radius: 3px; cursor: pointer";
    draggable.innerText = 'Notes';
    draggable.id='notetakingheader';
    

    let area = document.createElement('textarea');
    area.style.cssText = 'padding: 5; font-size: 13px; resize: both;';
    area.style.width = data.element.size.width;
    area.style.height = data.element.size.height;
    area.value = data.textarea[0]

    area.id = 'notetakingTextarea';
    area.addEventListener( 'input', (evt)=>{ 
      storageData.textarea[0] = evt.currentTarget.value;
      browser.storage.local.set({ extensionNotes: JSON.stringify(storageData) });
    });

    container.appendChild(draggable);
    container.appendChild(area);
    document.body.appendChild( container );
    dragElement( document.getElementById('notetaking'));
  },

  storageChange: ()=>{
    browser.storage.local.get('extensionNotes', function(res){ 
        data = JSON.parse( res.extensionNotes) 
        document.getElementById('notetakingTextarea').value = data.textarea[0];

        let elem = document.getElementById('notetakingTextarea');
        elem.value = data.textarea[0];
      }
    );
  },

  makeElementDraggable: (elmnt)=>{
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
  
      console.log('here');
      browser.storage.local.set({extensionNotes: JSON.stringify(storageData)});
    }
  }
}



const cssStyle = {
  draggable: 'display: inline-block; width: 40; color: black; background-color: white; font-size: 14;' +
  "border:1px solid black; padding: 3px; border-radius: 3px; cursor: pointer;",

  docTitel: 'display: inline-block; width: 40; color: black; background-color: white; font-size: 14;' +
  "border:1px solid black; padding: 1px 3px; border-radius: 3px; cursor: pointer;",
}

function setNotes(data){
  // Create the popup container
  let container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.zIndex = 999999999;
  container.id = 'notetaking';
  container.style.top = data.element.pos.top;
  container.style.left = data.element.pos.left;
  container.style.display = 'none';


  // Create the topbar - with documents
  let topbar = document.createElement('div');

  //create an element you can drag the window around with.
  let draggable = document.createElement('div');
  draggable.style.cssText = cssStyle.draggable;
  draggable.innerText = 'Notes';
  draggable.id='notetakingheader';
  topbar.appendChild( draggable );

  //list all the active documents
  data.documents.list.forEach( (item, index)=>{
    let doc = document.createElement('div');
    doc.className = 'noteDocumentTitel';
    doc.style.cssText = cssStyle.docTitel
    doc.innerText = item.name;

    doc.addEventListener( 'click', (evt)=>{
      let docTitel = document.getElementsByClassName('noteDocumentTitel');
      for( let III=0; III < docTitel.length; III++)
         docTitel[III].style.cssText = cssStyle.docTitel + 'background-color: white; color: black';
      docTitel[index].style.cssText = cssStyle.docTitel + 'background-color: black; color: white';
      storageData.documents.active = index;

      // area.id = 'notetakingTextarea';
      const {list, active} = storageData.documents;
      document.getElementById('notetakingTextarea').value = list[active].text;
    });



    if( index === data.documents.active){
      doc.style.backgroundColor = 'black';
      doc.style.color = 'silver';
    }

    topbar.appendChild( doc );
  })

  // Create an icon you create further documents with.
  let createDoc = document.createElement('div');
  createDoc.style.cssText = cssStyle.docTitel + 'width: 20px; text-align: center;';
  createDoc.innerText = '+';
  createDoc.addEventListener( 'click', ()=>{
    console.log('clicked on create new document!');
  });
  topbar.appendChild( createDoc );


  //Create the textarea
  let area = document.createElement('textarea');
  area.style.cssText = 'padding: 5; font-size: 13px; resize: both;';
  area.style.width = data.element.size.width;
  area.style.height = data.element.size.height;
  const {list, active} = data.documents;
  area.value = list[active].text;

  area.id = 'notetakingTextarea';
  area.addEventListener( 'input', (evt)=>{ 
    storageData.documents.list[ storageData.documents.active].text = evt.currentTarget.value;
    browser.storage.local.set({ extensionNotes: JSON.stringify(storageData) });
  });

  container.appendChild(topbar);
  container.appendChild(area);
  document.body.appendChild( container );
  dragElement( document.getElementById('notetaking'));
}



let pastActiveElement = document.body;
document.addEventListener( 'keyup', function temp(e){
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


browser.storage.local.get('extensionNotes', function(res){ 
  data = JSON.parse(res.extensionNotes)
  storageData = {...data};
  console.log('storage', storageData );
  setNotes(data)
});

function storageChange(){ 
  browser.storage.local.get('extensionNotes', function(res){ 
      data = JSON.parse( res.extensionNotes) 
      const {active, list} = data.documents;
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

// browser.runtime.connect().onDisconnect.addListener(function() {
//   document.removeEventListener("keyup", temp);
// })