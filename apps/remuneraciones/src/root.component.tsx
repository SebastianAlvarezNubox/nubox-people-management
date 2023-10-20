import { useEffect, useReducer, useState } from "react";
import {Button} from 'ui';

import "./global.css?modules=false";

interface Departamento {
  codigo: string;
  descripcion: string;
}


function getCookies() {
  var cookies = {};
  var theCookies = document.cookie.split(';');
  var aString = '';
  for (var i = 1 ; i <= theCookies.length; i++) {
      let singleCookie =  theCookies[i-1].split('=');
    cookies[singleCookie[0].trim()] = singleCookie[1];
  }
  return cookies;
}


export default function Root(props) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  useEffect(() => {

    const cookies = getCookies();

    //COOKIE%5FNORMAL%5FSERVIPYME
    //WS-02951AF7

    let sessionId = cookies['COOKIE%5FNORMAL%5FSERVIPYME'].replace('WS-','')
		sessionId = parseInt(sessionId, 16)

    fetch("http://localhost:8081/remugrlbff/api/departamentos/?sujetoContableId=186831", {
      method: "GET", // or 'PUT'
      headers: {
        "x-session-web-id": sessionId,
      },
    }).then(async (response) => {
      const text = await response.text()
      console.log(text)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text,"text/xml");
      const departamentosXML = xmlDoc.getElementsByTagName('departamento');
      
      const departamentos:Departamento[] = [];
      for(let x = 0; x < departamentosXML.length; x++){
        departamentos.push({
          codigo: departamentosXML[x].getElementsByTagName('codigo')[0].childNodes[0].nodeValue,
          descripcion: departamentosXML[x].getElementsByTagName('descripcion')[0].childNodes[0].nodeValue
        })
      }
      setDepartamentos(departamentos)
    })
  }, [setDepartamentos])
  
  return <>
    <section>{props.name} is mounted!</section>
    <table>
      <thead>
        <tr>
          <th>codigo</th>
          <th>descripcion</th>
        </tr>
      </thead>
      <tbody>
          {
           departamentos.length > 0 && departamentos.map((departamento) => {
              return <tr key={departamento.codigo}>
                <td>{departamento.codigo}</td>
                <td>{departamento.descripcion}</td>
              </tr>
            })
          }
      </tbody>
    </table>
    <button className="bg-sky-500 hover:bg-sky-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white">
    Save changes
  </button>
  <Button>test</Button>
  </>;
}
