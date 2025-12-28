const API="WEB_APP_URL_KAMU";
const role=localStorage.role;
document.getElementById("role").innerText=role;
if(role!=="ADMIN") document.getElementById("export").style.display="none";

let data=null;

file.onchange=e=>{
  const r=new FileReader();
  r.onload=x=>{
    const wb=XLSX.read(x.target.result,{type:"array"});
    data=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1});
    render();
  };
  r.readAsArrayBuffer(e.target.files[0]);
};

function render(){
  let h="<table>";
  data.forEach((r,i)=>{
    h+="<tr>";
    r.forEach(c=>{
      h+=i?`<td contenteditable>${c??""}</td>`:`<th>${c}</th>`;
    });
    h+="</tr>";
  });
  table.innerHTML=h+"</table>";
}

function cancel(){data=null;table.innerHTML="";}

async function confirm(){
  await fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"uploadData",token:localStorage.token,data})
  });
  loadHistory();
}

async function loadHistory(){
  const h=await fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"getHistory",token:localStorage.token})
  }).then(r=>r.json());

  history.innerHTML=JSON.stringify(h);
}

async function exportLog(){
  const csv=await fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"exportAudit",token:localStorage.token})
  }).then(r=>r.text());

  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv]));
  a.download="audit_log.csv";
  a.click();
}

loadHistory();
