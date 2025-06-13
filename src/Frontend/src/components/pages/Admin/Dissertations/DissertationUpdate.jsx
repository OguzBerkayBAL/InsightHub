import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DissertationUpdate = () => {
  const { id } = useParams(); // URL'den id parametresini almak
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3000/dissertation";
  const token = localStorage.getItem("token");

  // Tez verilerini çekme fonksiyonu
  const getDissertation = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues(response.data);
      console.log("Dissertation Data:", response.data);
    } catch (error) {
      console.error("Error fetching dissertation:", error);
      setApiError("Tez verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Güncelleme işlemi
  const updateDissertation = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("Tez başarıyla güncellendi!");
        navigate("/admin/dissertations"); // Başarıyla güncellendikten sonra liste sayfasına yönlendirme
      } else {
        message.error("Tez güncellenirken bir hata oluştu!");
        console.error("Error Details:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Tez güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
    updateDissertation(values);
  };

  useEffect(() => {
    getDissertation(); // Bileşen yüklendiğinde tez verisini al
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>;
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>} {/* Hata mesajı */}
      <Form
        name="update-dissertation"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          label="Tez Başlığı"
          name="title"
          rules={[{ required: true, message: "Lütfen tez başlığını girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Yazar"
          name="author"
          rules={[{ required: true, message: "Lütfen yazar adını girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Üniversite"
          name="university"
          rules={[{ required: true, message: "Lütfen üniversite adını girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tez Linki"
          name="dissertationLink"
          rules={[{ required: true, message: "Lütfen tez linkini girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Yıl"
          name="publicationDate"
          rules={[{ required: true, message: "Lütfen yılı girin!" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default DissertationUpdate;
