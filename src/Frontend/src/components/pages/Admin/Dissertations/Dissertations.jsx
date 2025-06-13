import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Space, Table, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = "http://localhost:3000/dissertation";

const Dissertations = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  // Tüm tezleri getir
  const getAllDissertations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching dissertations:", error);
      message.error("Tezler alınırken bir hata oluştu.");
    }
  };

  // Tez silme işlemi
  const deleteDissertation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Silme işlemi başarılı.");
      getAllDissertations(); // Verileri yeniden çek
    } catch (error) {
      console.error("Error deleting dissertation:", error);
      message.error("Silme işlemi sırasında bir hata oluştu.");
    }
  };

  useEffect(() => {
    getAllDissertations();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Type",
      dataIndex: "dissertationType",
      key: "dissertationType",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Link",
      dataIndex: "dissertationLink",
      key: "dissertationLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Yapabilecekleriniz",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/dissertation/update/${record.id}`)} // ID ile yönlendirme
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteDissertation(record.id)} // Silme işlemini burada tetikleyin
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
        rowKey={(record) => record._id} // ID alanını rowKey olarak kullan
      />
    </div>
  );
};

export default Dissertations;
