import { useEffect, useState, useMemo } from 'preact/hooks';
import { Form, Modal, Input, Select, Button, message, Typography, Tag, Table, Popconfirm, Switch } from 'antd';
import { EditFilled, DeleteFilled, PlusSquareFilled } from '@ant-design/icons';
import { getColorAll } from '../../utils/color.js';
import { getSizeAll } from '../../utils/size.js';
import { getHanghoaPage, createHanghoa, updateHanghoa, deleteHanghoa } from '../../utils/hanghoa.js';

const { TextArea } = Input;
const { Text, Title } = Typography;

const tagColor = ['#F06292', '#BA68C8', '#9575CD', '#303F9F', '#283593', '#304FFE', '#1E88E5', '#2962FF', '#00E5FF', '#00B8D4', '#006064', '#00BFA5', '#33691E', '#64DD17', '#F57F17', '#FF9100', '#FF3D00', '#8D6E63'];

const randomColor = () => {
    return tagColor[Math.floor(Math.random() * tagColor.length)];
}

const Hanghoa = () => {

    // Table
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, hideOnSinglePage: true, pageSizeOptions: [10, 20, 50, 100] });
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: <Title ellipsis={true} level={5}>#</Title>,
            dataIndex: 'index',
            render: (text, record, index) => <Text>{index + 1}</Text>,
            width: '2%',
            align: 'center'
        },
        {
            title: <Title ellipsis={true} level={5}>Tên hàng</Title>,
            dataIndex: 'name',
            render: (text, record, index) => <Text>{record.name}</Text>,
            width: '80%'
        },
        {
            title: <Title ellipsis={true} level={5}>Hành động</Title>,
            dataIndex: 'action',
            align: 'center',
            width: 'auto',
            render: (text, record, index) => (
                <Text ellipsis={true}>
                    <Button type='primary' onClick={e => showModalFunc(record)} style={{ marginRight: '0.25rem' }}><EditFilled /></Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => deleteRecord(record._id)}
                        okText="Ok"
                        cancelText="Cancel"
                    >
                        <Button type='danger'><DeleteFilled /></Button>
                    </Popconfirm>
                </Text>
            )
        }
    ];

    const fetchData = async (pageNumber, pageSize) => {
        setLoading(true);
        let res = await getHanghoaPage(pageNumber, pageSize);
        setData(res.list);
        setPagination(pagination => ({ ...pagination, total: res.totalItem, current: res.pageNumber, pageSize: res.pageSize }));
        setLoading(false);
    }

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, []);

    const tableChange = (pages) => {
        fetchData(pages.current, pages.pageSize);
    }

    const deleteRecord = async _id => {
        await deleteHanghoa(_id);
        message.success('Xoá thành công');
        fetchData(pagination.current, pagination.pageSize);
    }

    // Modal
    const [colorList, setColorList] = useState([]);
    const [sizeList, setSizeList] = useState([]);

    useEffect(() => {
        getColorAll({ active: true }).then(res => setColorList(res));
        getSizeAll({ active: true }).then(res => setSizeList(res));
    }, [])

    const [showModal, setShowModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentModalData, setCurrentModalData] = useState(null);
    const [variantsData, setVariantsData] = useState(null);
    const [variantsColumn, setVariantsColumn] = useState([]);

    const [form] = Form.useForm();

    const tagRender = ({ label, value, closable, onClose }) => {
        const color = useMemo(() => randomColor(), []);
        return (
            <Tag color={color} closable={closable} onClose={onClose} style={{ marginRight: '0.25rem' }}>
                {label}
            </Tag>
        );
    }

    const showModalFunc = data => {
        setCurrentModalData(data);
        form.setFieldsValue({
            name: data?.name,
            description: data?.description,
            color: data?.color,
            size: data?.size,
            sexes: data?.sexes
        })
        setShowModal(true);
    }
    const handleOK = async e => {
        setConfirmLoading(true);

        form
            .validateFields()
            .then(async values => {
                form.resetFields();
                if (!currentModalData) {
                    await createHanghoa(values);
                    message.success('Tạo mới thành công');
                    fetchData(pagination.current, pagination.pageSize);
                } else {
                    await updateHanghoa(currentModalData._id, values);
                    message.success('Cập nhật thành công');
                    fetchData(pagination.current, pagination.pageSize);
                }
                setCurrentModalData(null);
                setConfirmLoading(false);
                setShowModal(false);
            })
            .catch(error => {
                setConfirmLoading(false);
            });

    }
    const handleCancel = e => {
        form.resetFields();
        setShowModal(false);
        setCurrentModalData(null);
    }

    const onValuesChangeHandler = (changedValues, allValues) => {
        // console.log('changedValues', changedValues);
        // console.log('allValuesChange', allValues);
        const { size, color, sexes } = allValues;
        let variants = [];
        for (const c of color) {
            for (const s of size) {
                for (const sex of sexes) {
                    variants.push({ color: c, size: s, sexes: sex, active: true });
                }
            }
        }
        setVariantsData(variants);
        if (color.length > 0) {
            setVariantsColumn(prevState => {
                return [
                    ...prevState,
                    {

                        title: <Text ellipsis={true}>Màu</Text>,
                        dataIndex: 'color',
                        render: (text, record, index) => <Text>{findName(record.color, colorList)}</Text>,
                        width: 'auto'

                    }
                ]
            });
        }
        if (size.length > 0) {
            setVariantsColumn(prevState => {
                return [
                    ...prevState,
                    {
                        title: <Text ellipsis={true}>Size</Text>,
                        dataIndex: 'size',
                        render: (text, record, index) => <Text>{findName(record.size, sizeList)}</Text>,
                        width: 'auto'
                    }
                ]
            });
        }
        if (sexes.length > 0) {
            setVariantsColumn(prevState => {
                return [
                    ...prevState,
                    {
                        title: <Text ellipsis={true}>Nam hay nữ</Text>,
                        dataIndex: 'sexes',
                        render: (text, record, index) => <Text>{record.sexes}</Text>,
                        width: 'auto'
                    }
                ]
            });
        }
    }

    const findName = (_id, list) => {
        return list.find(x => x._id === _id).name;
    }

    const variantsCheckHandler = (checked, index) => {
        setVariantsData(prevState => {
            prevState[index].active = checked;
            return prevState;
        });
    }

    // const variantsColumn = [
    //     {
    //         title: <Text ellipsis={true}>#</Text>,
    //         dataIndex: 'index',
    //         render: (text, record, index) => <Text>{index + 1}</Text>,
    //         width: '2%',
    //         align: 'center'
    //     },
    //     {
    //         title: <Text ellipsis={true}>Màu</Text>,
    //         dataIndex: 'color',
    //         render: (text, record, index) => <Text>{findName(record.color, colorList)}</Text>,
    //         width: 'auto'
    //     },
    //     {
    //         title: <Text ellipsis={true}>Size</Text>,
    //         dataIndex: 'size',
    //         render: (text, record, index) => <Text>{findName(record.size, sizeList)}</Text>,
    //         width: 'auto'
    //     },
    //     {
    //         title: <Text ellipsis={true}>Nam hay nữ</Text>,
    //         dataIndex: 'sexes',
    //         render: (text, record, index) => <Text>{record.sexes}</Text>,
    //         width: 'auto'
    //     },
    //     {
    //         title: <Text ellipsis={true}>Kích hoạt</Text>,
    //         dataIndex: 'active',
    //         width: '10%',
    //         render: (text, record, index) => (
    //             <div style={{ textAlign: 'center' }}>
    //                 <Switch defaultChecked={record.active} onChange={(checked, event) => variantsCheckHandler(checked, index)} />
    //             </div>
    //         )
    //     }
    // ]

    return (
        <>
            <Table
                bordered
                columns={columns}
                rowKey={hang => hang._id}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={tableChange}
            />
            <div style={{ display: 'flex', marginTop: '1rem' }}>
                <Button type='primary' size='large' onClick={e => showModalFunc()}><PlusSquareFilled /></Button>
            </div>
            <Modal
                title={<Title level={3}>{`${currentModalData ? `Chỉnh sửa` : `Tạo mới`} hàng`}</Title>}
                visible={showModal}
                onOk={handleOK}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                width='70%'
            >
                <Form
                    form={form}
                    layout='vertical'
                    name='hanghoaForm'
                    preserve={false}
                    onValuesChange={onValuesChangeHandler}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridColumnGap: '1rem' }}>
                        <div>
                            <Form.Item
                                name='name'
                                label={<Title level={5}>Tên hàng</Title>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Không được để tên hàng trống'
                                    }
                                ]}
                            >
                                <Input placeholder="Tên hàng" />
                            </Form.Item>
                            <Form.Item
                                name='description'
                                label={<Title level={5}>Mô tả hàng</Title>}
                            >
                                <TextArea autoSize={{ minRows: 6, maxRows: 10 }} placeholder='Mô tả hàng' />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item
                                name='color'
                                label={<Title level={5}>Màu sắc hàng</Title>}
                            >
                                <Select
                                    mode="multiple"
                                    showArrow
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Chọn màu"
                                    tagRender={tagRender}
                                    size='large'
                                    options={colorList.map(color => ({ label: color.name, value: color._id }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='size'
                                label={<Title level={5}>Size hàng</Title>}
                            >
                                <Select
                                    mode="multiple"
                                    showArrow
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Chọn size"
                                    tagRender={tagRender}
                                    size='large'
                                    options={sizeList.map(size => ({ label: size.name, value: size._id }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='sexes'
                                label={<Title level={5}>Đồ Nam hay Nữ</Title>}
                            >
                                <Select
                                    mode="multiple"
                                    showArrow
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Chọn giới tính"
                                    tagRender={tagRender}
                                    size='large'
                                    options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }]}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
                <Title level={5}>Các phiên bản hàng</Title>
                <Table
                    bordered
                    columns={variantsColumn}
                    rowKey={hang => hang.color + hang.sexes + hang.size}
                    dataSource={variantsData}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </>
    );
}

export default Hanghoa;