import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 

const apiUrl = "http://localhost:3000/tool";

const Tool = () => {
  const [dataSource, setDataSource] = useState([]);  
  const navigate = useNavigate();

  // Tüm araçları getiren fonksiyon
  const getAllTools = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataSource(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Araçlar alınırken bir hata oluştu:", error);
      message.error("Araçlar alınırken bir hata oluştu.");
    }
  };

  // Araç silme fonksiyonu
  const deleteTool = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Silinen aracı listeden çıkar
      setDataSource(dataSource.filter((item) => item.id !== id));
      message.success("Araç başarıyla silindi.");
    } catch (error) {
      console.error("Araç silinirken bir hata oluştu:", error);
      message.error("Araç silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    getAllTools();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Tool Name",
      dataIndex: "toolName",
      key: "toolName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Tool Link",
      dataIndex: "toolLink",
      key: "toolLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Tool Description",
      dataIndex: "toolDescription",
      key: "toolDescription",
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
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/tool/update/${record.id}`)}>Düzenle</Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteTool(record.id)} // Silme işlemi
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
        rowKey={(record) => record.id} // Benzersiz bir anahtar kullanılıyor
        scroll={{ x: 'max-content' }} // Yatay kaydırma
      />
    </div>
  );
};

export default Tool;
