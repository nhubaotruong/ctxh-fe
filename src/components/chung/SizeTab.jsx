import { useState, useEffect } from 'preact/hooks';
import { Layout, Table, Modal, Button, Tabs, Popconfirm, Input, Form, message, Typography, Switch } from 'antd';
import { EditFilled, DeleteFilled, PlusSquareFilled } from '@ant-design/icons'
import { getSizePage, createSize, updateSize, deleteSize } from '../../utils/size.js';

const { Text, Title } = Typography;

const SizeTab = () => {

    // Table
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, hideOnSinglePage: true, pageSizeOptions: [10, 20, 50, 100], showSizeChanger: true });
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
            title: <Title ellipsis={true} level={5}>Tên size</Title>,
            dataIndex: 'name',
            render: (text, record, index) => <Text>{record.name}</Text>,
            width: '70%'
        },
        {
            title: <Title ellipsis={true} level={5}>Kích hoạt</Title>,
            dataIndex: 'active',
            render: (text, record, index) => (<div style={{ textAlign: "center" }}><Switch defaultChecked={record.active} onChange={(checked, event) => switchOnChange(checked, record._id)} /></div>),
            width: '10%'
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
        let res = await getSizePage(pageNumber, pageSize);
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
        await deleteSize(_id);
        message.success('Xoá thành công')
        fetchData(pagination.current, pagination.pageSize);
    }

    const switchOnChange = async (checked, _id) => {
        await updateSize(_id, { active: checked });
        message.success('Cập nhật thành công');
        fetchData(pagination.current, pagination.pageSize);
    }

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentModalData, setCurrentModalData] = useState(null);

    const [form] = Form.useForm();

    const showModalFunc = data => {
        setCurrentModalData(data);
        form.setFieldsValue({
            name: data?.name
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
                    await createSize(values);
                    message.success('Tạo mới thành công');
                    fetchData(pagination.current, pagination.pageSize);
                } else {
                    await updateSize(currentModalData._id, values);
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

    return (
        <>
            <Table
                bordered
                columns={columns}
                rowKey={color => color._id}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={tableChange}
            />
            <div style={{ display: 'flex', marginTop: '1rem' }}>
                <Button type='primary' size='large' onClick={e => showModalFunc()}><PlusSquareFilled /></Button>
            </div>
            <Modal
                title={<Title level={3}>{`${currentModalData ? `Chỉnh sửa` : `Tạo mới`} size`}</Title>}
                visible={showModal}
                onOk={handleOK}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <Form
                    form={form}
                    layout='vertical'
                    name='sizeForm'
                    preserve={false}
                >
                    <Form.Item
                        name='name'
                        label={<Title level={5}>Tên size</Title>}
                        rules={[
                            {
                                required: true,
                                message: 'Không được để tên size trống'
                            }
                        ]}
                    >
                        <Input placeholder="Tên size" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default SizeTab;