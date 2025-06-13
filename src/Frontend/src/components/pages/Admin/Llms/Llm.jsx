import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Space, Table, message } from "antd";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
const apiUrl = "http://localhost:3000/llm";

const Llm = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  // Verileri çekme fonksiyonu
  const getAllTools = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataSource(response.data); // Veriyi 'data' altından alıyoruz
    } catch (error) {
      console.error("Error fetching articles:", error);
      message.error("Makale alınırken bir hata oluştu.");
    }
  };

  // Silme işlemi
  const deleteTool = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // Silme isteği
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
      });
      // Silme işlemi başarılı olduğunda mesaj göster ve veriyi güncelle
      message.success("Silme işlemi başarılı");
      getAllTools(); // Verileri tekrar al ve tabloyu güncelle
    } catch (error) {
      console.error("Error deleting tool:", error);
      message.error("Silme işlemi sırasında bir hata oluştu.");
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
      title: "LLM Name",
      dataIndex: "llmName",
      key: "llmName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "LLM Link",
      dataIndex: "llmLink",
      key: "llmLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "LLM Description",
      dataIndex: "llmDescription",
      key: "llmDescription",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "LLM Type",
      dataIndex: "llmType",
      key: "llmType",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "LLM Year",
      dataIndex: "llmYear",
      key: "llmYear",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Parameters Number",
      dataIndex: "parametersNumber",
      key: "parametersNumber",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "License",
      dataIndex: "license",
      key: "license",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/llm/update/${record.id}`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteTool(record.id)} // Silme işlemini burada çağırıyoruz
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
        dataSource={dataSource} // dataSource'u bağla
        rowKey={(record) => record._id}
        scroll={{ x: "max-content" }} // Yatay kaydırma
      />
    </div>
  );
};

export default Llm;
