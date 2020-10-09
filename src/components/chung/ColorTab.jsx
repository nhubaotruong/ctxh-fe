import { useState, useEffect } from 'preact/hooks';
import { Table, Modal, Button, Popconfirm, Input, Form, message, Typography, Switch } from 'antd';
import { EditFilled, DeleteFilled, PlusSquareFilled } from '@ant-design/icons'
import { getColorPage, createColor, updateColor, deleteColor } from '../../utils/color.js';

const { Text, Title } = Typography;

const ColorTab = () => {

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
            title: <Title ellipsis={true} level={5}>Tên màu</Title>,
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
        let res = await getColorPage(pageNumber, pageSize);
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
        await deleteColor(_id);
        message.success('Xoá thành công');
        fetchData(pagination.current, pagination.pageSize);
    }

    const switchOnChange = async (checked, _id) => {
        await updateColor(_id, { active: checked });
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
                    await createColor(values);
                    message.success('Tạo mới thành công');
                    fetchData(pagination.current, pagination.pageSize);
                } else {
                    await updateColor(currentModalData._id, values);
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
                title={<Title level={3}>{`${currentModalData ? `Chỉnh sửa` : `Tạo mới`} màu sắc`}</Title>}
                visible={showModal}
                onOk={handleOK}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <Form
                    form={form}
                    layout='vertical'
                    name='colorForm'
                    preserve={false}
                >
                    <Form.Item
                        name='name'
                        label={<Title level={5}>Tên màu</Title>}
                        rules={[
                            {
                                required: true,
                                message: 'Không được để tên màu trống'
                            }
                        ]}
                    >
                        <Input placeholder="Tên màu" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ColorTab;