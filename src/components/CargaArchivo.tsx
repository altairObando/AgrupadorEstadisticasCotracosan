import { Upload, App } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { CargaArchivoProps } from '../interfaces/CargaArchivoProps';
import { DataGroup } from '../interfaces/DataGroup';
import { DataRow } from '../interfaces/DataRow';

const { Dragger } = Upload;

export function CargaArchivo({ onDatosActualizados }: CargaArchivoProps) {
  const [archivoCargado, setArchivoCargado] = useState(false);
  const { message } = App.useApp();
  
  const procesarCSV = (texto: string) => {
    const caracteresEspeciales: { [key: string]: string } = {
      'í': 'í',
      'á': 'á',
      'é': 'é',
      'ó': 'ó',
      'ú': 'ú',
      'ñ': 'ñ',
      'ü': 'ü',
      '¨ª': 'í',
      '¨¢': 'á',
      '¨¦': 'é',
      '¨®': 'ó',
      '¨²': 'ú',
      '¨¹': 'ü',
      '±': 'ñ',
      '¨«': 'ü'
    };

    const corregirTexto = (texto: string) => {
      let resultado = texto;
      for (const [codigo, caracter] of Object.entries(caracteresEspeciales)) {
        resultado = resultado.replace(new RegExp(codigo, 'g'), caracter);
      }
      return resultado;
    };

    const lineas = texto.split('\n');    
    const datos: DataRow[] = lineas
      .slice(1)
      .filter(linea => linea.trim() !== '')
      .map(linea => {
        const valores = linea.split(',')
          .map(v => corregirTexto(v.trim().replace(/\"/g, '')));
        
        return {
          id: Number(valores[0]),
          placa: valores[1],
          fechaHora: valores[4],
          posicion: valores[5].replace('Managua',''),
          subenAdelante: Number(valores[6]),
          bajanAdelante: Number(valores[7]),
          subenAtras: Number(valores[10]),
          bajanAtras: Number(valores[11]),
          total: Number(valores[13]),
        } as DataRow;
      });
    let agrupados = JSON.parse(JSON.stringify(datos)).map((dato: DataRow, i: number)=>{
        if(i > 0){
          debugger
          const anterior = datos[i - 1];
          dato.subenAdelante = Math.max(0,dato.subenAdelante - anterior.subenAdelante);
          dato.bajanAdelante = Math.max(0,dato.bajanAdelante - anterior.bajanAdelante);
          dato.subenAtras = Math.max(0,dato.subenAtras - anterior.subenAtras);
          dato.bajanAtras = Math.max(0,dato.bajanAtras - anterior.bajanAtras);           
        }
        return dato;
    }).reduce(( grupo: DataGroup[], item: DataRow, index: number)=>{
        const i = grupo.findIndex( x => x.placa === item.placa );
        if( i < 0) grupo.push({ placa: item.placa, datos: [item], totalPasajeros: item.total });
        else {
            const isSequence = datos[index - 1] && datos[index - 1].posicion === item.posicion;
            if (!isSequence) grupo[i].datos.push(item);
            else {
                grupo[i].datos[grupo[i].datos.length - 1].subenAdelante += item.subenAdelante
                grupo[i].datos[grupo[i].datos.length - 1].bajanAdelante += item.bajanAdelante;
                grupo[i].datos[grupo[i].datos.length - 1].subenAtras    += item.subenAtras;
                grupo[i].datos[grupo[i].datos.length - 1].bajanAtras    += item.bajanAtras;
                grupo[i].datos[grupo[i].datos.length - 1].total          = item.total;
            }
            grupo[i].totalPasajeros = item.total;
        }
        return grupo;
      },[]);
      // agrupados.forEach( g => {
      //   let subenAdelante = 0, subenAtras = 0;
      //   g.datos.forEach((d, i) => {
      //     if( i > 0){
      //       d.subenAdelante = Math.max(0,d.subenAdelante - subenAdelante);
      //       d.subenAtras = Math.max(0,d.subenAtras - subenAtras);
      //     }
      //     subenAdelante+= d.subenAdelante;
      //     subenAtras+= d.subenAtras;
      //   })
      // });
    return agrupados;
  };

  const propiedadesUpload = {
    accept: '.csv',
    multiple: false,
    customRequest: async ({ file, onSuccess }: any) => {
      try {
        // Read file as ArrayBuffer instead of text
        const buffer = await file.arrayBuffer();
        // Use TextDecoder with ISO-8859-1 or UTF-8 encoding
        const decoder = new TextDecoder('ISO-8859-1');
        const texto = decoder.decode(buffer);        
        const datos = procesarCSV(texto);
        onDatosActualizados(datos);
        setArchivoCargado(true);
        onSuccess('ok');
        message.success('Archivo procesado exitosamente');
      } catch (error) {
        message.error('Error al procesar el archivo');
      }
    },
  };

  return (
    <Dragger {...propiedadesUpload}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        {archivoCargado 
          ? 'Archivo cargado correctamente' 
          : 'Haz clic o arrastra un archivo CSV aquí'}
      </p>
      <p className="ant-upload-hint">
        Solo se permiten archivos CSV
      </p>
    </Dragger>
  );
}