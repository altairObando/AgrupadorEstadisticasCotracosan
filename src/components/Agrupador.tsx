import React, { useContext } from 'react';
import { DataRow } from '../interfaces/DataRow';
import { SaveOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, InputNumber, Row, Space, Table } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { MyAppContext } from '../data/AppContext';
import { DataGroup } from '../interfaces/DataGroup';
export interface AgrupadorProps {
  onClose: () => void;
  onNext: () => void;
}

export const Agrupador: React.FC<AgrupadorProps> = ({ onClose, onNext }) => {
    const { busSeleccionado, setData } = useContext( MyAppContext );
    const [ form ] = Form.useForm();
    const [ selectedRowKeys, setSelectedRowKeys] = React.useState<number[]>([]);
    const onSelectChange = (newSelectedRowKeys: any) => {
        setSelectedRowKeys(newSelectedRowKeys);
        let { nombre } = form.getFieldsValue(['nombre']);
        if(newSelectedRowKeys.length > 0 && !nombre){
            const [ first ] = (busSeleccionado?.datos ?? []).filter( dato => dato.id == newSelectedRowKeys[0] );
            form.setFieldsValue({ nombre: first.posicion });
        }
    };
    const rowSelection: TableRowSelection<DataRow> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const onCrearGrupo = () => {
        form.validateFields().then( values => {
            const newItems = (busSeleccionado?.datos??[]).filter( item => selectedRowKeys.some( x => x == item.id ) );
            const totalSuben = newItems.reduce((acc, item)=> acc + item.subenAdelante + item.subenAtras ,0);
            const totalBajan = newItems.reduce((acc, item)=> acc + item.bajanAdelante + item.bajanAtras,0);
            const { nombre, precio } = values;
            debugger
            setData( (prev : DataGroup[]) => {
                let bus = prev.find(bus => bus.placa == busSeleccionado?.placa);
                if(!bus) return prev;
                if(bus.tramos && bus.tramos.some(x => x.nombre == nombre)){
                    return prev;
                }
                bus.tramos = [ ...(bus?.tramos ?? []), { nombre: nombre, ubicaciones: newItems, totalSuben, totalBajan, precio }];
                let oldBus = prev.filter( data => data.placa != busSeleccionado?.placa);
                return [...oldBus, bus];                
            })
            setSelectedRowKeys([]);
            form.resetFields();
        })
    }
    return (
        <Row gutter={16}>
            <Col span={24}>
                <Form form={form} layout='inline'>
                    <Form.Item>
                        <Button type='link' onClick={ onClose }>
                            Regresar <LeftOutlined/>
                        </Button>
                    </Form.Item>
                    <Form.Item label='Nombre' name='nombre' rules={[ { required: true, message:'El nombre del tramo es obligatorio' }]}>
                        <Input style={{width: 500 }}/>
                    </Form.Item>
                    <Form.Item label='Precio' name='precio' rules={[ { required: true, message:'El precio del tramo es obligatorio' }]}>
                        <InputNumber style={{width: 250 }}/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type='link' disabled={ selectedRowKeys.length == 0 } onClick={onCrearGrupo}>
                                Crear Grupo <SaveOutlined />
                            </Button>
                            <Button type='link' onClick={onNext}>
                                Continuar <RightOutlined/>
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Col>
            <Divider />
            <Col span={24}>
                <Table dataSource={ (busSeleccionado?.datos ?? []).filter(item => !busSeleccionado?.tramos?.some(x => x.ubicaciones.some( y => y.id == item.id))) } rowSelection={rowSelection} rowKey={ record => record.id }>
                    <Table.Column title='Id' dataIndex='id' key='id' />
                    <Table.Column title='Ubicacion' dataIndex='posicion' key='posicion' />
                    <Table.Column title='Suben Adelante' dataIndex='subenAdelante' key='subenAdelante' />
                    <Table.Column title='Bajan Adelante' dataIndex='bajanAdelante' key='bajanAdelante' />
                    <Table.Column title='Suben Atras' dataIndex='subenAtras' key='subenAtras' />
                    <Table.Column title='Bajan Atras' dataIndex='bajanAtras' key='bajanAtras' />
                    <Table.Column title='Total' dataIndex='total' key='total' />
                </Table>
            </Col>
        </Row>
    )
}