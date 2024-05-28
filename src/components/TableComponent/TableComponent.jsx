import { Dropdown, Space, Table } from 'antd';
import React, { useMemo, useState } from 'react'
import Loading from '../LoadingComponent/Loading';
import { DownOutlined } from '@ant-design/icons';
import { Excel } from 'antd-table-saveas-excel';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], columns = [], isPending = false, handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
        const filter = columns?.filter((col) => col.dataIndex !== 'action')
        return filter
    }, [columns])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            disabled: true,
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item (disabled)
                </a>
            ),
            disabled: true,
        },
        {
            key: '4',
            danger: true,
            label: 'a danger item',
        },
    ];

    const handleClick = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };

    return (
        <Loading isPending={isPending}>
            <div>
                {rowSelectedKeys.length > 0 && (
                    <Dropdown
                        menu={{
                            items,
                        }}
                    >
                        <a onClick={handleDeleteAll}>
                            <Space>
                                Hover me
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                )}

            </div>

            <button onClick={handleClick}> Export excel </button>

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent