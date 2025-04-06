import React, { useContext } from 'react';
import { DataGroup } from '../interfaces/DataGroup';
import { ToolOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
const { Column } = Table;
import { DataRow } from '../interfaces/DataRow';
import { MyAppContext } from '../data/AppContext';
interface ListaBusesProps {
  onAgrupar: (bus: DataGroup) => void;
}

export const ListaBuses: React.FC<ListaBusesProps>=({ onAgrupar })=>{
    const { data } = useContext(MyAppContext);
    return <Table
        dataSource={data || []}
        rowKey={(record) => record.placa }>
        <Column title='Placa' dataIndex='placa' key='placa' />
        <Column title='Salida' dataIndex='datos' key='salida' render={(datos: DataRow[]) => { const [first] = datos.sort((a,b)=> a.id - b.id ); return first.fechaHora  }} />
        <Column title='Ultima Llegada' dataIndex='datos' key='llegada' render={(datos: DataRow[]) => { return datos[ datos.length -1 ].fechaHora }} />
        <Column title='Pasajeros' dataIndex='datos' key='pasajeros' render={(datos: DataRow[]) =>  Math.max( ...datos.map(item => item.total)) } />
        <Column title='Ubicaciones' dataIndex='datos' key='ubicaciones' render={(datos: DataRow[]) => datos.length } />
        <Column 
          title='Acciones' 
          key='acciones' 
          render={(_, record: DataGroup) => (
            <Button type='link' onClick={() => onAgrupar(record)}> 
              Agrupar <ToolOutlined /> 
            </Button>
          )} 
        />
    </Table>
}