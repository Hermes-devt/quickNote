
window.browser = (function () { return window.msBrowser || window.browser || window.chrome; })();
let storageData = null;
// browser.storage.local.set({ extensionNotes: JSON.stringify(data) });
browser.storage.local.get('extensionNotes', function(res){ 
  data = JSON.parse(res.extensionNotes)
  storageData = {...data};
  console.log('storage', storageData );
  setNotes(data)
});

function storageChange(){ 
  browser.storage.local.get('extensionNotes', 
    function(res){ 
      data = JSON.parse( res.extensionNotes) 
      document.getElementById('notetakingTextarea').value = data.textarea[0];
    }
  );
}
browser.storage.onChanged.addListener( storageChange );


function setNotes(data){
  let container = document.createElement('div');
  container.style.cssText = 'z-index: 9999999';
  container.style.position = 'fixed';

  container.style.top = data.element.pos.top;
  container.style.left = data.element.pos.left;
  container.style.backgroundColor = '';

  container.id = 'notetaking';
  container.style.display = 'none';


  let draggable = document.createElement('div');
  draggable.style.cssText = 'width: 40; color: black; background-color: white; font-size: 14;' +
  "border:1px solid black; padding: 3px; border-radius: 3px; cursor: pointer";
  draggable.innerText = 'Notes';
  draggable.id='notetakingheader';
  

  let area = document.createElement('textarea');
  area.style.cssText = 'padding: 5; font-size: 13px';

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
}


let pastActiveElement = document.body;
document.addEventListener( 'keyup', (e)=>{

  if( e.key === '#'){
    let element = document.getElementById('notetaking');
    const display = element.style.display;
    // setTimeout( ()=>{ area.focus(); },50);
    if( display === 'none'){
      pastActiveElement = document.activeElement;
      element.style.display = 'block';
      document.getElementById('notetakingTextarea').focus();
      return;
    }
    if( display === 'block'){
      element.style.display = 'none';
      pastActiveElement.focus();
    }
  }

  if( e.key === 'Escape' && document.getElementById('notetaking').style.display === 'block'){
    document.getElementById('notetaking').style.display = 'none'
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
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
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
}, 100);


