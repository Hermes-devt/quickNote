window.browser = (function () { return window.msBrowser || window.browser || window.chrome; })();
// browser.runtime.sendMessage({ content: 'reset' });
let siteArray = [];
const container = document.getElementById('generatedInputs');

// const newInput = (str)=>{
//   let inputElement = document.createElement('input');
//   inputElement.className = 'sitesIncluded';
//   inputElement.type = 'text'; 
//   inputElement.value = str;
//   inputElement.placeholder = 'www.address.com';
//   container.appendChild( inputElement );
// }

// const generateInputs = (data)=>{
//   for( let index = 0; index < data.length; index++)
//     newInput(data[index]);
//   newInput(''); //add one additional empty input field for new pages
// }

// browser.storage.local.get('data', function(storage){ 
//   const data = JSON.parse( storage.data );
//   generateInputs( data.list );
//   document.getElementById('focusText').value = data.text;
//   document.getElementById('timeDelay').value = data.timeDelay;
// });

// function save(){
//   const inputs = document.getElementsByClassName('sitesIncluded');
//   let arr = [];
//   for( let index=0; index<inputs.length; index++){
//     if( inputs[index].value.length > 0)
//       arr.push( inputs[index].value );
//   }

//   const timeDelay = document.getElementById('timeDelay').value;
//   const focusText = document.getElementById('focusText').value;

//   let data = { 
//     list: arr,
//     text: focusText,
//     timeDelay: timeDelay,
//   }

//   browser.storage.local.set({data: JSON.stringify(data) });
//   window.close();

// }

// document.getElementById('save').addEventListener('click', ()=>{ save(); });
// document.getElementById('generateNewInputs').addEventListener('click', ()=>{ newInput(''); });
// document.getElementById('addPage').addEventListener('click', (e)=>{
//   browser.tabs.query({currentWindow: true, active: true}, ( tabs )=>{
//     newInput( tabs[0].url );
//     save();
//   });
// });

// browser.runtime.onInstalled.addListener( ()=>{
//   let obj = { list: [], text: "FOCUS", timeDelay: 5 }
//   let storageObj = JSON.stringify( obj );
//   browser.storage.local.set({data: storageObj});
// });

