import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Space, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = "http://localhost:3000/dataSet";

const Dataset = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  // Tüm datasetleri getir
  const getAllDataSets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      message.error("Datasetler alınırken bir hata oluştu.");
    }
  };

  // Dataset silme işlemi
  const deleteDataset = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Silme işlemi başarılı.");
      getAllDataSets(); // Verileri tekrar çek
    } catch (error) {
      console.error("Error deleting dataset:", error);
      message.error("Silme işlemi sırasında bir hata oluştu.");
    }
  };

  useEffect(() => {
    getAllDataSets();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Dataset Name",
      dataIndex: "datasetName",
      key: "datasetName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Dataset Link",
      dataIndex: "datasetLink",
      key: "datasetLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Dataset Description",
      dataIndex: "datasetDescription",
      key: "datasetDescription",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Dataset Type",
      dataIndex: "datasetType",
      key: "datasetType",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Dataset Year",
      dataIndex: "datasetYear",
      key: "datasetYear",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Dataset Format",
      dataIndex: "datasetFormat",
      key: "datasetFormat",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "License",
      dataIndex: "license",
      key: "license",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Yapabilecekleriniz",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/dataset/update/${record.id}`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteDataset(record.id)} // Silme işlemi burada çağrılıyor
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="danger">Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id} // ID alanını rowKey olarak bağla
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Dataset;
